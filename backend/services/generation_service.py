from typing import Dict, Any
from backend.ai.course.generate import CourseGenerator
from backend.ai.discharge.generate import DischargeGenerator
from backend.repositories.patient_repository import PatientRepository
from backend.repositories.medication_repository import MedicationRepository
from backend.repositories.timeline_repository import TimelineRepository
from datetime import datetime

class GenerationService:
    @staticmethod
    def generate_clinical_course(patient_id: str, clinical_notes: str) -> Dict[str, Any]:
        patient = PatientRepository.get_by_id(patient_id)
        patient_name = patient.get("name", "Unknown Patient") if patient else "Unknown Patient"
        course_text = CourseGenerator.generate(patient_name, clinical_notes)
        return {
            "patient_id": patient_id,
            "generated_text": course_text,
            "summary_type": "Course",
            "timestamp": datetime.now().isoformat()
        }

    @staticmethod
    def generate_discharge_summary(patient_id: str) -> Dict[str, Any]:
        patient = PatientRepository.get_by_id(patient_id)
        if not patient:
            return {
                "patient_id": patient_id,
                "generated_text": "Patient record not found.",
                "summary_type": "Discharge",
                "timestamp": datetime.now().isoformat()
            }
        meds = MedicationRepository.get_by_patient_id(patient_id)
        events = TimelineRepository.get_by_patient_id(patient_id)
        discharge_text = DischargeGenerator.generate(patient, meds, events)
        return {
            "patient_id": patient_id,
            "generated_text": discharge_text,
            "summary_type": "Discharge",
            "timestamp": datetime.now().isoformat()
        }

    @staticmethod
    def generate_teleconsult_report(patient_id: str, transcript: str) -> Dict[str, Any]:
        # Simple simulated teleconsult summaries
        report_text = (
            f"TELECONSULTATION REPORT\n"
            f"Transcript Summary: {transcript[:200]}...\n"
            f"Recommendations: Continue active medication plans and monitor vitals."
        )
        return {
            "patient_id": patient_id,
            "generated_text": report_text,
            "summary_type": "Teleconsult",
            "timestamp": datetime.now().isoformat()
        }

    @staticmethod
    def generate_general_summary(patient_id: str) -> Dict[str, Any]:
        patient = PatientRepository.get_by_id(patient_id)
        diagnoses_text = ", ".join(patient.get("diagnoses", [])) if patient else "None"
        summary_text = f"Patient clinical overview showing primary diagnoses: {diagnoses_text}. Currently stable."
        return {
            "patient_id": patient_id,
            "generated_text": summary_text,
            "summary_type": "Summary",
            "timestamp": datetime.now().isoformat()
        }
