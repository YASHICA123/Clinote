class TimelineGraph:
    @staticmethod
    def run(patient_id: str, event_data: dict):
        return {
            "patientId": patient_id,
            "event": event_data,
            "status": "Integrated"
        }
