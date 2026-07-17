from typing import List, Optional, Dict, Any
from backend.repositories.daily_notes_repository import DailyNotesRepository
from backend.events.dispatcher import EventDispatcher

class DailyNotesService:
    @staticmethod
    def get_notes(patient_id: str) -> List[Dict[str, Any]]:
        return DailyNotesRepository.get_by_patient_id(patient_id)

    @staticmethod
    def create_note(data: Dict[str, Any]) -> Dict[str, Any]:
        record = DailyNotesRepository.create(data)
        
        # Publish event
        EventDispatcher.publish("note.created", record)
        return record

    @staticmethod
    def update_note(note_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        record = DailyNotesRepository.update(note_id, updates)
        if record:
            EventDispatcher.publish("note.updated", record)
        return record

    @staticmethod
    def delete_note(note_id: str) -> bool:
        record = DailyNotesRepository.get_by_id(note_id)
        if not record:
            return False
        success = DailyNotesRepository.delete(note_id)
        if success:
            EventDispatcher.publish("note.deleted", record)
        return success
