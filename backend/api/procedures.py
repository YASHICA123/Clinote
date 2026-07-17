from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from backend.schemas.procedure import ProcedureCreateRequest
from backend.services.procedure_service import ProcedureService
from backend.middleware.auth import require_permission
from backend.utils.responses import standard_response

router = APIRouter(prefix="/procedures", tags=["Procedures"])

@router.get("/{patient_id}")
def get_procedures(patient_id: str, current_user: dict = Depends(require_permission("view_patient"))):
    data = ProcedureService.get_procedures(patient_id)
    return standard_response(True, "Procedures retrieved successfully", data)

@router.post("", status_code=status.HTTP_201_CREATED)
def record_procedure(payload: ProcedureCreateRequest, current_user: dict = Depends(require_permission("edit_patient"))):
    data = ProcedureService.record_procedure(payload.model_dump())
    return standard_response(True, "Procedure recorded successfully", data)

@router.delete("/{procedure_id}")
def delete_procedure(procedure_id: str, current_user: dict = Depends(require_permission("delete_records"))):
    success = ProcedureService.delete_procedure(procedure_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Procedure not found"
        )
    return standard_response(True, "Procedure deleted successfully", None)
