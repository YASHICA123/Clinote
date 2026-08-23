from typing import Dict, Any, TypedDict
from backend.ai.extractors.ocr import OCRExtractor
from backend.ai.agents.admission_agent import AdmissionAgent
from backend.validators.patient_validator import PatientValidator
from backend.repositories.patient_repository import PatientRepository
from backend.repositories.clinical_history_repository import ClinicalHistoryRepository
from backend.events.dispatcher import EventDispatcher, ClinicalEvents
import logging

class AdmissionState(TypedDict):
    patient_id: str
    image_url: str
    raw_ocr: str
    extracted_data: Dict[str, Any]
    validation_passed: bool
    final_patient_record: Dict[str, Any]

class AdmissionGraph:
    @staticmethod
    def run(patient_id: str, image_url: str) -> Dict[str, Any]:
        # Initialize state
        state: AdmissionState = {
            "patient_id": patient_id,
            "image_url": image_url,
            "raw_ocr": "",
            "extracted_data": {},
            "validation_passed": False,
            "final_patient_record": {}
        }
        
        # Step 1: OCR scan
        state["raw_ocr"] = OCRExtractor.scan_image(image_url)
        
        # Step 2: Extraction Agent
        state["extracted_data"] = AdmissionAgent.process_admission(image_url)
        
        # Step 3: Validate & clean
        state["extracted_data"] = PatientValidator.validate_and_clean(state["extracted_data"])
        state["validation_passed"] = True
        
        # Step 4: Save to clinical_history table
        history_record = {
            "patient_id": patient_id,
            "diagnoses": state["extracted_data"].get("diagnoses", []),
            "history": ["Emergency clinical history elements extracted."],
            "medications": state["extracted_data"].get("medications", []),
            "raw_ocr_text": state["raw_ocr"],
            "image_path": image_url
        }
        ClinicalHistoryRepository.create(history_record)
        
        # Step 5: Create or Update patient_master
        existing_patient = PatientRepository.get_by_id(patient_id)
        
        patient_data = {
            "id": patient_id,
            "name": state["extracted_data"].get("patient_name", "Unknown"),
            "age": state["extracted_data"].get("age", 0),
            "gender": state["extracted_data"].get("gender", "M"),
            "bedNumber": "11", # Assign default bed
            "status": "ICU",
            "diagnoses": state["extracted_data"].get("diagnoses", []),
            "vitals": state["extracted_data"].get("vitals", { "hr": 88, "bp": "120/80", "rr": 20, "spo2": 95, "temp": "98.6" })
        }
        
        if existing_patient:
            # Update existing
            state["final_patient_record"] = PatientRepository.update(patient_id, patient_data)
        else:
            # Create new
            state["final_patient_record"] = PatientRepository.create(patient_data)
            # Dispatch event to create timeline and trigger audit logging
            EventDispatcher.publish(ClinicalEvents.PATIENT_ADMITTED, state["final_patient_record"])
            
        return state["final_patient_record"]
