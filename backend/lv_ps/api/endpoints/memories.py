from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, BackgroundTasks
from lv_ps.api.deps import get_current_user
from lv_ps.models.memory import MemoryCreate, Memory, MemoryUpdate
from lv_ps.services.memory_service import memory_service
from lv_ps.services.storage_service import storage_service
from lv_ps.services.ai_service import ai_service
from datetime import datetime
from typing import Optional

router = APIRouter()

@router.post("/", response_model=Memory)
async def create_memory(
    background_tasks: BackgroundTasks,
    content: str = Form(...),
    mood: str = Form(...),
    created_at: Optional[datetime] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user_id: str = Depends(get_current_user)
):
    image_url = None
    if image:
        content_bytes = await image.read()
        path = await storage_service.upload_image(current_user_id, image.filename, content_bytes)
        image_url = path # Store path, frontend will get signed URL
    
    memory_in = MemoryCreate(content=content, mood=mood, image_url=image_url, created_at=created_at)
    memory = await memory_service.create_memory(current_user_id, memory_in)
    
    # Trigger background AI processing
    background_tasks.add_task(memory_service.process_memory_background, memory.id)
    
    return memory

@router.get("/", response_model=list[Memory])
async def get_memories(current_user_id: str = Depends(get_current_user)):
    memories = await memory_service.get_memories(current_user_id)
    # Convert image paths to signed URLs
    for memory in memories:
        if memory.image_url:
            memory.image_url = await storage_service.get_signed_url(memory.image_url)
    return memories

@router.get("/export")
async def export_memories(current_user_id: str = Depends(get_current_user)):
    memories = await memory_service.get_memories(current_user_id)
    # Simple JSON export
    return {"memories": [m.dict() for m in memories]}

@router.get("/ask-ai/")
async def ask_ai(query: str, current_user_id: str = Depends(get_current_user)):
    memories = await memory_service.get_memories(current_user_id)
    context = "\n".join([f"- {m.content} ({m.created_at.date()})" for m in memories])
    return {"response": await ai_service.ask_ai(query, context)}

@router.get("/{memory_id}", response_model=Memory)
async def get_memory(memory_id: str, current_user_id: str = Depends(get_current_user)):
    memory = await memory_service.get_memory(memory_id, current_user_id)
    if memory.image_url:
        memory.image_url = await storage_service.get_signed_url(memory.image_url)
    return memory

@router.put("/{memory_id}", response_model=Memory)
async def update_memory(
    memory_id: str,
    content: Optional[str] = Form(None),
    mood: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user_id: str = Depends(get_current_user)
):
    image_url = None
    if image:
        content_bytes = await image.read()
        path = await storage_service.upload_image(current_user_id, image.filename, content_bytes)
        image_url = path
    
    memory_update = MemoryUpdate(content=content, mood=mood, image_url=image_url)
    return await memory_service.update_memory(memory_id, current_user_id, memory_update)

@router.delete("/{memory_id}")
async def delete_memory(memory_id: str, current_user_id: str = Depends(get_current_user)):
    return await memory_service.delete_memory(memory_id, current_user_id)

@router.post("/process-emotions")
async def process_emotions(current_user_id: str = Depends(get_current_user)):
    # Note: For security in a real production environment, this should probably be protected
    # to only allow admins or run as a totally separate cron job skipping the HTTP layer.
    # We provide it here as requested.
    return await memory_service.process_unanalyzed_emotions()


