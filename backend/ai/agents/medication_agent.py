import os

class MedicationAgent:
    @staticmethod
    def extract_medications(prescription_text: str) -> list[dict]:
        prompt_path = os.path.join("backend", "prompts", "v1", "medication.md")
        # Load prompt and simulate output
        return [
            {
                "name": "Budesonide + Formoterol Inhaler (Symbicort)",
                "dosage": "200 mcg / 6 mcg",
                "frequency": "2 puffs BID",
                "route": "Inhalation",
                "status": "Active"
            }
        ]
