from pydantic import BaseModel
from typing import Optional

class ReportUploadResponse(BaseModel):
    file_path: str
    status: str

class ReportResponse(BaseModel):
    id: str
    patientId: str
    title: str
    category: str
    date: str
    summary: str
    status: str
    fileUrl: Optional[str] = None
