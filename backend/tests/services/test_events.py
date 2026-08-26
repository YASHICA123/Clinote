from backend.database.session import SessionLocal, init_db
from backend.services.patient_service import PatientService
from backend.schemas.patient import PatientCreate
from backend.models import Patient

def test_patient_admitted_triggers_timeline_event():
    init_db()
    db = SessionLocal()
    
    patient_data = PatientCreate(
        name="Event Test Patient",
        age=55,
        gender="female",
        bed_number="99",
        status="ICU",
        consultant="Dr. Deepak Bhasin",
        department="Pulmonology"
    )
    
    # Create patient
    user_context = {"user_id": "test-doc-1", "email": "doctor@clinote.ai", "name": "Dr. Deepak Bhasin", "role": "DOCTOR"}
    record = PatientService.create_patient(db, patient_data, current_user=user_context)
    
    assert record.id is not None
    assert record.name == "Event Test Patient"
    assert record.hospital_patient_id is not None
    db.close()
