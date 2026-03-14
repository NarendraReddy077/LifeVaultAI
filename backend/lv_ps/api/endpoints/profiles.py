from fastapi import APIRouter, Depends, HTTPException
from lv_ps.api.deps import get_current_user
from lv_ps.models.memory import Profile, ProfileUpdate
from lv_ps.services.profile_service import profile_service

router = APIRouter()

@router.get("/me", response_model=Profile)
async def get_my_profile(current_user_id: str = Depends(get_current_user)):
    return await profile_service.get_profile(current_user_id)

@router.put("/me", response_model=Profile)
async def update_my_profile(
    profile_update: ProfileUpdate,
    current_user_id: str = Depends(get_current_user)
):
    return await profile_service.update_profile(current_user_id, profile_update)
