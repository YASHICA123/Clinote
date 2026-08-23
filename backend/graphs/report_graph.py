class ReportGraph:
    @staticmethod
    def run(patient_id: str, file_path: str):
        return {
            "patientId": patient_id,
            "status": "Processed",
            "findings": "Bilateral emphysematous changes and bronchial wall thickening."
        }
