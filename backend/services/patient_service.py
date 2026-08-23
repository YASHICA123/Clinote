from typing import List, Optional, Dict, Any
from backend.repositories.patient_repository import PatientRepository
from backend.validators.patient_validator import PatientValidator
from backend.events.dispatcher import EventDispatcher, ClinicalEvents
from datetime import datetime

class PatientService:
    @staticmethod
    def get_active_patients() -> List[Dict[str, Any]]:
        return PatientRepository.get_all_active()

    @staticmethod
    def get_patient(patient_id: str) -> Optional[Dict[str, Any]]:
        return PatientRepository.get_by_id(patient_id)

    @staticmethod
    def admit_patient(patient_data: Dict[str, Any]) -> Dict[str, Any]:
        # Validate & clean input
        validated = PatientValidator.validate_and_clean(patient_data)
        
        # Add metadata
        validated["admissionDate"] = datetime.now().strftime("%d %b %Y, %I:%M %p")
        
        # Save
        record = PatientRepository.create(validated)
        
        # Trigger Event
        EventDispatcher.publish(ClinicalEvents.PATIENT_ADMITTED, record)
        EventDispatcher.publish("patient.created", record)
        
        return record

    @staticmethod
    def update_patient(patient_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        # Validate & clean updates
        validated_updates = PatientValidator.validate_and_clean(updates)
        record = PatientRepository.update(patient_id, validated_updates)
        if record:
            EventDispatcher.publish("patient.updated", record)
        return record

    @staticmethod
    def delete_patient(patient_id: str) -> bool:
        record = PatientRepository.get_by_id(patient_id)
        if not record:
            return False
        success = PatientRepository.delete(patient_id)
        if success:
            EventDispatcher.publish("patient.deleted", record)
        return success
