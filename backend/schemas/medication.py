from pydantic import BaseModel
from typing import Optional

class MedicationCreateRequest(BaseModel):
    patientId: str
    name: str
    dosage: str
    frequency: str
    route: str
    status: Optional[str] = "Active"
    startDate: Optional[str] = None
    prescriber: Optional[str] = None

class MedicationUpdateRequest(BaseModel):
    name: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    route: Optional[str] = None
    status: Optional[str] = None
    endDate: Optional[str] = None

class MedicationResponse(BaseModel):
    id: str
    patientId: str
    name: str
    dosage: str
    frequency: str
    route: str
    status: str
    startDate: str
    endDate: Optional[str] = None
    prescriber: Optional[str] = None
