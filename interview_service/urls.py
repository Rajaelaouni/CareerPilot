from django.urls import path

from .views_interview import interview_start, interview_end

urlpatterns = [
    path("interview/start", interview_start, name="interview_start"),
    path("interview/<uuid:session_id>", interview_end, name="interview_end"),
]

