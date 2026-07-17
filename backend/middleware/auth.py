from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from backend.utils.auth import TokenUtils
from backend.middleware.request_id import set_current_user_email

security = HTTPBearer()

# Permission mappings
ROLE_HIERARCHY = {
    "Admin": ["view_patient", "edit_patient", "add_medication", "upload_reports", "generate_discharge", "delete_records"],
    "Consultant": ["view_patient", "edit_patient", "add_medication", "upload_reports", "generate_discharge"],
    "Doctor": ["view_patient", "edit_patient", "add_medication", "upload_reports", "generate_discharge"],
    "Resident": ["view_patient", "edit_patient", "upload_reports"],
    "Nurse": ["view_patient", "upload_reports"]
}

async def get_current_user_profile(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    payload = TokenUtils.verify_token(token, "access")
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Bind user email to ContextVar
    set_current_user_email(payload.get("email", ""))
    return payload

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: dict = Depends(get_current_user_profile)):
        user_role = current_user.get("role")
        if not user_role or user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted for role: {user_role}. Requires one of: {self.allowed_roles}"
            )
        return current_user

class PermissionChecker:
    def __init__(self, required_permission: str):
        self.required_permission = required_permission

    def __call__(self, current_user: dict = Depends(get_current_user_profile)):
        user_role = current_user.get("role", "Nurse")
        user_permissions = ROLE_HIERARCHY.get(user_role, ["view_patient"])
        if self.required_permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Requires permission: {self.required_permission}"
            )
        return current_user

# Direct helpers (return the callables directly for use with Depends)
def require_permission(permission: str):
    return PermissionChecker(permission)

def require_roles(roles: List[str]):
    return RoleChecker(roles)
