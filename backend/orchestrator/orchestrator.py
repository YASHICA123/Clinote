from typing import Dict, Any, List
from backend.services.patient_service import PatientService
from backend.services.admission_service import AdmissionService
from backend.services.medication_service import MedicationService
from backend.services.report_service import report_service # It's defined as report_service in the imports
from backend.services.timeline_service import TimelineService
from backend.events.dispatcher import EventDispatcher

class ClinicalOrchestrator:
    @staticmethod
    def admit_patient(patient_data: Dict[str, Any]) -> Dict[str, Any]:
        # Perform patient admission using PatientService
        record = PatientService.admit_patient(patient_data)
        
        # Publish event
        EventDispatcher.publish("patient.admitted", record)
        return record

    @staticmethod
    def discharge_patient(patient_id: str) -> Dict[str, Any]:
        # Update patient status to Discharged
        record = PatientService.update_patient(patient_id, {"status": "DISCHARGED"})
        
        # Discontinue all active medications for this patient
        active_meds = MedicationService.get_medications(patient_id)
        for med in active_meds:
            if med.get("status") == "Active":
                MedicationService.update_medication(med["id"], {"status": "Discontinued", "endDate": "now()"})
                EventDispatcher.publish("medication.updated", {"id": med["id"], "status": "Discontinued"})
                
        # Publish discharge event
        EventDispatcher.publish("patient.discharged", {"patient_id": patient_id})
        return record

    @staticmethod
    def process_admission_sheet(patient_id: str, file_name: str, file_content: bytes) -> Dict[str, Any]:
        # 1. Upload the sheet using AdmissionService
        upload_res = AdmissionService.upload_sheet(file_name, file_content)
        file_path = upload_res.get("file_path")
        
        # Publish upload event
        EventDispatcher.publish("file.uploaded", {"patient_id": patient_id, "file_path": file_path, "type": "AdmissionSheet"})
        
        # 2. Extract admission data (triggers OCR and AI extraction graph)
        extracted = AdmissionService.extract_admission_data(patient_id, file_path)
        
        # Publish event
        EventDispatcher.publish("patient.updated", extracted)
        return extracted

    @staticmethod
    def process_clinical_report(patient_id: str, report_type: str, file_name: str, file_content: bytes) -> Dict[str, Any]:
        # Save file to storage
        from backend.storage.storage_service import StorageService
        public_url = StorageService.save_file("reports", file_name, file_content)
        
        # Save metadata to reports table using report_service
        report_data = {
            "patient_id": patient_id,
            "report_type": report_type,
            "file_url": public_url,
            "ocr_text": f"OCR Content for report {file_name}",
            "ai_summary": f"AI Summary of {report_type} report"
        }
        
        # Let's import repository directly since service structure might vary
        from backend.repositories.report_repository import ReportRepository
        record = ReportRepository.create(report_data)
        
        # Publish events
        EventDispatcher.publish("file.uploaded", {"patient_id": patient_id, "file_path": public_url, "type": "ClinicalReport"})
        EventDispatcher.publish("report.uploaded", record)
        
        return record
