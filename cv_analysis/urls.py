from django.urls import path
from .views import (
    upload_and_analyze_cv,
    latest_analysis,
    analysis_detail,
    analysis_history,
)

urlpatterns = [
    path("upload-analyze", upload_and_analyze_cv, name="upload_and_analyze_cv"),
    path("latest-analysis", latest_analysis, name="latest_analysis"),
    path("analysis/<int:analysis_id>", analysis_detail, name="analysis_detail"),
    path("history", analysis_history, name="analysis_history"),
]