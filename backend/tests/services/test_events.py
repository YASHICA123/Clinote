from backend.services.patient_service import PatientService
from backend.services.medication_service import MedicationService
from backend.repositories.timeline_repository import TimelineRepository
from backend.events.dispatcher import EventDispatcher, ClinicalEvents

def test_patient_admitted_triggers_timeline_event():
    # Force import to ensure listeners are registered
    from backend.events import patient_events
    
    patient_data = {
        "name": "Event Test Patient",
        "age": 55,
        "gender": "F",
        "bedNumber": "99",
        "status": "ICU",
        "consultant": "Dr. Deepak Bhasin",
        "diagnoses": ["Test Diagnosis"]
    }
    
    # Admit patient
    record = PatientService.admit_patient(patient_data)
    patient_id = record["id"]
    
    # Check if a timeline admission event was auto-created for this patient ID
    timeline = TimelineRepository.get_by_patient_id(patient_id)
    assert len(timeline) > 0
    assert timeline[0]["type"] == "admission"
    assert "99" in timeline[0]["subtitle"]
