from typing import Optional, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from backend.models.clinical_event import ClinicalEvent
from backend.models.patient import Patient
from backend.models.encounter import Encounter
from backend.schemas.clinical_event import ClinicalEventCreate, ClinicalEventUpdate
from backend.services.audit_service import AuditService

VALID_EVENT_TYPES = {
    "INITIAL_ASSESSMENT",
    "DAILY_UPDATE",
    "INVESTIGATION",
    "MEDICATION_UPDATE",
    "PROCEDURE",
    "DISCHARGE"
}

class ClinicalService:
    @classmethod
    def create_event(
        cls,
        db: Session,
        payload: ClinicalEventCreate,
        current_user: Optional[Dict[str, Any]] = None
    ) -> ClinicalEvent:
        patient = db.query(Patient).filter(Patient.id == payload.patient_id).first()
        if not patient:
            raise ValueError(f"Patient with ID {payload.patient_id} not found")

        # Resolve encounter_id if not provided
        encounter_id = payload.encounter_id
        if not encounter_id:
            active_enc = db.query(Encounter).filter(
                Encounter.patient_id == payload.patient_id,
                Encounter.status == "ACTIVE"
            ).first()
            if active_enc:
                encounter_id = active_enc.id

        event_type = payload.event_type.upper().strip()
        if event_type not in VALID_EVENT_TYPES:
            # Fallback normalization or allow with warning
            event_type = "DAILY_UPDATE" if "DAILY" in event_type else event_type

        # Generate default title if not provided
        title = payload.title
        if not title:
            title = event_type.replace("_", " ").title()

        event = ClinicalEvent(
            patient_id=payload.patient_id,
            encounter_id=encounter_id,
            event_type=event_type,
            title=title,
            content=payload.content,
            created_by=payload.created_by or (current_user.get("name") if current_user else "Attending Clinician"),
            created_at=datetime.utcnow()
        )
        db.add(event)
        db.commit()
        db.refresh(event)

        # Audit log
        AuditService.log_action(
            db=db,
            action="CLINICAL_EVENT_CREATED",
            resource_type="clinical_event",
            resource_id=event.id,
            user_id=current_user.get("sub") if current_user else None,
            user_email=current_user.get("email") if current_user else None,
            details=f"Added {event_type} note for patient {patient.name}"
        )

        return event

    @classmethod
    def get_event_by_id(cls, db: Session, event_id: str) -> Optional[ClinicalEvent]:
        return db.query(ClinicalEvent).filter(ClinicalEvent.id == event_id).first()

    @classmethod
    def update_event(
        cls,
        db: Session,
        event_id: str,
        payload: ClinicalEventUpdate,
        current_user: Optional[Dict[str, Any]] = None
    ) -> Optional[ClinicalEvent]:
        event = db.query(ClinicalEvent).filter(ClinicalEvent.id == event_id).first()
        if not event:
            return None

        update_data = payload.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if hasattr(event, key) and value is not None:
                setattr(event, key, value)

        db.commit()
        db.refresh(event)

        # Audit log
        AuditService.log_action(
            db=db,
            action="CLINICAL_EVENT_UPDATED",
            resource_type="clinical_event",
            resource_id=event.id,
            user_id=current_user.get("sub") if current_user else None,
            user_email=current_user.get("email") if current_user else None,
            details=f"Updated clinical event {event_id}"
        )

        return event
