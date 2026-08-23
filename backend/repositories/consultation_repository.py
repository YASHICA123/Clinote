from typing import List, Dict, Any, Optional
from backend.database.supabase import supabase
from backend.repositories.patient_repository import get_uuid
import uuid

class ConsultationRepository:
    @classmethod
    def get_by_patient_id(cls, patient_id: str) -> List[Dict[str, Any]]:
        db_uuid = get_uuid(patient_id)
        res = supabase.table("consultations").select("*").eq("patient_id", db_uuid).execute()
        return res.data

    @classmethod
    def create(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        consultation_id = data.get("consultation_id", str(uuid.uuid4()))
        patient_uuid = get_uuid(data.get("patient_id", ""))
        
        db_data = {
            "consultation_id": consultation_id,
            "patient_id": patient_uuid,
            "consultant": data.get("consultant"),
            "department": data.get("department"),
            "summary": data.get("summary", "")
        }
        res = supabase.table("consultations").insert(db_data).execute()
        return res.data[0] if res.data else data

    @classmethod
    def delete(cls, consultation_id: str) -> bool:
        res = supabase.table("consultations").delete().eq("consultation_id", consultation_id).execute()
        return len(res.data) > 0
