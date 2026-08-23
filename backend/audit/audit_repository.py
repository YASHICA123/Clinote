from typing import List, Dict, Any
from datetime import datetime

class AuditRepository:
    _audit_logs: List[Dict[str, Any]] = []

    @classmethod
    def log_action(cls, actor: str, action: str, details: str) -> Dict[str, Any]:
        log_record = {
            "id": f"aud-{len(cls._audit_logs) + 1}",
            "timestamp": datetime.now().isoformat(),
            "actor": actor,
            "action": action,
            "details": details
        }
        cls._audit_logs.append(log_record)
        return log_record

    @classmethod
    def get_logs(cls) -> List[Dict[str, Any]]:
        return cls._audit_logs
