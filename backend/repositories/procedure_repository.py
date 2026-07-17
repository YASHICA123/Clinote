from typing import List, Dict, Any, Optional
from backend.database.supabase import supabase
from backend.repositories.patient_repository import get_uuid
import uuid

class ProcedureRepository:
    @classmethod
    def get_by_patient_id(cls, patient_id: str) -> List[Dict[str, Any]]:
        db_uuid = get_uuid(patient_id)
        res = supabase.table("procedures").select("*").eq("patient_id", db_uuid).execute()
        return res.data

    @classmethod
    def create(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        procedure_id = data.get("procedure_id", str(uuid.uuid4()))
        patient_uuid = get_uuid(data.get("patient_id", ""))
        
        db_data = {
            "procedure_id": procedure_id,
            "patient_id": patient_uuid,
            "procedure_name": data.get("procedure_name"),
            "performed_by": data.get("performed_by", ""),
            "performed_at": data.get("performed_at"),
            "summary": data.get("summary", "")
        }
        res = supabase.table("procedures").insert(db_data).execute()
        return res.data[0] if res.data else data

    @classmethod
    def delete(cls, procedure_id: str) -> bool:
        res = supabase.table("procedures").delete().eq("procedure_id", procedure_id).execute()
        return len(res.data) > 0
