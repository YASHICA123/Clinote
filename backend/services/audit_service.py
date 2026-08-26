from typing import Optional, List
from sqlalchemy.orm import Session
from backend.models.audit_log import AuditLog

class AuditService:
    @staticmethod
    def log_action(
        db: Session,
        action: str,
        resource_type: str,
        resource_id: str,
        user_id: Optional[str] = None,
        user_email: Optional[str] = None,
        details: Optional[str] = None
    ) -> AuditLog:
        audit_entry = AuditLog(
            user_id=user_id,
            user_email=user_email,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details
        )
        db.add(audit_entry)
        db.commit()
        db.refresh(audit_entry)
        return audit_entry

    @staticmethod
    def get_logs(
        db: Session,
        patient_id: Optional[str] = None,
        limit: int = 100
    ) -> List[AuditLog]:
        query = db.query(AuditLog)
        if patient_id:
            query = query.filter(AuditLog.resource_id == patient_id)
        return query.order_by(AuditLog.created_at.desc()).limit(limit).all()
