from typing import List, Dict, Any
from backend.repositories.procedure_repository import ProcedureRepository
from backend.events.dispatcher import EventDispatcher

class ProcedureService:
    @staticmethod
    def get_procedures(patient_id: str) -> List[Dict[str, Any]]:
        return ProcedureRepository.get_by_patient_id(patient_id)

    @staticmethod
    def record_procedure(data: Dict[str, Any]) -> Dict[str, Any]:
        record = ProcedureRepository.create(data)
        
        # Publish event
        EventDispatcher.publish("procedure.created", record)
        return record

    @staticmethod
    def delete_procedure(procedure_id: str) -> bool:
        success = ProcedureRepository.delete(procedure_id)
        return success
