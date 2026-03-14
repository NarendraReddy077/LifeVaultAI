from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class MemoryBase(BaseModel):
    content: str
    mood: str
    image_url: Optional[str] = None

class MemoryCreate(MemoryBase):
    created_at: Optional[datetime] = None

class MemoryUpdate(BaseModel):
    content: Optional[str] = None
    mood: Optional[str] = None
    image_url: Optional[str] = None

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

class ProfileBase(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None

class ProfileUpdate(ProfileBase):
    pass

class Profile(ProfileBase):
    id: str
    updated_at: datetime

    class Config:
        from_attributes = True
