from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.schemas.clinical_event import ClinicalEventCreate, ClinicalEventUpdate
from backend.services.clinical_service import ClinicalService
from backend.middleware.auth import get_current_user_profile, require_permission
from backend.utils.responses import standard_response

router = APIRouter(prefix="/clinical", tags=["Clinical"])

@router.post("/events", status_code=status.HTTP_201_CREATED)
def create_clinical_event(
    payload: ClinicalEventCreate,
    current_user: dict = Depends(require_permission("create_clinical_event")),
    db: Session = Depends(get_db)
):
    try:
        event = ClinicalService.create_event(db, payload, current_user=current_user)
        return standard_response(True, "Clinical event created successfully", {
            "id": event.id,
            "patient_id": event.patient_id,
            "encounter_id": event.encounter_id,
            "event_type": event.event_type,
            "title": event.title,
            "content": event.content,
            "created_by": event.created_by,
            "created_at": event.created_at.isoformat()
        })
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.get("/events/{event_id}")
def get_clinical_event(
    event_id: str,
    current_user: dict = Depends(get_current_user_profile),
    db: Session = Depends(get_db)
):
    event = ClinicalService.get_event_by_id(db, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clinical event not found"
        )
    return standard_response(True, "Clinical event retrieved successfully", {
        "id": event.id,
        "patient_id": event.patient_id,
        "encounter_id": event.encounter_id,
        "event_type": event.event_type,
        "title": event.title,
        "content": event.content,
        "created_by": event.created_by,
        "created_at": event.created_at.isoformat(),
        "updated_at": event.updated_at.isoformat()
    })

@router.patch("/events/{event_id}")
def update_clinical_event(
    event_id: str,
    payload: ClinicalEventUpdate,
    current_user: dict = Depends(require_permission("create_clinical_event")),
    db: Session = Depends(get_db)
):
    event = ClinicalService.update_event(db, event_id, payload, current_user=current_user)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clinical event not found"
        )
    return standard_response(True, "Clinical event updated successfully", {
        "id": event.id,
        "patient_id": event.patient_id,
        "encounter_id": event.encounter_id,
        "event_type": event.event_type,
        "title": event.title,
        "content": event.content,
        "created_by": event.created_by,
        "updated_at": event.updated_at.isoformat()
    })
