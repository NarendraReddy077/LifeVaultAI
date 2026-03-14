from lv_ps.core.supabase_client import get_supabase_admin
from lv_ps.models.memory import MemoryCreate, Memory, MemoryUpdate
from lv_ps.services.ai_service import ai_service
from lv_ps.services.storage_service import storage_service
from datetime import datetime
import uuid
import logging

logger = logging.getLogger(__name__)

class MemoryService:
    def __init__(self):
        self.client = get_supabase_admin()
        self.table = "memories"

    async def create_memory(self, user_id: str, memory_in: MemoryCreate) -> Memory:
        # Create without immediate AI analysis
        created_at = memory_in.created_at or datetime.utcnow()
        if isinstance(created_at, datetime):
            created_at = created_at.isoformat()

        memory_data = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "content": memory_in.content,
            "mood": memory_in.mood,
            "ai_detected_emotion": None,
            "emotion_mismatch_flag": False,
            "reflection": None,
            "image_url": memory_in.image_url,
            "created_at": created_at
        }
        
        response = self.client.table(self.table).insert(memory_data).execute()
        return Memory(**response.data[0])

    async def get_memories(self, user_id: str) -> list[Memory]:
        response = self.client.table(self.table).select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return [Memory(**m) for m in response.data]

    async def get_memory(self, memory_id: str, user_id: str) -> Memory:
        response = self.client.table(self.table).select("*").eq("id", memory_id).eq("user_id", user_id).single().execute()
        return Memory(**response.data)

    async def update_memory(self, memory_id: str, user_id: str, memory_update: MemoryUpdate) -> Memory:
        # Construct update payload
        update_data = {}
        if memory_update.content is not None:
            update_data["content"] = memory_update.content
        if memory_update.mood is not None:
            update_data["mood"] = memory_update.mood
        if memory_update.image_url is not None:
            update_data["image_url"] = memory_update.image_url

        if not update_data:
            return await self.get_memory(memory_id, user_id)

        # If content changed, we might want to flag it for re-analysis, but for now just update
        # If we wanted to re-analyze, we would set ai_detected_emotion to None here.

        response = self.client.table(self.table).update(update_data).eq("id", memory_id).eq("user_id", user_id).execute()
        if not response.data:
            raise Exception("Failed to update memory or memory not found")
        return Memory(**response.data[0])

    async def delete_memory(self, memory_id: str, user_id: str):
        # 1. Get memory to find image URL
        memory = await self.get_memory(memory_id, user_id)
        
        # 2. Delete from DB
        response = self.client.table(self.table).delete().eq("id", memory_id).eq("user_id", user_id).execute()
        
        # 3. If deleted from DB and has image, delete from storage
        if response.data and memory.image_url:
            try:
                # Remove file from storage
                storage_client = get_supabase_admin().storage.from_(storage_service.bucket_name)
                storage_client.remove([memory.image_url])
            except Exception as e:
                logger.error(f"Failed to delete image from storage: {e}")
        
        return {"message": "Memory deleted successfully"}

    async def process_unanalyzed_emotions(self):
        """Batch process memories that haven't had their emotions analyzed yet."""
        try:
            # 1. Fetch memories without ai_detected_emotion
            response = self.client.table(self.table).select("*").is_("ai_detected_emotion", "null").order("created_at", desc=True).limit(10).execute()
            memories = response.data

            for mem in memories:
                await self.process_single_memory(mem)
            
            return {"processed": len(memories)}
        except Exception as e:
            logger.error(f"Error in process_unanalyzed_emotions: {e}")
            return {"error": str(e)}

    async def process_single_memory(self, memory_data: dict):
        """Helper to process a single memory's AI analysis."""
        try:
            # 1. Detect emotion via AI
            ai_emotion = await ai_service.detect_emotion(memory_data["content"])
            mismatch = ai_emotion.lower() != memory_data["mood"].lower()

            # 2. Update DB
            update_data = {
                "ai_detected_emotion": ai_emotion,
                "emotion_mismatch_flag": mismatch
            }
            self.client.table(self.table).update(update_data).eq("id", memory_data["id"]).execute()
            logger.info(f"Processed AI analysis for memory {memory_data['id']}")
        except Exception as e:
            logger.error(f"Failed to process AI analysis for memory {memory_data['id']}: {e}")

    async def process_memory_background(self, memory_id: str):
        """Background task for processing one memory."""
        # Fetch memory first
        response = self.client.table(self.table).select("*").eq("id", memory_id).single().execute()
        if response.data:
            await self.process_single_memory(response.data)

memory_service = MemoryService()
