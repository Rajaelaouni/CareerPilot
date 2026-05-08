from django.urls import re_path
from .consumers import InterviewConsumer

websocket_urlpatterns = [
    # Utilisation de [\w-]+ pour capturer les UUID avec ou sans tirets
    # Le /? à la fin gère les appels avec ou sans slash final
    re_path(r"^ws/interview/(?P<session_id>[\w-]+)/?$", InterviewConsumer.as_asgi()),
]
