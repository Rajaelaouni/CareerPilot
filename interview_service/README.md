# 🎙️ CareerPilot Real-Time AI Interview System

Documentation complète pour la simulation d'entretien en temps réel avec IA recruteur.

## 📋 Table of Contents

1. [Architecture](#architecture)
2. [Setup & Installation](#setup--installation)
3. [Configuration](#configuration)
4. [Running the Services](#running-the-services)
5. [API Reference](#api-reference)
6. [Frontend Integration](#frontend-integration)
7. [Audio Pipeline](#audio-pipeline)
8. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Frontend)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Component: InterviewCall                      │   │
│  │  - MediaRecorder API                                 │   │
│  │  - Web Audio API (ScriptProcessor)                   │   │
│  │  - WebSocket Connection                              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓↑ WebSocket
                       (Bidirectional)
┌─────────────────────────────────────────────────────────────┐
│              Backend (FastAPI - Port 8001)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  WebSocket Endpoint: /ws/interview/{session_id}     │   │
│  │                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │   │
│  │  │ Speech-to-   │→ │ AI Response  │→ │ Text-to-  │ │   │
│  │  │ Text (STT)   │  │ Generator    │  │ Speech    │ │   │
│  │  │ (Whisper)    │  │ (GPT-4)      │  │ (TTS)     │ │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓↑ API
                    (OpenAI Services)
┌─────────────────────────────────────────────────────────────┐
│                 OpenAI API (External)                        │
│  - Whisper (Audio → Text)                                   │
│  - GPT-4 (Text → Response)                                  │
│  - TTS (Text → Audio)                                       │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. User Speaks
   └→ Browser captures audio (Web Audio API)
      └→ Sends PCM audio chunks via WebSocket
         └→ Backend receives chunks

2. Backend Processes Audio
   └→ Accumulates chunks until silence
      └→ Converts to WAV format
         └→ Sends to OpenAI Whisper
            └→ Receives transcribed text
               └→ Sends text back to frontend

3. AI Generates Response
   └→ Backend creates GPT-4 prompt
      └→ Includes CV context
         └→ Includes conversation history
            └→ OpenAI returns response text
               └→ Backend sends text to OpenAI TTS

4. Audio Synthesis
   └→ OpenAI generates MP3 audio
      └→ Backend sends MP3 hex to frontend
         └→ Frontend decodes and plays audio
            └→ Conversation continues

5. Repeat Loop
   └→ Frontend listens for next user input
      └→ Cycle repeats
```

---

## 🚀 Setup & Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- OpenAI API Key
- Modern browser with:
  - WebSocket support
  - Web Audio API support
  - MediaRecorder API support

### Step 1: Backend Setup

```bash
# Create virtual environment (if not done)
python -m venv interview_venv

# Activate it
# Windows:
interview_venv\Scripts\activate
# Mac/Linux:
source interview_venv/bin/activate

# Install dependencies
cd interview_service
pip install -r requirements.txt
```

### Step 2: Environment Configuration

```bash
# Create .env file from template
cp .env.example .env

# Edit .env with your OpenAI API key
# Windows:
notepad .env
# Mac/Linux:
nano .env
```

**Required:** Set `OPENAI_API_KEY`

### Step 3: Frontend Setup

```bash
# Install dependencies
cd ../frontend
npm install
```

### Step 4: Update Django Settings (Optional)

If using with Django backend:

```python
# backend_config/settings.py

INSTALLED_APPS = [
    # ... existing apps ...
    # Interview service can run separately
]

# CORS settings already updated for FastAPI
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5174",
    "http://localhost:8001",  # Add interview service
]
```

---

## ⚙️ Configuration

### OpenAI API

```
Models:
- GPT-4: For intelligent interview responses
- Whisper-1: For speech recognition (French supported)
- TTS-1: For voice synthesis

Voices available:
- alloy, echo, fable, onyx (default), nova, shimmer
```

### Audio Settings

```
Sample Rate: 16000 Hz (16kHz) - Recommended for Whisper
Chunk Duration: 0.5 seconds
Chunk Size: 8000 samples
Silence Threshold: 300 (adjust based on environment)
Max Silence: 2 seconds before processing
```

### Interview Settings

```
Max Duration: 30 minutes (adjustable)
Language: French (can be changed to 'en', 'es', etc.)
Temperature: 0.7 (creativity level)
Max Tokens: 150 (response length limit)
```

---

## 🏃 Running the Services

### Terminal 1: FastAPI Interview Service

```bash
cd interview_service

# Make sure .env is configured
python main.py

# Or with uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     FastAPI Interview Service Started
```

### Terminal 2: Django Backend

```bash
cd ..
.venv\Scripts\python manage.py runserver 8000
```

### Terminal 3: React Frontend

```bash
cd frontend
npm run dev
```

### Access Points

- **Frontend:** http://localhost:5174
- **Interview API:** http://localhost:8001
- **Interview Docs:** http://localhost:8001/docs (Swagger UI)
- **Django Admin:** http://localhost:8000/admin

---

## 📡 API Reference

### REST Endpoints

#### Start Interview

```
POST /interviews/start

Body:
{
  "cv_text": "Optional CV content",
  "session_id": "Optional custom ID"
}

Response:
{
  "session_id": "uuid-or-custom-id",
  "status": "started",
  "message": "Initial greeting from AI recruiter"
}
```

#### Get Conversation History

```
GET /interviews/{session_id}/history

Response:
{
  "session_id": "uuid",
  "conversation": [
    {
      "role": "recruiter",
      "content": "...",
      "timestamp": "2024-05-06T10:00:00"
    },
    {
      "role": "candidate",
      "content": "...",
      "timestamp": "2024-05-06T10:01:00"
    }
  ],
  "duration": 123.45  # seconds
}
```

#### End Interview

```
DELETE /interviews/{session_id}

Response:
{
  "session_id": "uuid",
  "status": "ended",
  "messages_count": 12,
  "duration": 600.5
}
```

#### Health Check

```
GET /health

Response:
{
  "status": "ok",
  "service": "interview",
  "active_sessions": 2
}
```

### WebSocket Protocol

#### Connection

```
ws://localhost:8001/ws/interview/{session_id}
```

#### Message Types

**From Client → Server:**

```json
// Audio data (binary)
{
  "type": "binary",
  "data": <Int16Array buffer>
}
```

**From Server → Client:**

```json
// Status Update
{
  "type": "status",
  "status": "listening|transcribing|generating_response|speaking|synthesizing_speech",
  "message": "Optional message"
}

// User Transcription
{
  "type": "transcription",
  "text": "What the user said",
  "timestamp": "2024-05-06T10:00:00"
}

// AI Response
{
  "type": "recruiter_response",
  "text": "What the AI said",
  "audio": "hex-encoded-mp3-data",
  "timestamp": "2024-05-06T10:00:05"
}

// Error
{
  "type": "error",
  "message": "Error description"
}
```

---

## 🎨 Frontend Integration

### Using the InterviewCall Component

```jsx
import InterviewCall from './pages/InterviewCall';

export function YourPage() {
  const sessionId = 'user-session-123';
  const cvText = 'Your CV text here...';

  return (
    <div>
      <InterviewCall 
        sessionId={sessionId} 
        cvText={cvText} 
      />
    </div>
  );
}
```

### Component Props

```typescript
interface InterviewCallProps {
  sessionId: string;        // Unique session identifier
  cvText?: string;          // CV content for context
}
```

### Component States

```
idle              → No active call
connecting        → Initializing connection
listening         → Waiting for user speech
transcribing      → Converting speech to text
generating_response → AI generating reply
speaking          → AI is speaking
synthesizing_speech → Converting response to audio
```

### Component Events

The component handles all events internally but you can monitor:

```jsx
// Check status in parent
const [callStatus, setCallStatus] = useState(null);

// The component emits events via WebSocket
// Monitor via browser DevTools → Console
```

---

## 🎤 Audio Pipeline Explained

### 1. Microphone Capture

```javascript
// Web Audio API setup
const stream = await navigator.mediaDevices.getUserMedia({ 
  audio: { 
    echoCancellation: true,
    noiseSuppression: true 
  } 
});

const audioContext = new AudioContext({ sampleRate: 16000 });
const source = audioContext.createMediaStreamSource(stream);
const processor = audioContext.createScriptProcessor(8000, 1, 1);

processor.onaudioprocess = (event) => {
  const audioData = event.inputData[0];
  // Convert to PCM and send via WebSocket
};
```

### 2. Audio Streaming

```
Chunks sent every 500ms:
- Size: 8000 samples (16-bit PCM)
- Format: Int16Array
- Transport: WebSocket binary frames
- Continuous until silence detected
```

### 3. Speech-to-Text (Whisper)

```python
# Backend receives audio chunks
audio_buffer = accumulate_until_silence()
wav_data = convert_to_wav(audio_buffer)

# Send to Whisper API
transcript = openai.Audio.transcribe(
    model="whisper-1",
    file=wav_data,
    language="fr"
)
```

### 4. AI Response Generation

```python
# Build context-aware prompt
system_prompt = f"""
You are an HR recruiter conducting an interview.
Candidate CV:
{cv_text}

Previous messages:
{conversation_history}
"""

response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[system_prompt, user_message],
    temperature=0.7,
    max_tokens=150
)
```

### 5. Text-to-Speech

```python
# Convert response to audio
audio_response = openai.Audio.create(
    model="tts-1",
    input=ai_response,
    voice="onyx"
)

# Send MP3 back to frontend
send_to_client(audio_response)
```

### 6. Audio Playback

```javascript
// Convert hex to audio blob
const audioBuffer = Buffer.from(hexData, 'hex');
const blob = new Blob([audioBuffer], { type: 'audio/mp3' });
const url = URL.createObjectURL(blob);

// Play audio
const audio = new Audio(url);
audio.play();
```

---

## 🐛 Troubleshooting

### Issue: "CORS policy error"

**Solution:**
Check that FastAPI CORS is configured for your frontend URL:

```python
# interview_service/main.py
CORS_ORIGINS = [
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]
```

### Issue: "Microphone permission denied"

**Solution:**
- Check browser permissions for microphone
- Use HTTPS in production (WebRTC requirement)
- Verify `getUserMedia` permission granted

### Issue: "Audio not playing"

**Solution:**
- Check browser console for errors
- Ensure audio element is created
- Verify MP3 data is valid
- Check browser autoplay policies

### Issue: "Transcription returns empty"

**Solution:**
- Check audio volume (should be above SILENCE_THRESHOLD)
- Verify microphone is working (test with OS audio settings)
- Increase MAX_SILENCE_DURATION if needed
- Check audio format conversion

### Issue: "WebSocket disconnects after short time"

**Solution:**
- Increase timeout value in `connectWebSocket()`
- Check network stability
- Verify FastAPI is running
- Check firewall/proxy settings

### Issue: "OpenAI API errors"

**Solution:**
- Verify OPENAI_API_KEY is set correctly
- Check API quota and rate limits
- Verify models are available (gpt-4, whisper-1)
- Check account has sufficient credits

### Issue: "High latency"

**Solutions:**
- Reduce CHUNK_DURATION (more frequent chunks)
- Optimize network connection
- Close other heavy processes
- Consider using `tts-1-hd` for better quality
- Use server closer to user location

---

## 🔒 Security Considerations

### Production Checklist

```
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS/WSS in production
- [ ] Implement authentication on WebSocket
- [ ] Add rate limiting on API endpoints
- [ ] Sanitize user input before sending to GPT
- [ ] Implement session validation
- [ ] Add CORS restrictions
- [ ] Monitor API costs and usage
- [ ] Implement timeout safeguards
- [ ] Add request/response logging
- [ ] Encrypt sensitive data
- [ ] Use firewall rules
```

### Example Production Config

```python
# production settings
DEBUG = False
ALLOWED_HOSTS = ["yourdomain.com"]
CORS_ORIGINS = ["https://yourdomain.com"]
# Use environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# Implement authentication
SESSION_TIMEOUT = 1800  # 30 minutes
```

---

## 📊 Performance Optimization

### Frontend

```javascript
// Use Web Workers for audio processing
const audioWorker = new Worker('audio-processor.js');

// Implement adaptive bitrate
// Reduce chunk size on slow networks
// Cache audio context instance
```

### Backend

```python
# Use connection pooling for OpenAI API
# Implement caching for CV analysis
# Use async/await properly
# Monitor memory usage
# Implement request batching

# Example: Cache CV analysis
@cache(ttl=3600)
async def analyze_cv(cv_text):
    # Analysis logic
    pass
```

---

## 📈 Monitoring

### Key Metrics to Track

```
- Active sessions count
- Average response time
- Transcription success rate
- API error rate
- Average interview duration
- User satisfaction (post-interview survey)
```

### Logging

```python
# All events are logged
logger.info(f"Session started: {session_id}")
logger.error(f"Transcription failed: {error}")
logger.debug(f"Chunk received: {size} bytes")
```

Access logs at: `interview_service/logs/`

---

## 🎓 Example: Full Interview Flow

```
1. User visits page
   → Clicks "Start Interview"

2. Frontend:
   → Requests microphone permission
   → Initializes Web Audio API
   → Connects WebSocket

3. Backend:
   → Creates interview session
   → Sends initial greeting

4. Loop (until user disconnects):
   
   User speaks:
   → Frontend captures audio
   → Sends PCM chunks via WebSocket
   
   Backend:
   → Accumulates chunks
   → Detects end of speech (silence)
   → Sends to Whisper for transcription
   → Receives transcribed text
   → Sends to GPT-4 with context
   → Receives AI response
   → Converts to audio (TTS)
   → Sends audio back to frontend
   
   Frontend:
   → Receives audio
   → Plays audio
   → Updates conversation display
   → Goes back to listening

5. User clicks "End Call"
   → WebSocket closes
   → Session ends
   → Conversation saved
   → Statistics displayed
```

---

## 🔗 Useful Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)

---

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review browser console for errors
3. Check backend logs
4. Verify OpenAI API status
5. Open an issue on GitHub

---

**Last Updated:** May 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅
