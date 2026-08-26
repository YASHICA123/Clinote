from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.schemas.encounter import EncounterUpdate
from backend.services.encounter_service import EncounterService
from backend.middleware.auth import get_current_user_profile, require_permission
from backend.utils.responses import standard_response

router = APIRouter(prefix="/encounters", tags=["Encounters"])

@router.get("/{encounter_id}")
def get_encounter(
    encounter_id: str,
    current_user: dict = Depends(get_current_user_profile),
    db: Session = Depends(get_db)
):
    encounter = EncounterService.get_encounter_by_id(db, encounter_id)
    if not encounter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encounter not found"
        )
    return standard_response(True, "Encounter retrieved successfully", {
        "id": encounter.id,
        "patient_id": encounter.patient_id,
        "doctor_id": encounter.doctor_id,
        "doctor_name": encounter.doctor_name,
        "department": encounter.department,
        "admission_date": encounter.admission_date.isoformat(),
        "discharge_date": encounter.discharge_date.isoformat() if encounter.discharge_date else None,
        "status": encounter.status,
        "admission_notes": encounter.admission_notes,
        "created_at": encounter.created_at.isoformat(),
        "updated_at": encounter.updated_at.isoformat()
    })

@router.patch("/{encounter_id}")
def update_encounter(
    encounter_id: str,
    payload: EncounterUpdate,
    current_user: dict = Depends(require_permission("edit_encounter")),
    db: Session = Depends(get_db)
):
    encounter = EncounterService.update_encounter(db, encounter_id, payload, current_user=current_user)
    if not encounter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Encounter not found"
        )
    return standard_response(True, "Encounter updated successfully", {
        "id": encounter.id,
        "patient_id": encounter.patient_id,
        "doctor_id": encounter.doctor_id,
        "doctor_name": encounter.doctor_name,
        "department": encounter.department,
        "admission_date": encounter.admission_date.isoformat(),
        "discharge_date": encounter.discharge_date.isoformat() if encounter.discharge_date else None,
        "status": encounter.status,
        "admission_notes": encounter.admission_notes,
        "updated_at": encounter.updated_at.isoformat()
    })
