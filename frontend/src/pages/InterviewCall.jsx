import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const API_BASE = "http://localhost:8000/api";

function hexToUint8Array(hex) {
  if (!hex) return new Uint8Array();
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

export default function InterviewCall() {
  const token = useMemo(() => localStorage.getItem("token"), []);

  const [connectionState, setConnectionState] = useState("idle"); // idle|connecting|connected|reconnecting|error
  const [callState, setCallState] = useState("idle"); // idle|listening|ai_speaking|ended
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]); // {from:'user'|'ai', text}

  const wsRef = useRef(null);
  const audioCtxRef = useRef(null);
  const micStreamRef = useRef(null);
  const workletNodeRef = useRef(null);
  const sendEnabledRef = useRef(false);
  const reconnectRef = useRef({ attempt: 0, timer: null, want: false });

  // audio playback queue (avoid overlap)
  const audioQueueRef = useRef([]);
  const audioPlayingRef = useRef(false);

  const stopMic = useCallback(async () => {
    sendEnabledRef.current = false;

    try {
      if (workletNodeRef.current) {
        workletNodeRef.current.port.onmessage = null;
        workletNodeRef.current.disconnect();
      }
    } catch {
      // ignore
    } finally {
      workletNodeRef.current = null;
    }

    try {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    } catch {
      // ignore
    } finally {
      micStreamRef.current = null;
    }

    try {
      if (audioCtxRef.current) await audioCtxRef.current.close();
    } catch {
      // ignore
    } finally {
      audioCtxRef.current = null;
    }
  }, []);

  const startMic = useCallback(async () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    if (callState === "ai_speaking") return;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;
    micStreamRef.current = stream;

    await audioCtx.audioWorklet.addModule(new URL("../audioProcessor.js", import.meta.url));
    const source = audioCtx.createMediaStreamSource(stream);
    const node = new AudioWorkletNode(audioCtx, "pcm16-downsampler");
    workletNodeRef.current = node;

    node.port.onmessage = (ev) => {
      if (!sendEnabledRef.current) return;
      const buf = ev.data;
      if (!buf) return;
      try {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(buf);
        }
      } catch {
        // ignore send failures (reconnect will handle)
      }
    };

    // keep node alive but mute output
    const gain = audioCtx.createGain();
    gain.gain.value = 0;
    source.connect(node).connect(gain).connect(audioCtx.destination);

    sendEnabledRef.current = true;
    setCallState("listening");
  }, [callState]);

  const playNextAudio = useCallback(async () => {
    if (audioPlayingRef.current) return;
    const next = audioQueueRef.current.shift();
    if (!next) return;

    audioPlayingRef.current = true;
    setCallState("ai_speaking");

    // Half-duplex: stop mic while AI speaks
    await stopMic();

    try {
      await new Promise((resolve, reject) => {
        const el = new Audio(next.url);
        el.onended = resolve;
        el.onerror = reject;
        el.play().catch(reject);
      });
    } catch {
      // ignore playback errors
    } finally {
      try {
        URL.revokeObjectURL(next.url);
      } catch {
        // ignore
      }
      audioPlayingRef.current = false;
    }

    // Resume listening if still in call
    if (reconnectRef.current.want && wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        await startMic();
      } catch {
        // ignore
      }
    } else {
      setCallState((s) => (s === "ended" ? "ended" : "idle"));
    }

    // Continue queue
    if (audioQueueRef.current.length > 0) {
      playNextAudio();
    }
  }, [startMic, stopMic]);

  const handleWsMessage = useCallback(
    (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === "error") {
          if (msg.detail) setError(msg.detail);
          return;
        }
        if (msg.type === "recruiter_response") {
          if (msg.text) {
            setMessages((m) => [...m, { from: "ai", text: msg.text }]);
          }
          const bytes = hexToUint8Array(msg.audio || "");
          if (bytes.length > 0) {
            const blob = new Blob([bytes], { type: "audio/wav" });
            const url = URL.createObjectURL(blob);
            audioQueueRef.current.push({ url });
            playNextAudio();
          } else {
            // no backend audio => browser TTS fallback + keep half-duplex behavior
            if (msg.text && "speechSynthesis" in window) {
              try {
                setCallState("ai_speaking");
                stopMic().finally(() => {
                  const utter = new SpeechSynthesisUtterance(msg.text);
                  utter.lang = "fr-FR";
                  utter.rate = 1.02;
                  utter.onend = () => {
                    if (reconnectRef.current.want) startMic();
                  };
                  window.speechSynthesis.cancel();
                  window.speechSynthesis.speak(utter);
                });
              } catch {
                if (reconnectRef.current.want) startMic();
              }
            } else if (reconnectRef.current.want) {
              startMic();
            }
          }
        }
      } catch {
        // ignore
      }
    },
    [playNextAudio, startMic, stopMic]
  );

  const connectWs = useCallback(
    (sid, mode) => {
      if (!token) {
        setError("Vous devez être connecté (token manquant).");
        setConnectionState("error");
        return;
      }

      setConnectionState(mode === "reconnect" ? "reconnecting" : "connecting");
      setError("");

      const wsUrl = `ws://localhost:8000/ws/interview/${sid}/?token=${encodeURIComponent(token)}`;
      const ws = new WebSocket(wsUrl);
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;

      ws.onopen = async () => {
        reconnectRef.current.attempt = 0;
        setConnectionState("connected");
        try {
          await startMic();
        } catch (e) {
          setError("Impossible d'activer le micro. Vérifiez les permissions.");
        }
      };

      ws.onmessage = handleWsMessage;

      ws.onerror = () => {
        // let onclose handle reconnect
      };

      ws.onclose = async () => {
        await stopMic();
        setCallState((s) => (s === "ended" ? "ended" : "idle"));
        if (!reconnectRef.current.want) {
          setConnectionState("idle");
          return;
        }
        const attempt = (reconnectRef.current.attempt += 1);
        const delay = Math.min(8000, 500 * 2 ** (attempt - 1));
        setConnectionState("reconnecting");
        reconnectRef.current.timer = setTimeout(() => connectWs(sid, "reconnect"), delay);
      };
    },
    [handleWsMessage, startMic, stopMic, token]
  );

  const startCall = useCallback(async () => {
    setError("");
    if (!token) {
      setError("Veuillez vous connecter avant de démarrer l'appel.");
      return;
    }

    reconnectRef.current.want = true;
    setConnectionState("connecting");
    setCallState("idle");

    try {
      const res = await fetch(`${API_BASE}/interview/start`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Erreur start interview");

      setSessionId(data.session_id);
      setMessages([]);
      connectWs(data.session_id, "connect");
    } catch (e) {
      setConnectionState("error");
      setError(e.message || "Erreur réseau");
      reconnectRef.current.want = false;
    }
  }, [connectWs, token]);

  const endCall = useCallback(async () => {
    reconnectRef.current.want = false;
    if (reconnectRef.current.timer) clearTimeout(reconnectRef.current.timer);

    setCallState("ended");
    setConnectionState("idle");

    await stopMic();

    try {
      if (wsRef.current) wsRef.current.close();
    } catch {
      // ignore
    } finally {
      wsRef.current = null;
    }

    if (sessionId && token) {
      try {
        await fetch(`${API_BASE}/interview/${sessionId}`, {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        });
      } catch {
        // ignore
      }
    }

    setSessionId(null);
  }, [sessionId, stopMic, token]);

  // cleanup
  useEffect(() => {
    return () => {
      reconnectRef.current.want = false;
      if (reconnectRef.current.timer) clearTimeout(reconnectRef.current.timer);
      try {
        wsRef.current?.close();
      } catch {
        // ignore
      }
      stopMic();
    };
  }, [stopMic]);

  const statusLabel = useMemo(() => {
    if (connectionState === "connecting") return "connecting";
    if (connectionState === "reconnecting") return "connecting";
    if (connectionState === "connected") {
      if (callState === "ai_speaking") return "AI speaking";
      if (callState === "listening") return "listening";
      return "connected";
    }
    return "idle";
  }, [callState, connectionState]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Interview vocal temps réel</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Status: {statusLabel}</div>
          {sessionId && <div style={{ fontSize: 12, opacity: 0.7 }}>Session: {sessionId}</div>}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={startCall}
            disabled={connectionState === "connecting" || connectionState === "connected" || connectionState === "reconnecting"}
            style={{ padding: "10px 14px", fontWeight: 700, borderRadius: 10 }}
          >
            Start Call
          </button>
          <button
            onClick={endCall}
            disabled={!sessionId}
            style={{ padding: "10px 14px", fontWeight: 700, borderRadius: 10 }}
          >
            End Call
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginTop: 12, padding: 10, borderRadius: 10, background: "#fee2e2", color: "#991b1b", fontWeight: 600 }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: 18, padding: 14, borderRadius: 14, background: "rgba(0,0,0,0.04)" }}>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>Conversation</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.length === 0 ? (
            <div style={{ opacity: 0.7 }}>Démarre l’appel pour commencer.</div>
          ) : (
            messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "10px 12px",
                  borderRadius: 14,
                  background: m.from === "user" ? "#dbeafe" : "#e5e7eb",
                  color: "#111827",
                  whiteSpace: "pre-wrap",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.7, marginBottom: 4 }}>
                  {m.from === "user" ? "Vous" : "Recruteur IA"}
                </div>
                <div style={{ fontSize: 14 }}>{m.text}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

