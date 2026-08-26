import random
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_
from backend.models.patient import Patient
from backend.models.encounter import Encounter
from backend.schemas.patient import PatientCreate, PatientUpdate
from backend.services.audit_service import AuditService

class PatientService:
    @staticmethod
    def generate_mrn(db: Session) -> str:
        while True:
            candidate = f"MRN-{random.randint(1000, 9999)}"
            if not db.query(Patient).filter(Patient.hospital_patient_id == candidate).first():
                return candidate

    @classmethod
    def create_patient(
        cls,
        db: Session,
        payload: PatientCreate,
        current_user: Optional[Dict[str, Any]] = None
    ) -> Patient:
        if payload.hospital_patient_id:
            existing = db.query(Patient).filter(Patient.hospital_patient_id == payload.hospital_patient_id).first()
            if existing:
                raise ValueError(f"A patient with Hospital Patient ID '{payload.hospital_patient_id}' already exists.")
            mrn = payload.hospital_patient_id
        else:
            mrn = cls.generate_mrn(db)

        patient = Patient(
            hospital_patient_id=mrn,
            name=payload.name,
            date_of_birth=payload.date_of_birth,
            gender=payload.gender or "other",
            age=payload.age,
            status=payload.status or "ACTIVE",
            department=payload.department or "General Medicine",
            bed_number=payload.bed_number,
            consultant=payload.consultant or (current_user.get("name") if current_user else "Attending Physician")
        )
        db.add(patient)
        db.flush()

        # Create initial encounter for the new patient
        user_id = current_user.get("sub") if current_user else None
        user_name = current_user.get("name") if current_user else "Attending Physician"
        
        encounter = Encounter(
            patient_id=patient.id,
            doctor_id=user_id,
            doctor_name=user_name,
            department=patient.department or "General Medicine",
            status="ACTIVE",
            admission_notes=payload.initial_encounter_note or f"Initial admission for {patient.name}"
        )
        db.add(encounter)
        db.commit()
        db.refresh(patient)

        # Audit log
        AuditService.log_action(
            db=db,
            action="PATIENT_CREATED",
            resource_type="patient",
            resource_id=patient.id,
            user_id=user_id,
            user_email=current_user.get("email") if current_user else None,
            details=f"Created patient {patient.name} ({patient.hospital_patient_id})"
        )

        return patient

    @classmethod
    def get_patients(
        cls,
        db: Session,
        search: Optional[str] = None,
        hospital_patient_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        query = db.query(Patient)
        if hospital_patient_id:
            query = query.filter(Patient.hospital_patient_id.ilike(f"%{hospital_patient_id.strip()}%"))
        elif search:
            search_term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Patient.name.ilike(search_term),
                    Patient.hospital_patient_id.ilike(search_term),
                    Patient.department.ilike(search_term)
                )
            )

        patients = query.order_by(Patient.created_at.desc()).all()
        result = []
        for p in patients:
            active_enc = next((e for e in p.encounters if e.status == "ACTIVE"), None)
            result.append({
                "id": p.id,
                "hospital_patient_id": p.hospital_patient_id,
                "name": p.name,
                "date_of_birth": p.date_of_birth,
                "gender": p.gender,
                "age": p.age,
                "status": p.status,
                "statusText": "Active" if p.status in ("ACTIVE", "ICU", "WARD") else "Discharged",
                "department": p.department,
                "bed_number": p.bed_number,
                "bedNumber": p.bed_number,
                "consultant": p.consultant,
                "created_at": p.created_at,
                "updated_at": p.updated_at,
                "admissionDate": p.created_at.strftime("%d %b %Y") if p.created_at else "",
                "active_encounter_id": active_enc.id if active_enc else None,
                "vitals": {"hr": 78, "bp": "120/80", "rr": 18, "spo2": 98, "temp": "98.6"}
            })
        return result

    @classmethod
    def get_patient_by_id(cls, db: Session, patient_id: str) -> Optional[Dict[str, Any]]:
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            return None
            
        active_enc = next((e for e in patient.encounters if e.status == "ACTIVE"), None)
        return {
            "id": patient.id,
            "hospital_patient_id": patient.hospital_patient_id,
            "name": patient.name,
            "date_of_birth": patient.date_of_birth,
            "gender": patient.gender,
            "age": patient.age,
            "status": patient.status,
            "statusText": "Active" if patient.status in ("ACTIVE", "ICU", "WARD") else "Discharged",
            "department": patient.department,
            "bed_number": patient.bed_number,
            "bedNumber": patient.bed_number,
            "consultant": patient.consultant,
            "created_at": patient.created_at,
            "updated_at": patient.updated_at,
            "admissionDate": patient.created_at.strftime("%d %b %Y") if patient.created_at else "",
            "active_encounter_id": active_enc.id if active_enc else None,
            "vitals": {"hr": 80, "bp": "120/80", "rr": 18, "spo2": 98, "temp": "98.6"}
        }

    @classmethod
    def update_patient(
        cls,
        db: Session,
        patient_id: str,
        payload: PatientUpdate,
        current_user: Optional[Dict[str, Any]] = None
    ) -> Optional[Patient]:
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            return None

        update_data = payload.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if hasattr(patient, key) and value is not None:
                setattr(patient, key, value)

        db.commit()
        db.refresh(patient)

        # Audit log
        AuditService.log_action(
            db=db,
            action="PATIENT_UPDATED",
            resource_type="patient",
            resource_id=patient.id,
            user_id=current_user.get("sub") if current_user else None,
            user_email=current_user.get("email") if current_user else None,
            details=f"Updated patient {patient.name} ({patient.hospital_patient_id})"
        )

        return patient
