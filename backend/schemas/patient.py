from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class PatientCreate(BaseModel):
    name: str
    hospital_patient_id: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = "other"
    age: Optional[int] = None
    status: Optional[str] = "ACTIVE"
    department: Optional[str] = "General Medicine"
    bed_number: Optional[str] = None
    consultant: Optional[str] = None
    initial_encounter_note: Optional[str] = None

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    hospital_patient_id: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    status: Optional[str] = None
    department: Optional[str] = None
    bed_number: Optional[str] = None
    consultant: Optional[str] = None

class PatientResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    hospital_patient_id: str
    name: str
    date_of_birth: Optional[str] = None
    gender: str
    age: Optional[int] = None
    status: str
    department: Optional[str] = None
    bed_number: Optional[str] = None
    consultant: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    active_encounter_id: Optional[str] = None

class PatientAdmissionData(BaseModel):
    full_name: str
    uhid: Optional[str] = None
    date_of_birth: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = "male"
    phone_number: Optional[str] = None
    address: Optional[str] = None
    admission_date: Optional[str] = None
    admission_time: Optional[str] = None
    department: Optional[str] = "General Medicine"
    ward: Optional[str] = None
    consultant: Optional[str] = None
    hospital: Optional[str] = None

class PatientConfirmRequest(BaseModel):
    upload_id: Optional[str] = None
    patient_data: PatientAdmissionData

# Alias for backwards compatibility
PatientCreateRequest = PatientCreate
PatientUpdateRequest = PatientUpdate
