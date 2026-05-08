from __future__ import annotations

import os
from typing import List, Dict

from openai import OpenAI


_GROQ_BASE_URL = "https://api.groq.com/openai/v1"
_GROQ_MODEL = "llama-3.1-8b-instant"


def _client() -> OpenAI:
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("Missing GROQ_API_KEY env var")
    return OpenAI(api_key=api_key, base_url=_GROQ_BASE_URL)


def generate_response(user_text: str, history: List[Dict], cv_text: str) -> str:
    """
    history: list of {role: "user"|"assistant", content: "..."} (max 6 expected)
    """
    system_prompt = (
        "Tu es un recruteur professionnel et bienveillant. "
        "Tu fais une simulation d'entretien d'embauche basée sur le CV du candidat. "
        "Pose des questions courtes, une seule question à la fois, et reste naturel. "
        "Adapte-toi au CV. Réponds en français. "
        "Contrainte: maximum 20 mots."
        "\n\n"
        f"CV du candidat:\n{cv_text}\n"
    )

    messages = [{"role": "system", "content": system_prompt}]
    # keep history short-side already, but enforce
    for m in (history or [])[-6:]:
        if m.get("role") in ("user", "assistant") and m.get("content"):
            messages.append({"role": m["role"], "content": m["content"]})
    messages.append({"role": "user", "content": user_text or ""})

    resp = _client().chat.completions.create(
        model=_GROQ_MODEL,
        messages=messages,
        temperature=0.5,
        max_tokens=80,
    )

    text = (resp.choices[0].message.content or "").strip()
    # hard trim to ~20 words
    words = text.split()
    if len(words) > 20:
        text = " ".join(words[:20]).rstrip(" .,!?:;") + "."
    return text or "Pouvez-vous préciser ?"

