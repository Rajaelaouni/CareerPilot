# interview_service/consumers.py
from cv_analysis.models import CVAnalysis

class InterviewConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        
        # Récupération du dernier CV analysé pour cet utilisateur
        cv_data = await self.get_latest_cv(self.user)
        self.cv_text = cv_data.extracted_text if cv_data else "Candidat sans CV"

        await self.accept()
        
        # L'IA commence par une question personnalisée basée sur le CV
        # Ex: "J'ai vu que vous maîtrisez React, pouvez-vous m'en parler ?"