from __future__ import annotations

import uuid

from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from cv_analysis.models import CV
from .session_store import create_session, delete_session, get_session


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def interview_start(request):
    """
    POST /api/interview/start
    - fetch latest CV extracted_text from DB for authenticated user
    - create session_id, init history
    """
    cv = (
        CV.objects.filter(user=request.user)
        .order_by("-created_at")
        .only("id", "extracted_text")
        .first()
    )
    if not cv or not (cv.extracted_text or "").strip():
        return Response(
            {"detail": "Aucun CV trouvé (ou texte CV vide). Uploadez votre CV d'abord."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    session_id = uuid.uuid4()
    create_session(session_id=str(session_id), user_id=request.user.id, cv_text=cv.extracted_text)

    return Response({"session_id": str(session_id)}, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def interview_end(request, session_id):
    s = get_session(str(session_id))
    if not s or s.user_id != request.user.id:
        return Response({"detail": "Session introuvable"}, status=status.HTTP_404_NOT_FOUND)

    delete_session(str(session_id))
    return Response({"message": "Session terminée"}, status=status.HTTP_200_OK)

