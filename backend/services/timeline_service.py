from typing import List, Dict, Any
from backend.repositories.timeline_repository import TimelineRepository
from backend.validators.timeline_validator import TimelineValidator

class TimelineService:
    @staticmethod
    def get_timeline(patient_id: str) -> List[Dict[str, Any]]:
        return TimelineRepository.get_by_patient_id(patient_id)

    @staticmethod
    def add_event(event_data: Dict[str, Any]) -> Dict[str, Any]:
        validated = TimelineValidator.validate_and_clean(event_data)
        return TimelineRepository.create_event(validated)
