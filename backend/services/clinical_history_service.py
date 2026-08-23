from typing import List, Dict, Any, Optional
from backend.repositories.clinical_history_repository import ClinicalHistoryRepository
from backend.events.dispatcher import EventDispatcher

class ClinicalHistoryService:
    @staticmethod
    def get_history(patient_id: str) -> List[Dict[str, Any]]:
        return ClinicalHistoryRepository.get_by_patient_id(patient_id)

    @staticmethod
    def create_history(data: Dict[str, Any]) -> Dict[str, Any]:
        record = ClinicalHistoryRepository.create(data)
        EventDispatcher.publish("patient.updated", record)
        return record

    @staticmethod
    def update_history(history_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        record = ClinicalHistoryRepository.update(history_id, updates)
        if record:
            EventDispatcher.publish("patient.updated", record)
        return record

    @staticmethod
    def delete_history(history_id: str) -> bool:
        record = ClinicalHistoryRepository.get_by_id(history_id)
        if not record:
            return False
        success = ClinicalHistoryRepository.delete(history_id)
        if success:
            EventDispatcher.publish("patient.updated", {"patient_id": record.get("patient_id"), "history_deleted": True})
        return success
