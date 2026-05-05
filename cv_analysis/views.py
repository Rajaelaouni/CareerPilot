import os
import uuid

from django.conf import settings
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import CV, CVAnalysisResult
from .utils import extract_text_from_file, analyse_cv_text


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def upload_and_analyze_cv(request):
    uploaded_file = request.FILES.get("file")

    if not uploaded_file:
        return Response(
            {"detail": "Aucun fichier reçu"},
            status=status.HTTP_400_BAD_REQUEST
        )

    ext = os.path.splitext(uploaded_file.name)[1].lower()
    if ext not in [".pdf", ".docx"]:
        return Response(
            {"detail": "Format non supporté. Utilisez PDF ou DOCX."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if uploaded_file.size > 5 * 1024 * 1024:
        return Response(
            {"detail": "Fichier trop grand (max 5MB)."},
            status=status.HTTP_400_BAD_REQUEST
        )

    upload_dir = os.path.join(settings.MEDIA_ROOT, "cvs", str(request.user.id))
    os.makedirs(upload_dir, exist_ok=True)

    unique_name = f"{uuid.uuid4().hex}_{uploaded_file.name}"
    file_path = os.path.join(upload_dir, unique_name)

    with open(file_path, "wb+") as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)

    extracted_text = extract_text_from_file(file_path)

    if not extracted_text or not extracted_text.strip():
        return Response(
            {"detail": "Impossible d'extraire le texte du CV."},
            status=status.HTTP_400_BAD_REQUEST
        )

    analysis_data = analyse_cv_text(extracted_text)

    cv = CV.objects.create(
        user=request.user,
        file_name=uploaded_file.name,
        file_path=file_path,
        extracted_text=extracted_text,
        ats_score=analysis_data["ats_score"],
    )

    result = CVAnalysisResult.objects.create(
        cv=cv,
        status="analysed",
        tech_relevance=analysis_data["tech_relevance"],
        experience_score=analysis_data["experience_score"],
        education_score=analysis_data["education_score"],
        structure_score=analysis_data["structure_score"],
        technical_skills=analysis_data["technical_skills"],
        soft_skills=analysis_data["soft_skills"],
        present_keywords=analysis_data["present_keywords"],
        missing_keywords=analysis_data["missing_keywords"],
        found_sections=analysis_data["found_sections"],
        tips=analysis_data["tips"],
    )

    return Response({
        "message": "CV analysé avec succès",
        "analysis_id": result.id,
        "cv_id": cv.id,
        "filename": cv.file_name,
        "atsScore": analysis_data["ats_score"],
    }, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def latest_analysis(request):
    latest = CVAnalysisResult.objects.select_related("cv").filter(
        cv__user=request.user
    ).order_by("-created_at").first()

    if not latest:
        return Response(
            {"detail": "Aucune analyse trouvée"},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response({
        "analysis_id": latest.id,
        "filename": latest.cv.file_name,
        "date": "Il y a quelques instants",
        "atsScore": int(float(latest.cv.ats_score or 0)),
        "kpis": [
            {
                "label": "Tech Relevance",
                "score": latest.tech_relevance,
                "color": "#22C55E"
            },
            {
                "label": "Expérience",
                "score": latest.experience_score,
                "color": "#7B2FF7"
            },
            {
                "label": "Formation",
                "score": latest.education_score,
                "color": "#C8187A"
            }
        ],
        "technicalSkills": latest.technical_skills,
        "softSkills": latest.soft_skills,
        "present": latest.present_keywords,
        "missing": latest.missing_keywords,
        "foundSections": latest.found_sections,
        "structureScore": latest.structure_score,
        "tips": latest.tips
    }, status=status.HTTP_200_OK)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def analysis_detail(request, analysis_id):
    try:
        result = CVAnalysisResult.objects.select_related("cv").get(
            id=analysis_id,
            cv__user=request.user
        )
    except CVAnalysisResult.DoesNotExist:
        return Response(
            {"detail": "Analyse introuvable"},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response({
        "analysis_id": result.id,
        "filename": result.cv.file_name,
        "date": "Il y a quelques instants",
        "atsScore": int(float(result.cv.ats_score or 0)),
        "kpis": [
            {
                "label": "Tech Relevance",
                "score": result.tech_relevance,
                "color": "#22C55E"
            },
            {
                "label": "Expérience",
                "score": result.experience_score,
                "color": "#7B2FF7"
            },
            {
                "label": "Formation",
                "score": result.education_score,
                "color": "#C8187A"
            }
        ],
        "technicalSkills": result.technical_skills,
        "softSkills": result.soft_skills,
        "present": result.present_keywords,
        "missing": result.missing_keywords,
        "foundSections": result.found_sections,
        "structureScore": result.structure_score,
        "tips": result.tips
    }, status=status.HTTP_200_OK)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def analysis_history(request):
    results = CVAnalysisResult.objects.select_related("cv").filter(
        cv__user=request.user
    ).order_by("-created_at")

    history = []
    for result in results:
        history.append({
            "analysis_id": result.id,
            "filename": result.cv.file_name,
            "atsScore": int(float(result.cv.ats_score or 0)),
            "techRelevance": result.tech_relevance,
            "experienceScore": result.experience_score,
            "educationScore": result.education_score,
            "structureScore": result.structure_score,
            "created_at": result.created_at.isoformat(),
        })

    return Response(history, status=status.HTTP_200_OK)