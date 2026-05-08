# C:\Users\HP\Documents\GitHub\CareerPilot\interview_service\main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uuid
from datetime import datetime
from ai_engine import generate_ai_response

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Session:
    def __init__(self, session_id, cv_text):
        self.id = session_id
        self.cv_text = cv_text
        self.history = []
        self.started = datetime.now()

    def add(self, role, content):
        self.history.append({"role": role, "content": content})

sessions = {}

@app.post("/start")
async def start(data: dict):
    session_id = str(uuid.uuid4())
    cv_text = data.get("cv_text", "")
    sessions[session_id] = Session(session_id, cv_text)
    return {"session_id": session_id}

@app.websocket("/ws/{session_id}")
async def ws(ws: WebSocket, session_id: str):
    await ws.accept()
    session = sessions.get(session_id)
    
    if not session:
        await ws.close()
        return

    # Première phrase d'accueil
    first = "Bonjour, j'ai bien reçu votre CV. Pouvez-vous vous présenter brièvement ?"
    session.add("recruiter", first)
    await ws.send_json({"type": "ai", "text": first})

    try:
        while True:
            data = await ws.receive_json()
            if data["type"] == "user":
                user_text = data["text"]
                session.add("candidate", user_text)

                # Appel à Groq avec les 3 arguments requis
                ai_text = generate_ai_response(session.cv_text, session.history, user_text)
                session.add("recruiter", ai_text)

                await ws.send_json({"type": "ai", "text": ai_text})
    except WebSocketDisconnect:
        print(f"Session {session_id} déconnectée.")