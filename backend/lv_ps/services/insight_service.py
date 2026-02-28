from lv_ps.core.supabase_client import get_supabase_admin
from lv_ps.models.memory import Insight, Memory
from lv_ps.services.ai_service import ai_service
from lv_ps.services.memory_service import memory_service
from datetime import datetime, timedelta
import uuid

class InsightService:
    def __init__(self):
        self.client = get_supabase_admin()
        self.table = "ai_insights"

    async def generate_weekly_summary(self, user_id: str) -> Insight:
        # 1. Fetch memories from last 7 days
        # Use UTC for consistency
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        memories = await memory_service.get_memories(user_id)
        
        # Filter memories locally for now (can be optimized with DB query later)
        recent_memories = [
            m for m in memories 
            if m.created_at.replace(tzinfo=None) >= seven_days_ago
        ]
        
        if not recent_memories:
            return None

        # 2. Generate summary via AI
        memory_texts = "\n".join([f"- {m.content} (Emotion: {m.ai_detected_emotion or 'Unknown'}, Date: {m.created_at.date()})" for m in recent_memories])
        prompt = f"""
        Based on the following user memories from the past week, provide a reflective weekly summary.
        Rules:
        - Be observational and neutral.
        - Cite time ranges or specific clusters of memories if possible.
        - Use framing: 'Based on your stored memories from the past week...'
        - End with: 'This is a reflection, not professional advice.'
        
        Memories:
        {memory_texts}
        """
        
        try:
            summary_content = await ai_service.generate_content(prompt)
        except Exception as e:
            # Handle AI failure gracefully or log it
            print(f"AI Generation failed: {str(e)}")
            return None
        
        # 3. Save to DB
        insight_data = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "type": "weekly",
            "content": summary_content,
            "time_range": "Past 7 days",
            "created_at": datetime.utcnow().isoformat()
        }
        
        response = self.client.table(self.table).insert(insight_data).execute()
        return Insight(**response.data[0])

    async def get_insights(self, user_id: str) -> list[Insight]:
        response = self.client.table(self.table).select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return [Insight(**i) for i in response.data]

insight_service = InsightService()

