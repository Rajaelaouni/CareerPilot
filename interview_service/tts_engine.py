"""
TTS Engine - Synthèse Vocale Naturelle
=======================================
Utilise ElevenLabs API pour générer une voix humaine naturelle.
Fallback vers Azure TTS ou Web Speech API.
"""

import os
import base64
import io
from typing import Optional

class TTSEngine:
    """Moteur de synthèse vocale naturelle."""
    
    def __init__(self):
        self.elevenlabs_api_key = os.environ.get("ELEVENLABS_API_KEY")
        self.azure_speech_key = os.environ.get("AZURE_SPEECH_KEY")
        self.azure_region = os.environ.get("AZURE_SPEECH_REGION", "westeurope")
        self.provider = self._detect_provider()
    
    def _detect_provider(self) -> str:
        """Détecte le provider TTS disponible."""
        if self.elevenlabs_api_key:
            return "elevenlabs"
        elif self.azure_speech_key:
            return "azure"
        return "webspeech"
    
    async def speak(self, text: str, voice_id: str = "Rachel") -> dict:
        """
        Génère l'audio pour le texte donné.
        
        Args:
            text: Texte à convertir en audio
            voice_id: ID de la voix à utiliser
            
        Returns:
            dict avec 'audio_base64', 'url_audio', ou 'error'
        """
        if not text:
            return {"error": "Texte vide"}
        
        # Nettoyer le texte pour TTS
        clean_text = self._clean_text_for_tts(text)
        
        if self.provider == "elevenlabs":
            return await self._elevenlabs_speak(clean_text, voice_id)
        elif self.provider == "azure":
            return await self._azure_speak(clean_text)
        else:
            return {"provider": "webspeech", "text": clean_text}
    
    def _clean_text_for_tts(self, text: str) -> str:
        """Nettoie le texte pour une meilleure synthèse vocale."""
        # Supprimer les caractères spéciaux
        text = text.replace("**", "").replace("###", "").replace("---", "")
        text = text.replace("*", " ").replace("#", " ")
        
        # Ajouter des pauses pour la ponctuation
        text = text.replace("?", ". ").replace("!", ". ").replace(",", ", ")
        
        # Supprimer les espaces multiples
        import re
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    async def _elevenlabs_speak(self, text: str, voice_id: str) -> dict:
        """Génère l'audio via ElevenLabs API."""
        try:
            import httpx
            
            url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
            
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": self.elevenlabs_api_key
            }
            
            payload = {
                "text": text,
                "model_id": "eleven_v3",
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.75,
                    "style": 0.5,
                    "use_speaker_boost": True
                }
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(url, json=payload, headers=headers)
                
                if response.status_code == 200:
                    audio_base64 = base64.b64encode(response.content).decode()
                    return {
                        "provider": "elevenlabs",
                        "audio_base64": audio_base64,
                        "duration": len(response.content) / 16000  # Estimation
                    }
                else:
                    return {"error": f"ElevenLabs error: {response.status_code}"}
                    
        except ImportError:
            return {"error": "httpx non installé"}
        except Exception as e:
            return {"error": str(e)}
    
    async def _azure_speak(self, text: str) -> dict:
        """Génère l'audio via Azure Cognitive Services."""
        try:
            import httpx
            
            url = f"https://{self.azure_region}.tts.speech.microsoft.com/cognitiveservices/v1"
            
            headers = {
                "Ocp-Apim-Subscription-Key": self.azure_speech_key,
                "Content-Type": "application/ssml+xml",
                "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3"
            }
            
            ssml = f"""
            <speak version='1.0' xml:lang='fr-FR'>
                <voice xml:lang='fr-FR' name='fr-FR-HortenseRUS'>
                    {text}
                </voice>
            </speak>
            """
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(url, content=ssml, headers=headers)
                
                if response.status_code == 200:
                    audio_base64 = base64.b64encode(response.content).decode()
                    return {
                        "provider": "azure",
                        "audio_base64": audio_base64
                    }
                else:
                    return {"error": f"Azure TTS error: {response.status_code}"}
                    
        except Exception as e:
            return {"error": str(e)}
    
    def get_available_voices(self) -> list:
        """Retourne la liste des voix disponibles."""
        if self.provider == "elevenlabs":
            return [
                {"id": "Rachel", "name": "Rachel", "lang": "fr-FR", "gender": "Female"},
                {"id": "Nicole", "name": "Nicole", "lang": "en-US", "gender": "Female"},
                {"id": "Antoni", "name": "Antoni", "lang": "fr-FR", "gender": "Male"},
                {"id": "Arthur", "name": "Arthur", "lang": "fr-FR", "gender": "Male"},
                {"id": "Sarah", "name": "Sarah", "lang": "fr-FR", "gender": "Female"},
            ]
        elif self.provider == "azure":
            return [
                {"id": "fr-FR-HortenseRUS", "name": "Hortense", "lang": "fr-FR", "gender": "Female"},
                {"id": "fr-FR-YolandeNeural", "name": "Yolande", "lang": "fr-FR", "gender": "Female"},
                {"id": "fr-FR-GérardNeural", "name": "Gérard", "lang": "fr-FR", "gender": "Male"},
            ]
        return [{"id": "default", "name": "Web Speech", "lang": "fr-FR", "gender": "Unknown"}]


# Instance globale
tts_engine = TTSEngine()
