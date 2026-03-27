# interviews/models.py
from django.db import models
from django.contrib.auth.models import User
from matching.models import JobOffer


class InterviewSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interview_sessions')
    job_offer = models.ForeignKey(
        JobOffer,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='interview_sessions'
    )
    session_title = models.CharField(max_length=255, blank=True, null=True)
    global_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.session_title or f"Interview Session {self.id}"


class InterviewQuestion(models.Model):
    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    question_type = models.CharField(max_length=50, blank=True, null=True)
    question_order = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"Question {self.question_order or self.id}"


class VoiceResponse(models.Model):
    question = models.ForeignKey(InterviewQuestion, on_delete=models.CASCADE, related_name='responses')
    audio_path = models.CharField(max_length=255, blank=True, null=True)
    transcribed_text = models.TextField(blank=True, null=True)
    response_duration = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    relevance_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f"Response {self.id} - Question {self.question.id}"


class VoiceAnalysis(models.Model):
    response = models.OneToOneField(VoiceResponse, on_delete=models.CASCADE, related_name='voice_analysis')
    confidence_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    fluency_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    communication_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    hesitation_level = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f"Voice Analysis for Response {self.response.id}"