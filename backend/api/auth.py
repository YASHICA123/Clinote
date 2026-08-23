from fastapi import APIRouter, HTTPException, status, Depends
from backend.schemas.auth import LoginRequest
from backend.services.auth_service import AuthService
from backend.middleware.auth import get_current_user_profile
from backend.utils.responses import standard_response
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Authentication"])

class RefreshRequest(BaseModel):
    refresh_token: str

@router.post("/login")
def login(payload: LoginRequest):
    res = AuthService.login(payload.model_dump())
    if not res.get("success"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=res.get("message", "Invalid credentials")
        )
    return standard_response(True, "Login successful", res)

@router.post("/logout")
def logout(current_user: dict = Depends(get_current_user_profile)):
    res = AuthService.logout(current_user.get("sub"))
    return standard_response(True, "Logout successful", res)

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user_profile)):
    user = AuthService.get_current_user_profile(current_user.get("sub"))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User session not found"
        )
    return standard_response(True, "User session retrieved successfully", user)

@router.post("/refresh")
def refresh_token(payload: RefreshRequest):
    res = AuthService.refresh(payload.refresh_token)
    if not res.get("success"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=res.get("message", "Invalid refresh token")
        )
    return standard_response(True, "Token refreshed successfully", res)
