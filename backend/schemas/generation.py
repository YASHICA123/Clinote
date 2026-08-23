from pydantic import BaseModel
from typing import Optional

class GenerateCourseRequest(BaseModel):
    patient_id: str
    clinical_notes: str

class GenerateDischargeRequest(BaseModel):
    patient_id: str

class GenerateTeleconsultRequest(BaseModel):
    patient_id: str
    transcript: str

class GenerateSummaryRequest(BaseModel):
    patient_id: str

class GenerationResponse(BaseModel):
    patient_id: str
    generated_text: str
    summary_type: str
    timestamp: str
