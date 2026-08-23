from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from backend.schemas.clinical_history import ClinicalHistoryCreateRequest, ClinicalHistoryUpdateRequest
from backend.services.clinical_history_service import ClinicalHistoryService
from backend.middleware.auth import require_permission
from backend.utils.responses import standard_response

router = APIRouter(prefix="/clinical-history", tags=["Clinical History"])

@router.get("/{patient_id}")
def get_history(patient_id: str, current_user: dict = Depends(require_permission("view_patient"))):
    data = ClinicalHistoryService.get_history(patient_id)
    return standard_response(True, "Clinical history retrieved successfully", data)

@router.post("", status_code=status.HTTP_201_CREATED)
def create_history(payload: ClinicalHistoryCreateRequest, current_user: dict = Depends(require_permission("edit_patient"))):
    data = ClinicalHistoryService.create_history(payload.model_dump())
    return standard_response(True, "Clinical history created successfully", data)

@router.patch("/{history_id}")
def update_history(history_id: str, payload: ClinicalHistoryUpdateRequest, current_user: dict = Depends(require_permission("edit_patient"))):
    res = ClinicalHistoryService.update_history(history_id, payload.model_dump(exclude_unset=True))
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clinical history not found"
        )
    return standard_response(True, "Clinical history updated successfully", res)

@router.delete("/{history_id}")
def delete_history(history_id: str, current_user: dict = Depends(require_permission("delete_records"))):
    success = ClinicalHistoryService.delete_history(history_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clinical history not found"
        )
    return standard_response(True, "Clinical history deleted successfully", None)
