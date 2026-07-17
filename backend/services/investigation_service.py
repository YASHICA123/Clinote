from typing import List, Dict, Any, Optional
from backend.repositories.investigation_repository import InvestigationRepository
from backend.events.dispatcher import EventDispatcher
from datetime import datetime

class InvestigationService:
    @staticmethod
    def get_investigations(patient_id: str) -> List[Dict[str, Any]]:
        return InvestigationRepository.get_by_patient_id(patient_id)

    @staticmethod
    def create_investigation(data: Dict[str, Any]) -> Dict[str, Any]:
        if "testDate" not in data or not data["testDate"]:
            data["testDate"] = datetime.now().strftime("%d %b %Y, %I:%M %p")
        record = InvestigationRepository.create(data)
        EventDispatcher.publish("investigation.created", record)
        return record

    @staticmethod
    def update_investigation(investigation_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        record = InvestigationRepository.update(investigation_id, updates)
        if record:
            EventDispatcher.publish("investigation.updated", record)
        return record

    @staticmethod
    def delete_investigation(investigation_id: str) -> bool:
        record = InvestigationRepository.get_by_id(investigation_id)
        if not record:
            return False
        success = InvestigationRepository.delete(investigation_id)
        if success:
            EventDispatcher.publish("investigation.deleted", record)
        return success

    @staticmethod
    def upload_report(patient_id: str, file_name: str, file_content: bytes) -> Dict[str, Any]:
        inv_data = {
            "patientId": patient_id,
            "testName": file_name.split(".")[0].replace("_", " ").title(),
            "category": "Imaging" if "ct" in file_name.lower() or "xray" in file_name.lower() else "Lab",
            "result": "Pending review by clinical AI model.",
            "status": "Normal",
            "testDate": datetime.now().strftime("%d %b %Y, %I:%M %p")
        }
        record = InvestigationRepository.create(inv_data)
        EventDispatcher.publish("investigation.created", record)
        return record
