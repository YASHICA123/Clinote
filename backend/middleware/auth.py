from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
from backend.utils.auth import TokenUtils
from backend.middleware.request_id import set_current_user_email

security = HTTPBearer(auto_error=False)

# Permission mappings (case-insensitive keys)
ROLE_HIERARCHY = {
    "admin": ["view_patient", "edit_patient", "create_encounter", "edit_encounter", "create_clinical_event", "create_document", "edit_document", "finalize_document", "delete_records"],
    "doctor": ["view_patient", "edit_patient", "create_encounter", "edit_encounter", "create_clinical_event", "create_document", "edit_document", "finalize_document"],
    "consultant": ["view_patient", "edit_patient", "create_encounter", "edit_encounter", "create_clinical_event", "create_document", "edit_document", "finalize_document"],
    "resident": ["view_patient", "edit_patient", "create_encounter", "create_clinical_event", "create_document", "edit_document"],
    "nurse": ["view_patient", "create_clinical_event"]
}

async def get_current_user_profile(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> dict:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = credentials.credentials
    payload = TokenUtils.verify_token(token, "access")
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Bind user email to ContextVar
    set_current_user_email(payload.get("email", ""))
    return payload

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = [r.lower() for r in allowed_roles]

    def __call__(self, current_user: dict = Depends(get_current_user_profile)):
        user_role = (current_user.get("role") or "").lower()
        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted for role: {user_role}. Requires one of: {self.allowed_roles}"
            )
        return current_user

class PermissionChecker:
    def __init__(self, required_permission: str):
        self.required_permission = required_permission

    def __call__(self, current_user: dict = Depends(get_current_user_profile)):
        user_role = (current_user.get("role") or "doctor").lower()
        user_permissions = ROLE_HIERARCHY.get(user_role, ["view_patient", "create_clinical_event"])
        if self.required_permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Requires permission: {self.required_permission}"
            )
        return current_user

def require_permission(permission: str):
    return PermissionChecker(permission)

def require_roles(roles: List[str]):
    return RoleChecker(roles)
