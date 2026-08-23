from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status, Depends
from typing import List
from backend.schemas.investigation import InvestigationCreateRequest, InvestigationUpdateRequest
from backend.services.investigation_service import InvestigationService
from backend.middleware.auth import require_permission
from backend.utils.responses import standard_response

router = APIRouter(prefix="/investigations", tags=["Investigations"])

@router.get("/{patient_id}")
def get_investigations(patient_id: str, current_user: dict = Depends(require_permission("view_patient"))):
    data = InvestigationService.get_investigations(patient_id)
    return standard_response(True, "Investigations retrieved successfully", data)

@router.post("", status_code=status.HTTP_201_CREATED)
def create_investigation(payload: InvestigationCreateRequest, current_user: dict = Depends(require_permission("edit_patient"))):
    data = InvestigationService.create_investigation(payload.model_dump())
    return standard_response(True, "Investigation created successfully", data)

@router.post("/upload")
async def upload_investigation(
    patient_id: str = Form(...),
    file: UploadFile = File(...),
    current_user: dict = Depends(require_permission("upload_reports"))
):
    content = await file.read()
    res = InvestigationService.upload_report(patient_id, file.filename, content)
    return standard_response(True, "Investigation report uploaded successfully", res)

@router.patch("/{investigation_id}")
def update_investigation(
    investigation_id: str,
    payload: InvestigationUpdateRequest,
    current_user: dict = Depends(require_permission("edit_patient"))
):
    res = InvestigationService.update_investigation(investigation_id, payload.model_dump(exclude_unset=True))
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Investigation not found"
        )
    return standard_response(True, "Investigation updated successfully", res)

@router.delete("/{investigation_id}")
def delete_investigation(
    investigation_id: str,
    current_user: dict = Depends(require_permission("delete_records"))
):
    success = InvestigationService.delete_investigation(investigation_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Investigation not found"
        )
    return standard_response(True, "Investigation deleted successfully", None)
