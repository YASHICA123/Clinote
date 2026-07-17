from typing import Dict, Any
from backend.orchestrator.workflow_engine import WorkflowEngine

class OrchestratorRouter:
    @staticmethod
    def route_document(patient_id: str, file_name: str, file_path: str) -> Dict[str, Any]:
        file_lower = file_name.lower()
        if "admission" in file_lower:
            return WorkflowEngine.execute_admission_pipeline(patient_id, file_path)
        elif "voice" in file_lower or file_lower.endswith((".wav", ".mp3", ".m4a")):
            return WorkflowEngine.execute_voice_pipeline(file_path)
        else:
            return WorkflowEngine.execute_report_pipeline(patient_id, file_path)
