import os
from typing import Dict, Any

class AdmissionExtractor:
    @staticmethod
    def extract_from_image(image_path: str) -> Dict[str, Any]:
        # Read the prompt file
        prompt_path = os.path.join("backend", "prompts", "admission.md")
        if os.path.exists(prompt_path):
            with open(prompt_path, "r", encoding="utf-8") as f:
                prompt_content = f.read()
        else:
            prompt_content = ""
            
        # Simulating extraction results (Mock AI output)
        return {
            "patient_name": "Rajinder N. Sharma",
            "age": 81,
            "gender": "M",
            "admission_date": "24 May 2026, 10:30 AM",
            "diagnoses": ["Chronic Obstructive Pulmonary Disease (COPD) Exacerbation", "Type II Respiratory Failure"],
            "history": ["Known smoker (40 pack-years)", "Hypertension for 15 years"],
            "medications": ["Symbicort 2 puffs BID", "Spiriva 18 mcg OD"]
        }
    
    @staticmethod
    def extract_from_patient(patient_data: Dict[str, Any]) -> Dict[str, Any]:
        # Read the prompt file
        prompt_path = os.path.join("backend", "prompts", "admission.md")
        if os.path.exists(prompt_path):
            with open(prompt_path, "r", encoding="utf-8") as f:
                prompt_content = f.read()
                
        return {
            "patient_name": patient_data.get("name", "Unknown"),
            "age": patient_data.get("age", 0),
            "gender": patient_data.get("gender", "M"),
            "admission_date": patient_data.get("admissionDate", "Unknown"),
            "diagnoses": patient_data.get("diagnoses", []),
            "history": ["Clinical history summary extracted from records."],
            "medications": []
        }
