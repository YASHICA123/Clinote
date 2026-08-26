from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class TimelineEventItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    event_id: str
    id: str
    patient_id: str
    encounter_id: Optional[str] = None
    event_type: str
    type: str
    title: Optional[str] = None
    content: str
    details: str
    created_by: str
    created_at: datetime
    timestamp: str

class TimelineResponse(BaseModel):
    patient_id: str
    events: List[TimelineEventItem]
