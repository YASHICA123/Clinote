from typing import List, Dict, Any
from backend.repositories.consultation_repository import ConsultationRepository
from backend.events.dispatcher import EventDispatcher

class ConsultationService:
    @staticmethod
    def get_consultations(patient_id: str) -> List[Dict[str, Any]]:
        return ConsultationRepository.get_by_patient_id(patient_id)

    @staticmethod
    def request_consultation(data: Dict[str, Any]) -> Dict[str, Any]:
        record = ConsultationRepository.create(data)
        
        # Publish event
        EventDispatcher.publish("consultation.created", record)
        return record

    @staticmethod
    def delete_consultation(consultation_id: str) -> bool:
        success = ConsultationRepository.delete(consultation_id)
        return success
