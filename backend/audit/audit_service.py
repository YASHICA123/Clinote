from typing import List, Dict, Any
from backend.audit.audit_repository import AuditRepository
from backend.repositories.mock_store import mock_db

class AuditService:
    @staticmethod
    def log(action: str, details: str) -> Dict[str, Any]:
        actor = mock_db.current_user.get("name", "System")
        return AuditRepository.log_action(actor, action, details)

    @staticmethod
    def get_audit_trail() -> List[Dict[str, Any]]:
        return AuditRepository.get_logs()
