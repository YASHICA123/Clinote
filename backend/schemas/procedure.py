from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ProcedureCreateRequest(BaseModel):
    patient_id: str
    procedure_name: str
    performed_by: Optional[str] = ""
    performed_at: Optional[datetime] = None
    summary: Optional[str] = ""

class ProcedureResponse(BaseModel):
    procedure_id: str
    patient_id: str
    procedure_name: str
    performed_by: str
    performed_at: Optional[datetime]
    summary: str
    created_at: datetime

    class Config:
        from_attributes = True
