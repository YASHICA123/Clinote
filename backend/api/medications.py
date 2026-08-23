from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from backend.schemas.medication import MedicationCreateRequest, MedicationUpdateRequest
from backend.services.medication_service import MedicationService
from backend.middleware.auth import require_permission
from backend.utils.responses import standard_response

router = APIRouter(prefix="/medications", tags=["Medications"])

@router.get("/{patient_id}")
def get_medications(patient_id: str, current_user: dict = Depends(require_permission("view_patient"))):
    data = MedicationService.get_medications(patient_id)
    return standard_response(True, "Medications retrieved successfully", data)

@router.post("")
def prescribe_medication(payload: MedicationCreateRequest, current_user: dict = Depends(require_permission("add_medication"))):
    data = MedicationService.prescribe_medication(payload.model_dump())
    return standard_response(True, "Medication prescribed successfully", data)

@router.patch("/{medication_id}")
def update_medication(medication_id: str, payload: MedicationUpdateRequest, current_user: dict = Depends(require_permission("add_medication"))):
    res = MedicationService.update_medication(medication_id, payload.model_dump(exclude_unset=True))
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medication not found"
        )
    return standard_response(True, "Medication updated successfully", res)

@router.delete("/{medication_id}")
def delete_medication(medication_id: str, current_user: dict = Depends(require_permission("delete_records"))):
    success = MedicationService.delete_medication(medication_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medication not found"
        )
    return standard_response(True, "Medication deleted successfully", None)
