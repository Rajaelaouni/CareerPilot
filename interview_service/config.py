import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GROK_API_KEY = os.getenv("GROK_API_KEY")
    GROK_BASE_URL = os.getenv("GROK_BASE_URL", "https://api.x.ai/v1")
    GROK_MODEL = os.getenv("GROK_MODEL", "grok-1")

    SAMPLE_RATE = 16000
    LANGUAGE = "fr"
    TEMPERATURE = 0.7
    MAX_TOKENS = 200

settings = Settings()

if not settings.GROK_API_KEY:
    raise ValueError("GROK_API_KEY is required")