from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class DocumentCreate(BaseModel):
    patient_id: str
    encounter_id: Optional[str] = None
    document_type: Optional[str] = "DISCHARGE_SUMMARY"
    title: str
    content: str
    status: Optional[str] = "DRAFT"
    created_by: Optional[str] = None

class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    document_type: Optional[str] = None

class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    encounter_id: Optional[str] = None
    document_type: str
    title: str
    content: str
    status: str
    created_by: str
    finalized_at: Optional[datetime] = None
    finalized_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime
