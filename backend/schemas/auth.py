from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "DOCTOR"
    specialty: Optional[str] = "General Medicine"

class UserProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    role: str
    specialty: Optional[str] = None
    is_active: bool = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile
