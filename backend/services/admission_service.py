from typing import Dict, Any
from backend.graphs.admission_graph import AdmissionGraph
from backend.repositories.patient_repository import PatientRepository

class AdmissionService:
    @staticmethod
    def upload_sheet(file_name: str, file_content: bytes) -> Dict[str, str]:
        from backend.storage.storage_service import StorageService
        public_url = StorageService.save_file("admissions", file_name, file_content)
        return {"file_path": public_url, "status": "Saved"}

    @staticmethod
    def extract_admission_data(patient_id: str, image_url: str) -> Dict[str, Any]:
        # Orchestrate execution via LangGraph workflow
        return AdmissionGraph.run(patient_id, image_url)
        
    @staticmethod
    def get_admission_details(patient_id: str) -> Dict[str, Any]:
        patient = PatientRepository.get_by_id(patient_id)
        if not patient:
            return {}
        return {
            "patient_id": patient_id,
            "patient_name": patient.get("name"),
            "age": patient.get("age"),
            "gender": patient.get("gender"),
            "diagnoses": patient.get("diagnoses", []),
            "vitals": patient.get("vitals", {})
        }
