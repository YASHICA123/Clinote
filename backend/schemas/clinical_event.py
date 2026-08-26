from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ClinicalEventCreate(BaseModel):
    patient_id: str
    encounter_id: Optional[str] = None
    event_type: str
    title: Optional[str] = None
    content: str
    created_by: Optional[str] = None

class ClinicalEventUpdate(BaseModel):
    event_type: Optional[str] = None
    title: Optional[str] = None
    content: Optional[str] = None

class ClinicalEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    encounter_id: Optional[str] = None
    event_type: str
    title: Optional[str] = None
    content: str
    created_by: str
    created_at: datetime
    updated_at: datetime

TimelineEventCreateRequest = ClinicalEventCreate
