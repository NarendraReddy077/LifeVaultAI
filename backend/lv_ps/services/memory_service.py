from lv_ps.core.supabase_client import get_supabase_admin
from lv_ps.models.memory import MemoryCreate, Memory
from lv_ps.services.ai_service import ai_service
from datetime import datetime
import uuid

class MemoryService:
    def __init__(self):
        self.client = get_supabase_admin()
        self.table = "memories"

    async def create_memory(self, user_id: str, memory_in: MemoryCreate) -> Memory:
        # 1. Detect emotion via AI
        ai_emotion = await ai_service.detect_emotion(memory_in.content)
        
        # 2. Generate reflection
        reflection = await ai_service.generate_reflection(memory_in.content, ai_emotion)
        
        # 3. Check for mismatch
        mismatch = ai_emotion.lower() != memory_in.mood.lower()
        
        # 4. Save to DB
        memory_data = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "content": memory_in.content,
            "mood": memory_in.mood,
            "ai_detected_emotion": ai_emotion,
            "emotion_mismatch_flag": mismatch,
            "reflection": reflection,
            "image_url": memory_in.image_url,
            "created_at": datetime.utcnow().isoformat()
        }
        
        response = self.client.table(self.table).insert(memory_data).execute()
        return Memory(**response.data[0])

    async def get_memories(self, user_id: str) -> list[Memory]:
        response = self.client.table(self.table).select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return [Memory(**m) for m in response.data]

    async def get_memory(self, memory_id: str, user_id: str) -> Memory:
        response = self.client.table(self.table).select("*").eq("id", memory_id).eq("user_id", user_id).single().execute()
        return Memory(**response.data)

memory_service = MemoryService()
