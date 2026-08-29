from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.services.audit_service import AuditService
from backend.middleware.auth import get_current_user_profile
from backend.utils.responses import standard_response

router = APIRouter(prefix="/audit", tags=["Audit"])

from pydantic import BaseModel

class AuditLogCreate(BaseModel):
    action: str
    resource_type: str
    resource_id: str
    details: Optional[str] = None

@router.get("/logs")
def get_audit_logs(
    patient_id: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    current_user: dict = Depends(get_current_user_profile),
    db: Session = Depends(get_db)
):
    logs = AuditService.get_logs(db, patient_id=patient_id, limit=limit)
    result = [{
        "id": l.id,
        "user_id": l.user_id,
        "user_email": l.user_email,
        "action": l.action,
        "resource_type": l.resource_type,
        "resource_id": l.resource_id,
        "details": l.details,
        "created_at": l.created_at.isoformat()
    } for l in logs]
    return standard_response(True, "Audit logs retrieved successfully", result)

@router.post("/logs")
def create_audit_log(
    payload: AuditLogCreate,
    current_user: dict = Depends(get_current_user_profile),
    db: Session = Depends(get_db)
):
    log = AuditService.log_action(
        db=db,
        action=payload.action,
        resource_type=payload.resource_type,
        resource_id=payload.resource_id,
        user_id=current_user.get("user_id") or current_user.get("sub"),
        user_email=current_user.get("email"),
        details=payload.details
    )
    return standard_response(True, "Audit log recorded successfully", {
        "id": log.id,
        "action": log.action,
        "resource_type": log.resource_type,
        "resource_id": log.resource_id,
        "details": log.details,
        "created_at": log.created_at.isoformat()
    })
