from fastapi import APIRouter, Depends, UploadFile, File, Form
from lv_ps.api.deps import get_current_user
from lv_ps.models.memory import MemoryCreate, Memory
from lv_ps.services.memory_service import memory_service
from lv_ps.services.storage_service import storage_service
from lv_ps.services.ai_service import ai_service
from typing import Optional

router = APIRouter()

@router.post("/", response_model=Memory)
async def create_memory(
    content: str = Form(...),
    mood: str = Form(...),
    image: Optional[UploadFile] = File(None),
    current_user_id: str = Depends(get_current_user)
):
    image_url = None
    if image:
        content_bytes = await image.read()
        path = await storage_service.upload_image(current_user_id, image.filename, content_bytes)
        image_url = path # Store path, frontend will get signed URL
    
    memory_in = MemoryCreate(content=content, mood=mood, image_url=image_url)
    return await memory_service.create_memory(current_user_id, memory_in)

@router.get("/", response_model=list[Memory])
async def get_memories(current_user_id: str = Depends(get_current_user)):
    memories = await memory_service.get_memories(current_user_id)
    # Convert image paths to signed URLs
    for memory in memories:
        if memory.image_url:
            memory.image_url = await storage_service.get_signed_url(memory.image_url)
    return memories

@router.get("/{memory_id}", response_model=Memory)
async def get_memory(memory_id: str, current_user_id: str = Depends(get_current_user)):
    memory = await memory_service.get_memory(memory_id, current_user_id)
    if memory.image_url:
        memory.image_url = await storage_service.get_signed_url(memory.image_url)
    return memory

@router.get("/ask-ai/")
async def ask_ai(query: str, current_user_id: str = Depends(get_current_user)):
    memories = await memory_service.get_memories(current_user_id)
    context = "\n".join([f"- {m.content} ({m.created_at.date()})" for m in memories])
    return {"response": await ai_service.ask_ai(query, context)}
