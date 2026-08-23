from pydantic import BaseModel
from typing import Optional

class TimelineEventCreateRequest(BaseModel):
    patientId: str
    type: str
    title: str
    subtitle: Optional[str] = None
    details: Optional[str] = None

class TimelineEventResponse(BaseModel):
    id: str
    patientId: str
    type: str
    title: str
    subtitle: Optional[str] = None
    timestamp: str
    details: Optional[str] = None
