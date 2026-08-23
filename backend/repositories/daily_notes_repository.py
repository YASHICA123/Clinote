from typing import List, Dict, Any, Optional
from backend.database.supabase import supabase
from backend.repositories.patient_repository import get_uuid
import uuid

class DailyNotesRepository:
    @classmethod
    def get_by_patient_id(cls, patient_id: str) -> List[Dict[str, Any]]:
        db_uuid = get_uuid(patient_id)
        res = supabase.table("daily_notes").select("*").eq("patient_id", db_uuid).order("created_at", desc=True).execute()
        return res.data

    @classmethod
    def get_by_id(cls, note_id: str) -> Optional[Dict[str, Any]]:
        res = supabase.table("daily_notes").select("*").eq("note_id", note_id).execute()
        return res.data[0] if res.data else None

    @classmethod
    def create(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        note_id = data.get("note_id", str(uuid.uuid4()))
        patient_uuid = get_uuid(data.get("patient_id", ""))
        
        db_data = {
            "note_id": note_id,
            "patient_id": patient_uuid,
            "note_text": data.get("note_text"),
            "created_by": data.get("created_by", "Staff")
        }
        res = supabase.table("daily_notes").insert(db_data).execute()
        return res.data[0] if res.data else data

    @classmethod
    def update(cls, note_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        db_data = {}
        if "note_text" in updates:
            db_data["note_text"] = updates["note_text"]
        db_data["updated_at"] = "now()"
        
        res = supabase.table("daily_notes").update(db_data).eq("note_id", note_id).execute()
        return res.data[0] if res.data else None

    @classmethod
    def delete(cls, note_id: str) -> bool:
        res = supabase.table("daily_notes").delete().eq("note_id", note_id).execute()
        return len(res.data) > 0
