from typing import List, Optional, Dict, Any
from backend.repositories.medication_repository import MedicationRepository
from backend.validators.medication_validator import MedicationValidator
from backend.events.dispatcher import EventDispatcher
from datetime import datetime

class MedicationService:
    @staticmethod
    def get_medications(patient_id: str) -> List[Dict[str, Any]]:
        return MedicationRepository.get_by_patient_id(patient_id)

    @staticmethod
    def prescribe_medication(medication_data: Dict[str, Any]) -> Dict[str, Any]:
        validated = MedicationValidator.validate_and_clean(medication_data)
        validated["startDate"] = datetime.now().strftime("%d %b %Y")
        record = MedicationRepository.create(validated)
        
        # Trigger Event
        from backend.events.dispatcher import EventDispatcher, ClinicalEvents
        EventDispatcher.publish(ClinicalEvents.MEDICATION_PRESCRIBED, record)
        EventDispatcher.publish("medication.created", record)
        
        return record

    @staticmethod
    def update_medication(medication_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        validated = MedicationValidator.validate_and_clean(updates)
        record = MedicationRepository.update(medication_id, validated)
        if record:
            EventDispatcher.publish("medication.updated", record)
        return record

    @staticmethod
    def delete_medication(medication_id: str) -> bool:
        record = MedicationRepository.get_by_id(medication_id)
        if not record:
            return False
        success = MedicationRepository.delete(medication_id)
        if success:
            EventDispatcher.publish("medication.deleted", record)
        return success
