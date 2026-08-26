from fastapi import APIRouter, HTTPException, status, Depends, Query, UploadFile, File
from typing import Optional
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.models import Patient, Encounter, AuditLog
from backend.schemas.patient import PatientCreate, PatientUpdate, PatientConfirmRequest
from backend.schemas.encounter import EncounterCreate
from backend.services.patient_service import PatientService
from backend.services.encounter_service import EncounterService
from backend.services.timeline_service import TimelineService
from backend.services.document_service import DocumentService
from backend.services.admission_report_service import AdmissionReportService
from backend.middleware.auth import get_current_user_profile, require_permission
from backend.utils.responses import standard_response
from datetime import datetime

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("")
def get_patients(
    search: Optional[str] = Query(None, description="Search by name, MRN, or department"),
    hospital_patient_id: Optional[str] = Query(None, description="Filter by Hospital Patient ID / MRN"),
    current_user: dict = Depends(get_current_user_profile),
    db: Session = Depends(get_db)
):
    data = PatientService.get_patients(db, search=search, hospital_patient_id=hospital_patient_id)
    return standard_response(True, "Patients fetched successfully", data)

@router.post("", status_code=status.HTTP_201_CREATED)
def create_patient(
    payload: PatientCreate,
    current_user: dict = Depends(require_permission("edit_patient")),
    db: Session = Depends(get_db)
):
    try:
        patient = PatientService.create_patient(db, payload, current_user=current_user)
        return standard_response(True, "Patient created successfully", {
            "id": patient.id,
            "hospital_patient_id": patient.hospital_patient_id,
            "name": patient.name,
            "date_of_birth": patient.date_of_birth,
            "gender": patient.gender,
            "age": patient.age,
            "status": patient.status,
            "department": patient.department,
            "bed_number": patient.bed_number,
            "consultant": patient.consultant,
            "created_at": patient.created_at.isoformat()
        })
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# ----------------------------------------------------------------------------------
# Phase 1 Admission Report OCR & Confirmation Workflow
# ----------------------------------------------------------------------------------

@router.post("/admission-report/process")
async def process_admission_report(
    file: UploadFile = File(...),
    current_user: dict = Depends(require_permission("edit_patient")),
    db: Session = Depends(get_db)
):
    """
    Receives an admission report file (PDF, JPG, JPEG, PNG, WEBP), performs text extraction / OCR,
    and returns editable structured patient and admission information.
    """
    allowed_extensions = (".pdf", ".docx", ".doc", ".jpg", ".jpeg", ".png", ".webp", ".txt")
    filename = file.filename or "admission_report.pdf"
    lower_name = filename.lower()

    if not any(lower_name.endswith(ext) for ext in allowed_extensions):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{filename}'. Allowed formats: PDF, DOCX, DOC, JPG, JPEG, PNG, WEBP."
        )

    try:
        file_bytes = await file.read()
        if len(file_bytes) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty."
            )

        result = AdmissionReportService.process_admission_file(filename, file_bytes)
        return standard_response(True, "Admission report processed successfully", result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process admission report: {str(e)}"
        )

@router.post("/confirm", status_code=status.HTTP_201_CREATED)
def confirm_patient_creation(
    request: PatientConfirmRequest,
    current_user: dict = Depends(require_permission("edit_patient")),
    db: Session = Depends(get_db)
):
    """
    Confirms extracted & edited patient data:
    1. Validates required fields
    2. Performs duplicate check on UHID / MRN
    3. If duplicate, returns duplicate status and existing patient record
    4. If new, creates Patient + initial Encounter + AuditLog
    """
    p_data = request.patient_data
    full_name = p_data.full_name.strip() if p_data.full_name else ""
    if not full_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Patient Full Name is required."
        )

    uhid = p_data.uhid.strip() if p_data.uhid else None

    # Duplicate check by UHID / MRN if provided
    if uhid:
        existing = db.query(Patient).filter(Patient.hospital_patient_id.ilike(uhid)).first()
        if existing:
            return {
                "success": False,
                "status": "duplicate",
                "message": "A patient with this UHID/MRN already exists.",
                "existing_patient_id": existing.id,
                "existing_patient": {
                    "id": existing.id,
                    "name": existing.name,
                    "hospital_patient_id": existing.hospital_patient_id,
                    "gender": existing.gender,
                    "age": existing.age,
                    "department": existing.department,
                    "status": existing.status,
                    "consultant": existing.consultant
                }
            }

    # If UHID is blank, auto-generate one
    if not uhid:
        count = db.query(Patient).count() + 1001
        uhid = f"MRN-{count}"

    # Create Patient Record
    new_patient = Patient(
        hospital_patient_id=uhid,
        name=full_name,
        date_of_birth=p_data.date_of_birth,
        gender=p_data.gender or "male",
        age=p_data.age,
        status="ACTIVE",
        department=p_data.department or "General Medicine",
        bed_number=p_data.ward,
        consultant=p_data.consultant or "Dr. Deepak Bhasin",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(new_patient)
    db.flush()

    # Create Initial Encounter
    encounter = Encounter(
        patient_id=new_patient.id,
        doctor_id=current_user.get("user_id"),
        doctor_name=p_data.consultant or current_user.get("name", "Dr. Deepak Bhasin"),
        department=p_data.department or "General Medicine",
        admission_date=datetime.utcnow(),
        status="ACTIVE",
        admission_notes=f"Admission report processed. Ward: {p_data.ward or 'General'}. Hospital: {p_data.hospital or 'Clinote'}.",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(encounter)
    db.flush()

    # Log Audit Record
    audit_entry = AuditLog(
        user_id=current_user.get("user_id"),
        user_email=current_user.get("email"),
        action="PATIENT_CREATED_FROM_REPORT",
        resource_type="patient",
        resource_id=new_patient.id,
        details=f"Created patient {new_patient.name} ({new_patient.hospital_patient_id}) via Admission Report upload",
        created_at=datetime.utcnow()
    )
    db.add(audit_entry)
    db.commit()
    db.refresh(new_patient)

    return {
        "success": True,
        "status": "success",
        "patient_id": new_patient.id,
        "encounter_id": encounter.id,
        "patient": {
            "id": new_patient.id,
            "hospital_patient_id": new_patient.hospital_patient_id,
            "name": new_patient.name,
            "gender": new_patient.gender,
            "age": new_patient.age,
            "department": new_patient.department,
            "bed_number": new_patient.bed_number,
            "status": new_patient.status
        }
    }

# ----------------------------------------------------------------------------------

@router.get("/{patient_id}")
def get_patient(
    patient_id: str,
    current_user: dict = Depends(get_current_user_profile),
    db: Session = Depends(get_db)
):
    patient = PatientService.get_patient_by_id(db, patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    return standard_response(True, "Patient retrieved successfully", patient)

@router.patch("/{patient_id}")
def update_patient(
    patient_id: str,
    payload: PatientUpdate,
    current_user: dict = Depends(require_permission("edit_patient")),
    db: Session = Depends(get_db)
):
    patient = PatientService.update_patient(db, patient_id, payload, current_user=current_user)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    return standard_response(True, "Patient updated successfully", {
        "id": patient.id,
        "hospital_patient_id": patient.hospital_patient_id,
        "name": patient.name,
        "date_of_birth": patient.date_of_birth,
        "gender": patient.gender,
        "age": patient.age,
        "status": patient.status,
        "department": patient.department,
        "bed_number": patient.bed_number,
        "consultant": patient.consultant,
        "updated_at": patient.updated_at.isoformat()
    })

# Section 5.3: Patient Encounter Routes
@router.post("/{patient_id}/encounters", status_code=status.HTTP_201_CREATED)
def create_patient_encounter(
    patient_id: str,
    payload: EncounterCreate,
    current_user: dict = Depends(require_permission("create_encounter")),
    db: Session = Depends(get_db)
):
    try:
        encounter = EncounterService.create_encounter(db, patient_id, payload, current_user=current_user)
        return standard_response(True, "Encounter created successfully", {
            "id": encounter.id,
            "patient_id": encounter.patient_id,
            "doctor_id": encounter.doctor_id,
            "doctor_name": encounter.doctor_name,
            "department": encounter.department,
            "admission_date": encounter.admission_date.isoformat(),
            "status": encounter.status,
            "admission_notes": encounter.admission_notes
        })
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.get("/{patient_id}/encounters")
def get_patient_encounters(
    patient_id: str,
    current_user: dict = Depends(get_current_user_profile),
    db: Session = Depends(get_db)
):
    encounters = EncounterService.get_encounters_by_patient(db, patient_id)
    result = [{
        "id": e.id,
        "patient_id": e.patient_id,
        "doctor_id": e.doctor_id,
        "doctor_name": e.doctor_name,
        "department": e.department,
        "admission_date": e.admission_date.isoformat(),
        "discharge_date": e.discharge_date.isoformat() if e.discharge_date else None,
        "status": e.status,
        "admission_notes": e.admission_notes
    } for e in encounters]
    return standard_response(True, "Patient encounters retrieved successfully", result)

# Section 5.5: Patient Timeline Route
@router.get("/{patient_id}/timeline")
def get_patient_timeline(
    patient_id: str,
    encounter_id: Optional[str] = Query(None),
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
    order: str = Query("asc", description="Chronological sorting: asc or desc"),
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
    return standard_response(True, "Timeline retrieved successfully", data)

# Section 5.6: Patient Documents Route
@router.get("/{patient_id}/documents")
def get_patient_documents(
    patient_id: str,
    current_user: dict = Depends(get_current_user_profile),
    db: Session = Depends(get_db)
):
    docs = DocumentService.get_documents_by_patient(db, patient_id)
    result = [{
        "id": d.id,
        "patient_id": d.patient_id,
        "encounter_id": d.encounter_id,
        "document_type": d.document_type,
        "title": d.title,
        "content": d.content,
        "status": d.status,
        "created_by": d.created_by,
        "finalized_at": d.finalized_at.isoformat() if d.finalized_at else None,
        "finalized_by": d.finalized_by,
        "created_at": d.created_at.isoformat(),
        "updated_at": d.updated_at.isoformat()
    } for d in docs]
    return standard_response(True, "Patient documents retrieved successfully", result)
