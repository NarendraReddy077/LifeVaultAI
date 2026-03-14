from fastapi import APIRouter
from lv_ps.api.endpoints import auth, memories, insights, profiles

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(memories.router, prefix="/memories", tags=["memories"])
api_router.include_router(insights.router, prefix="/insights", tags=["insights"])
api_router.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
