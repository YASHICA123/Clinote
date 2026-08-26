from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.schemas.auth import LoginRequest, RegisterRequest
from backend.services.auth_service import AuthService
from backend.middleware.auth import get_current_user_profile
from backend.utils.responses import standard_response
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Authentication"])

class RefreshRequest(BaseModel):
    refresh_token: str

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    res = AuthService.register_user(db, payload)
    if not res.get("success"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=res.get("message", "Registration failed")
        )
    return standard_response(True, "User registered successfully", res)

@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    res = AuthService.login(db, payload)
    if not res.get("success"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=res.get("message", "Invalid email or password")
        )
    return standard_response(True, "Login successful", res)

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user_profile), db: Session = Depends(get_db)):
    user = AuthService.get_current_user_profile(db, current_user.get("sub"))
    if not user:
        # If user session exists from token payload
        user = {
            "id": current_user.get("sub"),
            "name": current_user.get("name"),
            "email": current_user.get("email"),
            "role": current_user.get("role", "DOCTOR"),
            "specialty": current_user.get("specialty", "General Medicine"),
            "is_active": True
        }
    return standard_response(True, "User profile retrieved successfully", user)

@router.post("/logout")
def logout(current_user: dict = Depends(get_current_user_profile)):
    return standard_response(True, "Logout successful", {"success": True})
