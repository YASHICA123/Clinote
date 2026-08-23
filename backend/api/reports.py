from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status, Depends
from typing import List
from backend.services.report_service import ReportService
from backend.middleware.auth import require_permission
from backend.utils.responses import standard_response

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/{patient_id}")
def get_reports(patient_id: str, current_user: dict = Depends(require_permission("view_patient"))):
    data = ReportService.get_reports(patient_id)
    return standard_response(True, "Reports retrieved successfully", data)

@router.post("/upload")
async def upload_report(
    patient_id: str = Form(...),
    file: UploadFile = File(...),
    current_user: dict = Depends(require_permission("upload_reports"))
):
    content = await file.read()
    res = ReportService.upload_report_file(patient_id, file.filename, content)
    return standard_response(True, "Report uploaded successfully", res)

@router.delete("/{report_id}")
def delete_report(report_id: str, current_user: dict = Depends(require_permission("delete_records"))):
    success = ReportService.delete_report(report_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    return standard_response(True, "Report deleted successfully", None)
