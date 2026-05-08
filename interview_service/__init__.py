"""
CareerPilot Interview Service
Real-time AI interview simulation with WebSocket
"""

__version__ = "1.0.0"
__author__ = "CareerPilot Team"
__description__ = "Real-time AI-powered interview simulation service"

# Import main components if needed
try:
    from .main import app, InterviewSession
except ImportError:
    pass
