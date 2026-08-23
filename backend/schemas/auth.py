from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: str
    password: str

class UserProfileResponse(BaseModel):
    id: str
    name: str
    role: str
    specialty: str
    email: str
    is_logged_in: bool

class LoginResponse(BaseModel):
    success: bool
    user: UserProfileResponse
    token: str
    refresh_token: str

