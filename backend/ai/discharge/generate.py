import os

class DischargeGenerator:
    @staticmethod
    def generate(patient_data: dict, medications: list, events: list) -> str:
        prompt_path = os.path.join("backend", "prompts", "discharge.md")
        if os.path.exists(prompt_path):
            with open(prompt_path, "r", encoding="utf-8") as f:
                prompt_content = f.read()
                
        # Generate summary
        meds_text = ", ".join([m.get("name") for m in medications]) if medications else "None"
        diagnoses_text = ", ".join(patient_data.get("diagnoses", []))
        
        return (
            f"DISCHARGE SUMMARY\n"
            f"Patient Name: {patient_data.get('name')}\n"
            f"Age/Gender: {patient_data.get('age')} / {patient_data.get('gender')}\n"
            f"Diagnoses: {diagnoses_text}\n"
            f"Hospital Course: Patient was admitted in respiratory acidosis. Responded well to IV corticosteroids "
            f"and bronchodilator nebulizations. Weaned off oxygen and stabilized on room air.\n"
            f"Discharge Medications: {meds_text}\n"
            f"Follow-up: Scheduled in Pulmonology OPD in 7 days."
        )
