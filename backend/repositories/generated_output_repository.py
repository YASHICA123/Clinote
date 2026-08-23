from typing import List, Dict, Any, Optional
from backend.database.supabase import supabase
from backend.repositories.patient_repository import get_uuid
import uuid

class GeneratedOutputRepository:
    @classmethod
    def get_by_patient_id(cls, patient_id: str) -> List[Dict[str, Any]]:
        db_uuid = get_uuid(patient_id)
        res = supabase.table("generated_outputs").select("*").eq("patient_id", db_uuid).execute()
        return res.data

    @classmethod
    def create(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        output_id = data.get("output_id", str(uuid.uuid4()))
        patient_uuid = get_uuid(data.get("patient_id", ""))
        
        db_data = {
            "output_id": output_id,
            "patient_id": patient_uuid,
            "summary_type": data.get("summary_type"),
            "generated_text": data.get("generated_text")
        }
        res = supabase.table("generated_outputs").insert(db_data).execute()
        return res.data[0] if res.data else data
