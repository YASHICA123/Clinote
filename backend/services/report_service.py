from typing import List, Dict, Any, Optional
from backend.repositories.report_repository import ReportRepository
from backend.graphs.report_graph import ReportGraph
from backend.events.dispatcher import EventDispatcher
from datetime import datetime

class ReportService:
    @staticmethod
    def get_reports(patient_id: str) -> List[Dict[str, Any]]:
        return ReportRepository.get_by_patient_id(patient_id)

    @staticmethod
    def upload_report_file(patient_id: str, file_name: str, file_content: bytes) -> Dict[str, Any]:
        # Run report graph
        graph_output = ReportGraph.run(patient_id, file_name)
        
        report_data = {
            "patientId": patient_id,
            "title": file_name.split(".")[0].replace("_", " ").title(),
            "category": "Radiology" if "ct" in file_name.lower() or "xray" in file_name.lower() else "Other",
            "date": datetime.now().strftime("%d %b %Y"),
            "summary": graph_output.get("findings", "Report uploaded and processed."),
            "status": "Final",
            "fileUrl": f"uploads/reports/{file_name}"
        }
        record = ReportRepository.create(report_data)
        
        # Publish event
        EventDispatcher.publish("report.uploaded", record)
        return record

    @staticmethod
    def delete_report(report_id: str) -> bool:
        record = ReportRepository.get_by_id(report_id)
        if not record:
            return False
        success = ReportRepository.delete(report_id)
        if success:
            EventDispatcher.publish("report.deleted", record)
        return success
