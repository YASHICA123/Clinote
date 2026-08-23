from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from backend.schemas.timeline import TimelineEventCreateRequest
from backend.services.timeline_service import TimelineService
from backend.middleware.auth import require_permission
from backend.utils.responses import standard_response

router = APIRouter(prefix="/timeline", tags=["Timeline"])

@router.get("/{patient_id}")
def get_timeline(patient_id: str, current_user: dict = Depends(require_permission("view_patient"))):
    data = TimelineService.get_timeline(patient_id)
    return standard_response(True, "Timeline retrieved successfully", data)

@router.post("/event")
def create_event(payload: TimelineEventCreateRequest, current_user: dict = Depends(require_permission("edit_patient"))):
    data = TimelineService.add_event(payload.model_dump())
    return standard_response(True, "Timeline event added successfully", data)
