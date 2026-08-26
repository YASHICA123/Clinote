from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class AuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    action: str
    resource_type: str
    resource_id: str
    details: Optional[str] = None
    created_at: datetime
