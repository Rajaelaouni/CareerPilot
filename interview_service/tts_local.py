from __future__ import annotations

import os
import tempfile


def tts_to_wav_bytes(text: str) -> bytes:
    """
    Local TTS using pyttsx3.
    Returns WAV bytes.
    """
    import pyttsx3

    engine = pyttsx3.init()
    # small tweak for phone-like short replies
    try:
        engine.setProperty("rate", 175)
        engine.setProperty("volume", 1.0)
    except Exception:
        pass

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as f:
        tmp_path = f.name

    try:
        engine.save_to_file(text or "", tmp_path)
        engine.runAndWait()
        with open(tmp_path, "rb") as rf:
            return rf.read()
    finally:
        try:
            os.remove(tmp_path)
        except Exception:
            pass

