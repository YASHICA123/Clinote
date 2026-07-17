from typing import Dict, Any
from backend.graphs.admission_graph import AdmissionGraph
from backend.graphs.voice_graph import VoiceGraph
from backend.graphs.report_graph import ReportGraph
from backend.graphs.discharge_graph import DischargeGraph

class WorkflowEngine:
    @staticmethod
    def execute_admission_pipeline(patient_id: str, image_url: str) -> Dict[str, Any]:
        # Orchestrate execution via admission graphs
        return AdmissionGraph.run(patient_id, image_url)

    @staticmethod
    def execute_voice_pipeline(audio_path: str) -> Dict[str, Any]:
        return VoiceGraph.run(audio_path)

    @staticmethod
    def execute_report_pipeline(patient_id: str, file_path: str) -> Dict[str, Any]:
        return ReportGraph.run(patient_id, file_path)

    @staticmethod
    def execute_discharge_pipeline(patient_id: str) -> Dict[str, Any]:
        return DischargeGraph.run(patient_id)
