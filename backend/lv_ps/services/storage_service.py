from lv_ps.core.supabase_client import get_supabase_admin
from lv_ps.core.config import settings
import logging

logger = logging.getLogger(__name__)

class StorageService:
    def __init__(self):
        self.client = get_supabase_admin()
        self.bucket_name = "memories"

    async def upload_image(self, user_id: str, file_name: str, file_content: bytes) -> str:
        try:
            path = f"{user_id}/{file_name}"
            # In Supabase storage, folders are created automatically if they don't exist
            res = self.client.storage.from_(self.bucket_name).upload(path, file_content, {"cache-control": "3600", "upsert": "true"})
            return path
        except Exception as e:
            logger.error(f"Error uploading image: {str(e)}")
            raise e

    async def get_signed_url(self, path: str, expires_in: int = 3600) -> str:
        try:
            response = self.client.storage.from_(self.bucket_name).create_signed_url(path, expires_in)
            return response['signedURL']
        except Exception as e:
            logger.error(f"Error getting signed URL: {str(e)}")
            return "" # Return empty or placeholder if fails

storage_service = StorageService()

