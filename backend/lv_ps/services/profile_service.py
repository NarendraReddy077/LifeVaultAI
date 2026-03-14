from lv_ps.core.supabase_client import get_supabase_admin
from lv_ps.models.memory import Profile, ProfileUpdate
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class ProfileService:
    def __init__(self):
        self.client = get_supabase_admin()
        self.table = "profiles"

    async def get_profile(self, user_id: str) -> Profile:
        response = self.client.table(self.table).select("*").eq("id", user_id).execute()
        if not response.data:
            # If profile doesn't exist, create an empty one
            profile_data = {
                "id": user_id,
                "updated_at": datetime.utcnow().isoformat()
            }
            create_response = self.client.table(self.table).insert(profile_data).execute()
            return Profile(**create_response.data[0])
        
        return Profile(**response.data[0])

    async def update_profile(self, user_id: str, profile_update: ProfileUpdate) -> Profile:
        update_data = profile_update.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        response = self.client.table(self.table).update(update_data).eq("id", user_id).execute()
        if not response.data:
            # If update fails because it doesn't exist (unlikely if get_profile is called first), create it
            update_data["id"] = user_id
            create_response = self.client.table(self.table).insert(update_data).execute()
            return Profile(**create_response.data[0])
            
        return Profile(**response.data[0])

profile_service = ProfileService()
