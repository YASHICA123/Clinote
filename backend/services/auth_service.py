from typing import Dict, Any, Optional
from backend.utils.auth import TokenUtils

# Hardcoded clinician database mapping to roles
CLINICIAN_DB = {
    "admin@clinote.ai": {"password": "admin123", "id": "u0", "name": "System Admin", "role": "Admin", "specialty": "Administration"},
    "dr.bhasin@clinote.ai": {"password": "doctor123", "id": "u1", "name": "Dr. Deepak Bhasin", "role": "Consultant", "specialty": "Chief Consultant"},
    "deepak.bhasin@clinote.com": {"password": "password123", "id": "u1", "name": "Dr. Deepak Bhasin", "role": "Consultant", "specialty": "Chief Consultant"},
    "doctor@clinote.ai": {"password": "doctor123", "id": "u2", "name": "Dr. Sarah Paul", "role": "Doctor", "specialty": "Pulmonologist"},
    "resident@clinote.ai": {"password": "resident123", "id": "u3", "name": "Dr. Amit Roy", "role": "Resident", "specialty": "Internal Medicine"},
    "nurse@clinote.ai": {"password": "nurse123", "id": "u4", "name": "Nurse Emily", "role": "Nurse", "specialty": "ICU Staff Nurse"}
}

class AuthService:
    _active_sessions: Dict[str, dict] = {}

    @classmethod
    def login(cls, credentials: Dict[str, Any]) -> Dict[str, Any]:
        email = credentials.get("email", "").strip().lower()
        password = credentials.get("password", "")
        
        user_info = CLINICIAN_DB.get(email)
        if not user_info or user_info["password"] != password:
            return {"success": False, "message": "Invalid email or password"}
        
        # Token payload
        token_data = {
            "sub": user_info["id"],
            "email": email,
            "role": user_info["role"],
            "name": user_info["name"]
        }
        
        access_token = TokenUtils.create_access_token(token_data)
        refresh_token = TokenUtils.create_refresh_token({"sub": user_info["id"]})
        
        user_profile = {
            "id": user_info["id"],
            "name": user_info["name"],
            "role": user_info["role"],
            "specialty": user_info["specialty"],
            "email": email,
            "is_logged_in": True
        }
        
        # Track active session
        cls._active_sessions[user_info["id"]] = user_profile
        
        return {
            "success": True,
            "user": user_profile,
            "token": access_token,
            "refresh_token": refresh_token
        }

    @classmethod
    def logout(cls, user_id: str) -> Dict[str, Any]:
        if user_id in cls._active_sessions:
            cls._active_sessions[user_id]["is_logged_in"] = False
            del cls._active_sessions[user_id]
        return {"success": True}

    @classmethod
    def refresh(cls, refresh_token: str) -> Dict[str, Any]:
        payload = TokenUtils.verify_token(refresh_token, "refresh")
        if not payload:
            return {"success": False, "message": "Invalid or expired refresh token"}
        
        user_id = payload.get("sub")
        # Find user info
        user_email = next((email for email, info in CLINICIAN_DB.items() if info["id"] == user_id), None)
        if not user_email:
            return {"success": False, "message": "User not found"}
            
        user_info = CLINICIAN_DB[user_email]
        token_data = {
            "sub": user_id,
            "email": user_email,
            "role": user_info["role"],
            "name": user_info["name"]
        }
        
        new_access = TokenUtils.create_access_token(token_data)
        return {
            "success": True,
            "token": new_access
        }

    @classmethod
    def get_current_user_profile(cls, user_id: str) -> Optional[Dict[str, Any]]:
        # Check active session, fallback to DB metadata
        if user_id in cls._active_sessions:
            return cls._active_sessions[user_id]
            
        user_email = next((email for email, info in CLINICIAN_DB.items() if info["id"] == user_id), None)
        if user_email:
            info = CLINICIAN_DB[user_email]
            return {
                "id": info["id"],
                "name": info["name"],
                "role": info["role"],
                "specialty": info["specialty"],
                "email": user_email,
                "is_logged_in": True
            }
        return None
