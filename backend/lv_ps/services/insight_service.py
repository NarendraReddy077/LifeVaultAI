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

    async def generate_insight(self, user_id: str, period: str, custom_start_date: str = None, custom_end_date: str = None) -> Insight:
        # 1. Fetch memories from last N days based on period
        now = datetime.utcnow()
        if period == 'monthly':
            start_date = now - timedelta(days=30)
            end_date = now
            time_range_desc = "Past 30 days"
            period_type = 'monthly'
        elif period == 'weekly':
            # Default to weekly
            start_date = now - timedelta(days=7)
            end_date = now
            period_type = 'weekly'
            time_range_desc = "Past 7 days"
        else:
            if not custom_start_date or not custom_end_date:
                raise ValueError("start_date and end_date are required for custom periods.")
            
            try:
                start_dt = datetime.fromisoformat(custom_start_date.replace('Z', '+00:00')).replace(tzinfo=None)
                end_dt = datetime.fromisoformat(custom_end_date.replace('Z', '+00:00')).replace(tzinfo=None)
            except Exception:
                # Fallback to simple date parsing
                start_dt = datetime.strptime(custom_start_date[:10], "%Y-%m-%d")
                end_dt = datetime.strptime(custom_end_date[:10], "%Y-%m-%d")
                
            start_date = start_dt
            # Make sure end_date includes the end of the day
            end_date = end_dt + timedelta(days=1) - timedelta(microseconds=1)
            
            period_type = period
            if period == 'custom_week':
                time_range_desc = f"Week of {start_date.strftime('%b %d, %Y')}"
            else:
                time_range_desc = f"Month of {start_date.strftime('%B %Y')}"

        memories = await memory_service.get_memories(user_id)
        
        # Filter memories locally
        recent_memories = [
            m for m in memories 
            if start_date <= m.created_at.replace(tzinfo=None) <= end_date
        ]
        
        if not recent_memories:
            return None

        # 2. Generate summary via AI
        memory_texts = "\n".join([f"- {m.content} (Emotion: {m.ai_detected_emotion or 'Unknown'}, Date: {m.created_at.date()})" for m in recent_memories])
        prompt = f"""
        Based on the following user memories from the {time_range_desc.lower()}, provide a reflective {period} summary.
        Rules:
        - Be observational and neutral.
        - Cite time ranges or specific clusters of memories if possible.
        - Use framing: 'Based on your stored memories from the {time_range_desc.lower()}...'
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
            "type": period_type,
            "content": summary_content,
            "time_range": time_range_desc,
            "created_at": datetime.utcnow().isoformat()
        }
        
        response = self.client.table(self.table).insert(insight_data).execute()
        return Insight(**response.data[0])

    async def get_insights(self, user_id: str) -> list[Insight]:
        response = self.client.table(self.table).select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return [Insight(**i) for i in response.data]

    async def delete_insight(self, user_id: str, insight_id: str) -> bool:
        # Verify ownership
        check = self.client.table(self.table).select("user_id").eq("id", insight_id).execute()
        if not check.data or check.data[0]["user_id"] != user_id:
            return False
            
        self.client.table(self.table).delete().eq("id", insight_id).execute()
        return True

insight_service = InsightService()

