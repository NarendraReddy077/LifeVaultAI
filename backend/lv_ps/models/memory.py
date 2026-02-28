from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class MemoryBase(BaseModel):
    content: str
    mood: str
    image_url: Optional[str] = None

class MemoryCreate(MemoryBase):
    pass

class Memory(MemoryBase):
    id: str
    user_id: str
    ai_detected_emotion: Optional[str] = None
    emotion_mismatch_flag: bool = False
    reflection: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Insight(BaseModel):
    id: str
    user_id: str
    type: str # 'weekly', 'pattern'
    content: str
    time_range: str
    created_at: datetime
