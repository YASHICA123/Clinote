from fastapi import APIRouter, UploadFile, File, HTTPException, status
from backend.schemas.admission import AdmissionUploadResponse, AdmissionExtractionRequest, AdmissionExtractionResponse
from backend.schemas.patient import PatientResponse
from backend.services.admission_service import AdmissionService

router = APIRouter(prefix="/admission", tags=["Admission"])

@router.post("/upload-image", response_model=AdmissionUploadResponse)
async def upload_image(file: UploadFile = File(...)):
    content = await file.read()
    res = AdmissionService.upload_sheet(file.filename, content)
    return res

@router.post("/extract", response_model=PatientResponse)
def extract_admission(payload: AdmissionExtractionRequest):
    res = AdmissionService.extract_admission_data(payload.patient_id, payload.image_url)
    return res

@router.get("/{patient_id}")
def get_admission(patient_id: str):
    res = AdmissionService.get_admission_details(patient_id)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admission record not found"
        )
    return res
