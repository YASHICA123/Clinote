from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.services.audit_service import AuditService
from backend.middleware.auth import get_current_user_profile
from backend.utils.responses import standard_response

router = APIRouter(prefix="/audit", tags=["Audit"])

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
