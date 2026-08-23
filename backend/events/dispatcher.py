from typing import Callable, Dict, List, Any
from backend.config.logging import api_logger

class EventDispatcher:
    _listeners: Dict[str, List[Callable[[Any], None]]] = {}

    @classmethod
    def subscribe(cls, event_type: str, listener: Callable[[Any], None]):
        if event_type not in cls._listeners:
            cls._listeners[event_type] = []
        cls._listeners[event_type].append(listener)

    @classmethod
    def publish(cls, event_type: str, data: Any):
        api_logger.info(f"Publishing Event: {event_type}")
        listeners = cls._listeners.get(event_type, [])
        for listener in listeners:
            try:
                listener(data)
            except Exception as e:
                api_logger.error(f"Error executing listener for {event_type}: {str(e)}")

# Define event type constants
class ClinicalEvents:
    # Patients
    PATIENT_ADMITTED = "patient.admitted"
    PATIENT_DISCHARGED = "patient.discharged"
    PATIENT_CREATED = "patient.created"
    PATIENT_UPDATED = "patient.updated"
    PATIENT_DELETED = "patient.deleted"
    
    # Medications
    MEDICATION_PRESCRIBED = "medication.prescribed"
    MEDICATION_STOPPED = "medication.stopped"
    MEDICATION_CREATED = "medication.created"
    MEDICATION_UPDATED = "medication.updated"
    MEDICATION_DELETED = "medication.deleted"
    
    # Reports & Files
    REPORT_UPLOADED = "report.uploaded"
    REPORT_DELETED = "report.deleted"
    FILE_UPLOADED = "file.uploaded"
    
    # Clinical Data
    NOTE_CREATED = "note.created"
    NOTE_UPDATED = "note.updated"
    NOTE_DELETED = "note.deleted"
    
    CONSULTATION_CREATED = "consultation.created"
    CONSULTATION_DELETED = "consultation.deleted"
    
    INVESTIGATION_CREATED = "investigation.created"
    INVESTIGATION_UPDATED = "investigation.updated"
    INVESTIGATION_DELETED = "investigation.deleted"
    
    PROCEDURE_CREATED = "procedure.created"
    PROCEDURE_DELETED = "procedure.deleted"
    
    DISCHARGE_CREATED = "discharge.created"
