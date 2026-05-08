from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass
class InterviewSession:
    id: str
    user_id: int
    cv_text: str
    created_at: float = field(default_factory=lambda: time.time())
    history: List[dict] = field(default_factory=list)  # [{role: "user"|"assistant", content: str}]

    # runtime flags (not persisted)
    busy: bool = False

    def push(self, role: str, content: str) -> None:
        self.history.append({"role": role, "content": content})
        # Keep only last 6 messages
        if len(self.history) > 6:
            self.history = self.history[-6:]


_SESSIONS: Dict[str, InterviewSession] = {}


def create_session(*, session_id: str, user_id: int, cv_text: str) -> InterviewSession:
    s = InterviewSession(id=session_id, user_id=user_id, cv_text=cv_text or "")
    _SESSIONS[session_id] = s
    return s


def get_session(session_id: str) -> Optional[InterviewSession]:
    return _SESSIONS.get(session_id)


def delete_session(session_id: str) -> None:
    _SESSIONS.pop(session_id, None)

