from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DailyNoteCreateRequest(BaseModel):
    patient_id: str
    note_text: str
    created_by: Optional[str] = "Staff"

class DailyNoteUpdateRequest(BaseModel):
    note_text: str

class DailyNoteResponse(BaseModel):
    note_id: str
    patient_id: str
    note_text: str
    created_by: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
