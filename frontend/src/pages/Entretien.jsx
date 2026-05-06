/**
 * @file Entretien.jsx
 * @description Page Simulation Entretien Vocal — CareerPilot
 * @author Fatima Zahra MARGHICH
 * @version 1.0.0
 */

import { useState, useEffect, useRef } from "react";
import Sidebar, { C } from "./Sidebar";
import { useAppSettings } from "../context/AppSettingsContext";

const QUESTIONS = [
  "Décrivez votre expérience avec React et les architectures microservices.",
  "Comment gérez-vous les conflits dans une équipe Agile ?",
  "Expliquez votre projet principal le plus complexe.",
  "Quelles sont vos forces et vos axes d'amélioration ?",
  "Où vous voyez-vous dans 3 ans ?",
];

const MOTS_CLES = ["React","API REST","Docker","Microservices","TypeScript"];

function WaveAnimation({ active }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:4, height:48 }}>
      {[...Array(12)].map((_,i) => (
        <div key={i} style={{
          width:4, borderRadius:2,
          background: active
            ? `linear-gradient(180deg, ${C.primary}, ${C.secondary})`
            : "rgba(255,255,255,0.2)",
          height: active ? `${12 + Math.sin(i * 0.8) * 18 + Math.random() * 10}px` : "8px",
          animation: active ? `wave${i%4} ${0.6 + i*0.1}s ease-in-out infinite alternate` : "none",
          transition:"height 0.3s",
        }} />
      ))}
      <style>{`
        @keyframes wave0{from{height:12px}to{height:36px}}
        @keyframes wave1{from{height:20px}to{height:44px}}
        @keyframes wave2{from{height:14px}to{height:30px}}
        @keyframes wave3{from{height:18px}to{height:40px}}
      `}</style>
    </div>
  );
}

export default function Entretien() {
  const { theme } = useAppSettings();

  const [status,    setStatus]    = useState("idle");
  const [qIndex,    setQIndex]    = useState(0);
  const [timer,     setTimer]     = useState(0);
  const [progress,  setProgress]  = useState([1]);
  const [transcript,setTranscript]= useState("");
  const [rythme,    setRythme]    = useState(85);
  const [assurance, setAssurance] = useState(92);
  const [clarte,    setClarte]    = useState(78);
  const timerRef = useRef(null);

  useEffect(() => {
    if (status === "active" || status === "listening") {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const handleStart = () => setStatus("active");
  const handleAnswer = () => {
    setStatus("listening");
    setTranscript("Pendant mon dernier projet chez TechCorp, j'ai implémenté une architecture...");
    setTimeout(() => {
      const next = qIndex + 1;
      if (next >= QUESTIONS.length) { setStatus("done"); window.location.href="/entretien/rapport"; }
      else { setQIndex(next); setProgress(p => [...p, next+1]); setStatus("active"); setTranscript(""); }
    }, 3000);
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:theme.bg, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0}`}</style>
      <Sidebar activeId="entretien" />

      <main style={{ marginLeft:220, flex:1, padding:"32px 40px", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
          <div>
            <div style={{ fontSize:13, color:theme.muted, marginBottom:6 }}>CareerPilot / Entretien</div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:theme.text, margin:0 }}>
              Simulation d'Entretien Vocal
            </h1>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {status !== "idle" && (
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, color:theme.muted }}>Développeur Full Stack</span>
                <span style={{ fontSize:13, color:theme.muted }}>⏱ {fmt(timer)}</span>
              </div>
            )}
            {(status==="active"||status==="listening") && (
              <span style={{ fontSize:12, fontWeight:700, padding:"5px 12px", borderRadius:50, background:"#DCFCE7", color:"#16A34A", fontFamily:"'Syne',sans-serif", display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E", display:"inline-block", animation:"blink 1s infinite" }} />
                SESSION ACTIVE
              </span>
            )}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:24 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {status === "idle" ? (
              <div style={{ background:C.sidebarBg||"#0F0A1E", borderRadius:24, padding:48, textAlign:"center" }}>
                <div style={{
                  width:80, height:80, borderRadius:"50%",
                  background:theme.gradient, margin:"0 auto 24px",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:"0 0 40px rgba(200,24,122,0.4)",
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                </div>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#fff", margin:"0 0 12px" }}>
                  Prêt pour votre entretien ?
                </h2>
                <p style={{ fontSize:14, color:"rgba(255,255,255,0.6)", lineHeight:1.7, marginBottom:32, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                  L'IA vous posera 5 questions personnalisées.<br/>
                  Répondez à voix haute pour une expérience réaliste.
                </p>
                <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap", marginBottom:32 }}>
                  {["5 Questions","~15 min","Analyse vocale"].map(f => (
                    <div key={f} style={{ background:"rgba(255,255,255,0.08)", borderRadius:10, padding:"8px 16px", fontSize:12, color:"rgba(255,255,255,0.7)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{f}</div>
                  ))}
                </div>
                <button onClick={handleStart} style={{
                  background:theme.gradient, border:"none", color:"#fff",
                  fontSize:15, fontWeight:700, padding:"14px 36px", borderRadius:14,
                  cursor:"pointer", fontFamily:"'Syne',sans-serif",
                  boxShadow:"0 8px 24px rgba(200,24,122,0.4)",
                }}>
                  🎤 Démarrer l'entretien
                </button>
              </div>
            ) : (
              <div style={{ background:"#0F0A1E", borderRadius:24, padding:32, minHeight:380 }}>
                <div style={{ textAlign:"center", marginBottom:24 }}>
                  <div style={{
                    width:64, height:64, borderRadius:"50%",
                    background: status==="listening" ? "rgba(200,24,122,0.3)" : "rgba(123,47,247,0.3)",
                    margin:"0 auto 16px",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow: status==="active" ? "0 0 30px rgba(200,24,122,0.4)" : "0 0 30px rgba(123,47,247,0.3)",
                  }}>
                    <WaveAnimation active={status==="active"||status==="listening"} />
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, color: status==="listening" ? C.primary : C.secondary, fontFamily:"'Syne',sans-serif", letterSpacing:"0.1em" }}>
                    {status==="active" ? "IA ACTIVE" : "EN ÉCOUTE..."}
                  </span>
                </div>

                <div style={{ textAlign:"center", marginBottom:24 }}>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:12, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                    Question {qIndex+1} sur {QUESTIONS.length}
                  </div>
                  <div style={{
                    background:"rgba(255,255,255,0.06)", borderRadius:16, padding:"20px 24px",
                    fontSize:16, fontWeight:600, color:"#fff", lineHeight:1.6,
                    fontFamily:"'Plus Jakarta Sans',sans-serif",
                    border:"1px solid rgba(255,255,255,0.08)",
                  }}>
                    "{QUESTIONS[qIndex]}"
                  </div>
                </div>

                {transcript && (
                  <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"12px 16px", marginBottom:16, border:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize:11, color:C.primary, fontFamily:"'Syne',sans-serif", marginBottom:6 }}>TRANSCRIPTION LIVE</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", fontFamily:"'Plus Jakarta Sans',sans-serif", lineHeight:1.6 }}>
                      Vous: {transcript}
                    </div>
                  </div>
                )}

                {status === "active" && (
                  <div style={{ display:"flex", gap:10, background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"10px 14px", border:"1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontSize:16 }}>💡</span>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", fontFamily:"'Plus Jakarta Sans',sans-serif", lineHeight:1.5 }}>
                      <strong style={{ color:"rgba(255,255,255,0.8)" }}>Conseil de l'IA :</strong> Pensez à mentionner l'orchestration avec Docker ou Kubernetes si vous l'avez utilisé.
                    </div>
                  </div>
                )}

                {status === "active" && (
                  <div style={{ textAlign:"center", marginTop:24 }}>
                    <button onClick={handleAnswer} style={{
                      background:theme.gradient, border:"none", color:"#fff",
                      fontSize:14, fontWeight:700, padding:"12px 28px", borderRadius:12,
                      cursor:"pointer", fontFamily:"'Syne',sans-serif",
                      display:"inline-flex", alignItems:"center", gap:10,
                      boxShadow:"0 4px 20px rgba(200,24,122,0.4)",
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/></svg>
                      Répondre
                    </button>
                  </div>
                )}
              </div>
            )}

            {status !== "idle" && (
              <div style={{ background:theme.card, borderRadius:16, padding:20, border:`1px solid ${theme.border}`, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:13, color:theme.muted, fontFamily:"'Plus Jakarta Sans',sans-serif", marginRight:4 }}>PROGRESSION</span>
                {QUESTIONS.map((_,i) => (
                  <div key={i} style={{
                    width:32, height:32, borderRadius:"50%", fontSize:13, fontWeight:700,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    background: progress.includes(i+1) ? theme.gradient : theme.border,
                    color: progress.includes(i+1) ? "#fff" : theme.muted,
                    fontFamily:"'Syne',sans-serif",
                    boxShadow: progress.includes(i+1) ? "0 2px 8px rgba(200,24,122,0.3)" : "none",
                    border: i+1 === qIndex+1 && status!=="idle" ? `2px solid ${C.primary}` : "none",
                    transition:"all 0.3s",
                  }}>{i+1}</div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ background:theme.card, borderRadius:20, padding:20, border:`1px solid ${theme.border}` }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:theme.text, margin:"0 0 20px" }}>FEEDBACK EN TEMPS RÉEL</h3>

              <div style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:12, color:theme.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>RYTHME VOCAL</span>
                  <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:50, background:"#DCFCE7", color:"#16A34A", fontFamily:"'Syne',sans-serif" }}>OPTIMAL</span>
                </div>
                <div style={{ height:6, background:theme.border, borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:3, background:theme.gradient, width:`${rythme}%`, transition:"width 0.5s" }} />
                </div>
                <div style={{ fontSize:11, color:theme.muted, marginTop:4, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Élocution fluide et posée</div>
              </div>

              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, color:theme.muted, fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:10 }}>TON & ATTITUDE</div>
                {[{label:"ASSURANCE",val:assurance,color:C.primary},{label:"CLARTÉ",val:clarte,color:C.secondary}].map(m => (
                  <div key={m.label} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:11, color:theme.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{m.label}</span>
                      <span style={{ fontSize:11, fontWeight:700, color:m.color, fontFamily:"'Syne',sans-serif" }}>{m.val}%</span>
                    </div>
                    <div style={{ height:5, background:theme.border, borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:3, background:m.color, width:`${m.val}%`, transition:"width 0.5s" }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, color:theme.muted, fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:8 }}>MOTS-CLÉS DÉTECTÉS</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {MOTS_CLES.slice(0, status==="active" ? 3 : 0).map(k => (
                    <span key={k} style={{ fontSize:11, fontWeight:600, padding:"4px 10px", borderRadius:50, background:theme.gradientLight, color:C.primary, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{k}</span>
                  ))}
                  {status==="idle" && <span style={{ fontSize:12, color:theme.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Démarrez l'entretien</span>}
                </div>
              </div>
            </div>

            {status !== "idle" && (
              <button style={{
                background:theme.card, border:`1px solid ${theme.border}`,
                color:theme.muted, fontSize:13, fontWeight:600, padding:"12px",
                borderRadius:12, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Besoin d'aide ?
              </button>
            )}
          </div>
        </div>
      </main>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}
