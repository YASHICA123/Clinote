from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from backend.schemas.consultation import ConsultationCreateRequest
from backend.services.consultation_service import ConsultationService
from backend.middleware.auth import require_permission
from backend.utils.responses import standard_response

router = APIRouter(prefix="/consultations", tags=["Consultations"])

@router.get("/{patient_id}")
def get_consultations(patient_id: str, current_user: dict = Depends(require_permission("view_patient"))):
    data = ConsultationService.get_consultations(patient_id)
    return standard_response(True, "Consultations retrieved successfully", data)

@router.post("", status_code=status.HTTP_201_CREATED)
def request_consultation(payload: ConsultationCreateRequest, current_user: dict = Depends(require_permission("edit_patient"))):
    data = ConsultationService.request_consultation(payload.model_dump())
    return standard_response(True, "Consultation requested successfully", data)

@router.delete("/{consultation_id}")
def delete_consultation(consultation_id: str, current_user: dict = Depends(require_permission("delete_records"))):
    success = ConsultationService.delete_consultation(consultation_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultation not found"
        )
    return standard_response(True, "Consultation deleted successfully", None)
