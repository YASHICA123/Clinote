class DischargeGraph:
    @staticmethod
    def run(patient_id: str):
        return {
            "patientId": patient_id,
            "status": "Drafted",
            "summary": "Discharge summary ready. Patient clinically stable for discharge."
        }
