from pydantic import BaseModel
from typing import List, Optional

class ClinicalHistoryCreateRequest(BaseModel):
    patient_id: str
    diagnoses: List[str] = []
    history: List[str] = []
    medications: List[str] = []

class ClinicalHistoryUpdateRequest(BaseModel):
    diagnoses: Optional[List[str]] = None
    history: Optional[List[str]] = None
    medications: Optional[List[str]] = None

class ClinicalHistoryResponse(BaseModel):
    id: str
    patient_id: str
    diagnoses: List[str]
    history: List[str]
    medications: List[str]

    class Config:
        from_attributes = True
