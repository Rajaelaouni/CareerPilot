from rest_framework.views import APIView
from rest_framework.response import Response
from .ai_engine import process_vocal_interview
from .tts_engine import generate_voice_response

class VocalInterviewView(APIView):
    def post(self, request):
        user_transcript = request.data.get('transcript', '') # Texte capturé par le micro
        session_id = request.data.get('session_id', 'default')

        # 1. Groq génère la question suivante
        bot_text = process_vocal_interview(user_transcript)

        # 2. On génère l'audio de cette question
        audio_url = generate_voice_response(bot_text, session_id)

        return Response({
            "text": bot_text,
            "audio_url": audio_url
        })