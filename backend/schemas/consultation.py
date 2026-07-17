from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ConsultationCreateRequest(BaseModel):
    patient_id: str
    consultant: str
    department: str
    summary: Optional[str] = ""

class ConsultationResponse(BaseModel):
    consultation_id: str
    patient_id: str
    consultant: str
    department: str
    summary: str
    created_at: datetime

    class Config:
        from_attributes = True
