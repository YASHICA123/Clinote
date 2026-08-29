from typing import Dict, Any, Optional
import bcrypt
from sqlalchemy.orm import Session
from backend.models.user import User
from backend.utils.auth import TokenUtils
from backend.schemas.auth import LoginRequest, RegisterRequest


class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        try:
            if isinstance(plain_password, str):
                plain_bytes = plain_password.encode("utf-8")
            else:
                plain_bytes = plain_password

            if isinstance(hashed_password, str):
                hashed_bytes = hashed_password.encode("utf-8")
            else:
                hashed_bytes = hashed_password

            return bcrypt.checkpw(plain_bytes, hashed_bytes)
        except Exception:
            return False

    @staticmethod
    def get_password_hash(password: str) -> str:
        if isinstance(password, str):
            pw_bytes = password.encode("utf-8")
        else:
            pw_bytes = password
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(pw_bytes, salt).decode("utf-8")

    @classmethod
    def register_user(cls, db: Session, payload: RegisterRequest) -> Dict[str, Any]:
        existing_user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
        if existing_user:
            return {"success": False, "message": "Email already registered"}

        new_user = User(
            name=payload.name,
            email=payload.email.lower().strip(),
            password_hash=cls.get_password_hash(payload.password),
            role=payload.role or "DOCTOR",
            specialty=payload.specialty or "General Medicine",
            is_active=True
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        token_data = {
            "sub": new_user.id,
            "email": new_user.email,
            "role": new_user.role,
            "name": new_user.name
        }
        access_token = TokenUtils.create_access_token(token_data)

        user_profile = {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role,
            "specialty": new_user.specialty,
            "is_active": new_user.is_active
        }

        return {
            "success": True,
            "user": user_profile,
            "access_token": access_token,
            "token_type": "bearer"
        }

    @classmethod
    def login(cls, db: Session, payload: LoginRequest) -> Dict[str, Any]:
        email = payload.email.lower().strip()
        user = db.query(User).filter(User.email == email).first()

        if not user or not cls.verify_password(payload.password, user.password_hash):
            return {"success": False, "message": "Invalid email or password"}

        if not user.is_active:
            return {"success": False, "message": "User account is disabled"}

        token_data = {
            "sub": user.id,
            "email": user.email,
            "role": user.role,
            "name": user.name
        }
        access_token = TokenUtils.create_access_token(token_data)

        user_profile = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "specialty": user.specialty,
            "is_active": user.is_active
        }

        return {
            "success": True,
            "user": user_profile,
            "access_token": access_token,
            "token": access_token,  # compatibility
            "token_type": "bearer"
        }

    @classmethod
    def get_current_user_profile(cls, db: Session, user_id: str) -> Optional[Dict[str, Any]]:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "specialty": user.specialty,
            "is_active": user.is_active
        }
