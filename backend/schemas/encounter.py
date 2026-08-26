from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class EncounterCreate(BaseModel):
    department: Optional[str] = "General Medicine"
    admission_date: Optional[datetime] = None
    doctor_id: Optional[str] = None
    doctor_name: Optional[str] = None
    admission_notes: Optional[str] = None
    status: Optional[str] = "ACTIVE"

class EncounterUpdate(BaseModel):
    department: Optional[str] = None
    discharge_date: Optional[datetime] = None
    status: Optional[str] = None
    admission_notes: Optional[str] = None
    doctor_id: Optional[str] = None
    doctor_name: Optional[str] = None

class EncounterResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    doctor_id: Optional[str] = None
    doctor_name: Optional[str] = None
    department: str
    admission_date: datetime
    discharge_date: Optional[datetime] = None
    status: str
    admission_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
