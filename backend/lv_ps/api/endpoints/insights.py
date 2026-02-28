from fastapi import APIRouter, Depends
from lv_ps.api.deps import get_current_user
from lv_ps.models.memory import Insight
from lv_ps.services.insight_service import insight_service

router = APIRouter()

@router.get("/", response_model=list[Insight])
async def get_insights(current_user_id: str = Depends(get_current_user)):
    return await insight_service.get_insights(current_user_id)

@router.post("/generate-weekly")
async def generate_weekly(current_user_id: str = Depends(get_current_user)):
    return await insight_service.generate_weekly_summary(current_user_id)
