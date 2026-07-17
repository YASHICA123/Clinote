from fastapi import APIRouter
from backend.schemas.generation import (
    GenerateCourseRequest,
    GenerateDischargeRequest,
    GenerateTeleconsultRequest,
    GenerateSummaryRequest,
    GenerationResponse
)
from backend.services.generation_service import GenerationService

router = APIRouter(prefix="/generate", tags=["AI Generation"])

@router.post("/course", response_model=GenerationResponse)
def generate_course(payload: GenerateCourseRequest):
    return GenerationService.generate_clinical_course(payload.patient_id, payload.clinical_notes)

@router.post("/discharge", response_model=GenerationResponse)
def generate_discharge(payload: GenerateDischargeRequest):
    return GenerationService.generate_discharge_summary(payload.patient_id)

@router.post("/teleconsult", response_model=GenerationResponse)
def generate_teleconsult(payload: GenerateTeleconsultRequest):
    return GenerationService.generate_teleconsult_report(payload.patient_id, payload.transcript)

@router.post("/summary", response_model=GenerationResponse)
def generate_summary(payload: GenerateSummaryRequest):
    return GenerationService.generate_general_summary(payload.patient_id)
