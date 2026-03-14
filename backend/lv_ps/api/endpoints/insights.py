from fastapi import APIRouter, Depends, Query, HTTPException
from lv_ps.api.deps import get_current_user
from lv_ps.models.memory import Insight
from lv_ps.services.insight_service import insight_service

router = APIRouter()

@router.get("/", response_model=list[Insight])
async def get_insights(current_user_id: str = Depends(get_current_user)):
    return await insight_service.get_insights(current_user_id)

@router.post("/generate", response_model=Insight)
async def generate_insight(
    period: str = Query(..., description="The period to generate an insight for, e.g., 'weekly', 'monthly', 'custom_week', 'custom_month'"),
    start_date: str = Query(None, description="Start date in ISO format for custom periods"),
    end_date: str = Query(None, description="End date in ISO format for custom periods"),
    current_user_id: str = Depends(get_current_user)
):
    if period not in ["weekly", "monthly", "custom_week", "custom_month"]:
        raise HTTPException(status_code=400, detail="Invalid period. Please choose 'weekly', 'monthly', 'custom_week', or 'custom_month'.")
    
    insight = await insight_service.generate_insight(current_user_id, period, start_date, end_date)
    if not insight:
        raise HTTPException(status_code=404, detail=f"No memories found for the {period} period to analyze.")
    return insight

@router.delete("/{insight_id}")
async def delete_insight(insight_id: str, current_user_id: str = Depends(get_current_user)):
    success = await insight_service.delete_insight(current_user_id, insight_id)
    if not success:
        raise HTTPException(status_code=403, detail="Not authorized to delete this insight or insight not found.")
    return {"status": "success"}
