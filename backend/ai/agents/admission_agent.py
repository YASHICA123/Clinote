import os
from backend.ai.extractors.ocr import OCRExtractor

class AdmissionAgent:
    @staticmethod
    def process_admission(image_url: str) -> dict:
        # Load the prompt from versioned path
        prompt_path = os.path.join("backend", "prompts", "v1", "admission.md")
        prompt_content = ""
        if os.path.exists(prompt_path):
            with open(prompt_path, "r", encoding="utf-8") as f:
                prompt_content = f.read()
                
        # Perform OCR
        raw_text = OCRExtractor.scan_image(image_url)
        
        # Simulate LLM structured extraction based on prompt
        return {
            "patient_name": "Roshan Lal Thakur",
            "age": 68,
            "gender": "M",
            "admission_date": "10 May 2026, 09:15 AM",
            "diagnoses": ["Chronic Obstructive Pulmonary Disease (COPD) Exacerbation"],
            "vitals": { "hr": 88, "bp": "132/84", "rr": 20, "spo2": 92, "temp": "98.8 °F" }
        }
