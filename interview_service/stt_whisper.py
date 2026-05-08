from __future__ import annotations

try:
    import numpy as np
except Exception:  # pragma: no cover
    np = None


class WhisperSTT:
    def __init__(self, model_size: str = "base", language: str = "fr"):
        if np is None:
            raise RuntimeError("Missing numpy (install requirements-stt.txt)")
        try:
            from faster_whisper import WhisperModel
        except Exception as e:  # pragma: no cover
            raise RuntimeError("Missing faster-whisper (install requirements-stt.txt)") from e

        # cpu is default; for GPU set compute_type="float16" + device="cuda"
        self.model = WhisperModel(model_size, device="cpu", compute_type="int8")
        self.language = language

    def transcribe_pcm16le(self, pcm16: bytes, sample_rate: int = 16000) -> str:
        if not pcm16:
            return ""

        audio_i16 = np.frombuffer(pcm16, dtype=np.int16)
        if audio_i16.size == 0:
            return ""
        audio_f32 = (audio_i16.astype(np.float32) / 32768.0).clip(-1.0, 1.0)

        segments, _info = self.model.transcribe(
            audio_f32,
            language=self.language,
            vad_filter=True,
            vad_parameters={"min_silence_duration_ms": 400},
        )

        text_parts = []
        for seg in segments:
            if seg.text:
                text_parts.append(seg.text.strip())
        return " ".join(text_parts).strip()

