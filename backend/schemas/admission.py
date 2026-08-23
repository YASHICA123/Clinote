from pydantic import BaseModel
from typing import List, Optional

class AdmissionUploadResponse(BaseModel):
    file_path: str
    status: str

class AdmissionExtractionRequest(BaseModel):
    patient_id: str
    image_url: str

class AdmissionExtractionResponse(BaseModel):
    patient_name: str
    age: int
    gender: str
    admission_date: str
    diagnoses: List[str]
    history: List[str]
    medications: List[str]
