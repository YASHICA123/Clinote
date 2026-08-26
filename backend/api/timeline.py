from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.schemas.clinical_event import ClinicalEventCreate
from backend.services.timeline_service import TimelineService
from backend.services.clinical_service import ClinicalService
from backend.middleware.auth import get_current_user_profile, require_permission
from backend.utils.responses import standard_response

router = APIRouter(prefix="/timeline", tags=["Timeline"])

@router.get("/{patient_id}")
def get_timeline(
    patient_id: str,
    encounter_id: Optional[str] = Query(None),
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
    order: str = Query("asc"),
    current_user: dict = Depends(get_current_user_profile),
    db: Session = Depends(get_db)
):
    data = TimelineService.get_timeline(
        db=db,
        patient_id=patient_id,
        encounter_id=encounter_id,
        from_date=from_date,
        to_date=to_date,
        order=order
    )
    # Return events array or object for compatibility
    return standard_response(True, "Timeline retrieved successfully", data.get("events", []))

@router.post("/event")
def create_event(
    payload: ClinicalEventCreate,
    current_user: dict = Depends(require_permission("create_clinical_event")),
    db: Session = Depends(get_db)
):
    event = ClinicalService.create_event(db, payload, current_user=current_user)
    return standard_response(True, "Timeline event added successfully", {
        "id": event.id,
        "patient_id": event.patient_id,
        "event_type": event.event_type,
        "title": event.title,
        "content": event.content,
        "created_by": event.created_by,
        "created_at": event.created_at.isoformat()
    })
