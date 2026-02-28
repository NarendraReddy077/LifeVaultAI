from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from lv_ps.services.auth_service import auth_service
from lv_ps.core.supabase_client import get_supabase, get_supabase_admin

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
async def login(request: LoginRequest):
    # In a real app, you'd use Supabase Auth to verify credentials
    # For now, we'll simulate a successful login if email and password are provided
    # and issue a custom JWT as per requirements.
    sb = get_supabase()
    try:
        # Note: If login fails here, ensure SUPABASE_KEY in .env is a valid ANON key, not a placeholder.
        res = sb.auth.sign_in_with_password({"email": request.email, "password": request.password})
        
        if not res.user:
             raise HTTPException(status_code=401, detail="Authentication failed: No user found")
             
        user_id = res.user.id
        token = auth_service.create_access_token(data={"sub": user_id})
        return {"access_token": token, "token_type": "bearer"}
    except Exception as e:
        error_msg = str(e)
        print(f"Auth error: {error_msg}") # Log for docker logs
        raise HTTPException(status_code=401, detail=f"Authentication error: {error_msg}")

@router.post("/register")
async def register(request: LoginRequest):
    sb = get_supabase_admin()
    try:
        # Using admin client to create user with email_confirm=True
        # This allows immediate login without external email verification for the MVP
        res = sb.auth.admin.create_user({
            "email": request.email, 
            "password": request.password,
            "email_confirm": True
        })
        return {"message": "User registered successfully"}
    except Exception as e:
        print(f"Registration error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
