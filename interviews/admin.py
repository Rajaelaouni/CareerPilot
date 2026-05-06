from django.contrib import admin
from .models import InterviewSession, InterviewQuestion, VoiceResponse, VoiceAnalysis

admin.site.register(InterviewSession)
admin.site.register(InterviewQuestion)
admin.site.register(VoiceResponse)
admin.site.register(VoiceAnalysis)
