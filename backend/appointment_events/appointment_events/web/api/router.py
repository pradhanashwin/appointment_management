from fastapi.routing import APIRouter

from appointment_events.web.api import monitoring, events

api_router = APIRouter()
api_router.include_router(monitoring.router)
api_router.include_router(events.router, tags=["events"])
