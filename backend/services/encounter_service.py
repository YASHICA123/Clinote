from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from backend.models.encounter import Encounter
from backend.models.patient import Patient
from backend.schemas.encounter import EncounterCreate, EncounterUpdate
from backend.services.audit_service import AuditService

class EncounterService:
    @classmethod
    def create_encounter(
        cls,
        db: Session,
        patient_id: str,
        payload: EncounterCreate,
        current_user: Optional[Dict[str, Any]] = None
    ) -> Encounter:
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            raise ValueError(f"Patient with ID {patient_id} not found")

        encounter = Encounter(
            patient_id=patient_id,
            doctor_id=payload.doctor_id or (current_user.get("sub") if current_user else None),
            doctor_name=payload.doctor_name or (current_user.get("name") if current_user else "Attending Doctor"),
            department=payload.department or patient.department or "General Medicine",
            admission_date=payload.admission_date or datetime.utcnow(),
            status=payload.status or "ACTIVE",
            admission_notes=payload.admission_notes
        )
        db.add(encounter)
        
        # If status is ACTIVE, also update patient status/department
        if encounter.status == "ACTIVE":
            patient.department = encounter.department
            if patient.status == "DISCHARGED":
                patient.status = "ACTIVE"
                
        db.commit()
        db.refresh(encounter)

        # Audit log
        AuditService.log_action(
            db=db,
            action="ENCOUNTER_CREATED",
            resource_type="encounter",
            resource_id=encounter.id,
            user_id=current_user.get("sub") if current_user else None,
            user_email=current_user.get("email") if current_user else None,
            details=f"Created encounter for patient {patient.name} in {encounter.department}"
        )

        return encounter

    @classmethod
    def get_encounters_by_patient(cls, db: Session, patient_id: str) -> List[Encounter]:
        return db.query(Encounter).filter(Encounter.patient_id == patient_id).order_by(Encounter.admission_date.desc()).all()

    @classmethod
    def get_encounter_by_id(cls, db: Session, encounter_id: str) -> Optional[Encounter]:
        return db.query(Encounter).filter(Encounter.id == encounter_id).first()

    @classmethod
    def update_encounter(
        cls,
        db: Session,
        encounter_id: str,
        payload: EncounterUpdate,
        current_user: Optional[Dict[str, Any]] = None
    ) -> Optional[Encounter]:
        encounter = db.query(Encounter).filter(Encounter.id == encounter_id).first()
        if not encounter:
            return None

        update_data = payload.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if hasattr(encounter, key) and value is not None:
                setattr(encounter, key, value)

        # If encounter is discharged, set discharge_date if not set
        if encounter.status in ("DISCHARGED", "CLOSED") and not encounter.discharge_date:
            encounter.discharge_date = datetime.utcnow()

        db.commit()
        db.refresh(encounter)

        # Audit log
        AuditService.log_action(
            db=db,
            action="ENCOUNTER_UPDATED",
            resource_type="encounter",
            resource_id=encounter.id,
            user_id=current_user.get("sub") if current_user else None,
            user_email=current_user.get("email") if current_user else None,
            details=f"Updated encounter status to {encounter.status}"
        )

        return encounter
