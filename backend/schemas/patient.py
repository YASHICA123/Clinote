from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class VitalsModel(BaseModel):
    hr: Optional[int] = None
    bp: Optional[str] = None
    rr: Optional[int] = None
    spo2: Optional[int] = None
    temp: Optional[str] = None

class PatientCreateRequest(BaseModel):
    name: str
    age: int
    gender: str
    bedNumber: Optional[str] = None
    status: str
    admissionSource: Optional[str] = None
    consultant: Optional[str] = None
    diagnoses: List[str] = []
    vitals: Optional[VitalsModel] = None

class PatientUpdateRequest(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    bedNumber: Optional[str] = None
    status: Optional[str] = None
    statusText: Optional[str] = None
    diagnoses: Optional[List[str]] = None
    vitals: Optional[VitalsModel] = None

class PatientResponse(BaseModel):
    id: str
    name: str
    age: int
    gender: str
    bedNumber: str
    status: str
    statusText: str
    admissionDate: str
    admissionSource: Optional[str] = None
    consultant: Optional[str] = None
    diagnoses: List[str]
    vitals: Optional[VitalsModel] = None
    isNew: Optional[bool] = None
    displayId: Optional[str] = None
    ipNumber: Optional[str] = None
