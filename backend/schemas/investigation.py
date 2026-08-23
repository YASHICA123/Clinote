from pydantic import BaseModel
from typing import Optional

class InvestigationUploadResponse(BaseModel):
    file_path: str
    status: str

class InvestigationCreateRequest(BaseModel):
    patientId: str
    testName: str
    category: str
    result: Optional[str] = ""
    status: Optional[str] = "Normal"
    testDate: Optional[str] = None

class InvestigationUpdateRequest(BaseModel):
    testName: Optional[str] = None
    category: Optional[str] = None
    result: Optional[str] = None
    status: Optional[str] = None
    testDate: Optional[str] = None

class InvestigationResponse(BaseModel):
    id: str
    patientId: str
    testName: str
    category: str
    result: str
    referenceRange: Optional[str] = None
    unit: Optional[str] = None
    status: str
    testDate: str
    reportUrl: Optional[str] = None

    class Config:
        from_attributes = True
