from typing import List, Dict, Any, Optional
from backend.database.supabase import supabase
from backend.repositories.patient_repository import get_uuid
import uuid

class ClinicalHistoryRepository:

    @classmethod
    def get_by_patient_id(cls, patient_id: str) -> List[Dict[str, Any]]:
        db_uuid = get_uuid(patient_id)
        res = supabase.table("clinical_history").select("*").eq("patient_id", db_uuid).execute()
        return [cls.map_to_frontend(row) for row in res.data]

    @classmethod
    def get_by_id(cls, history_id: str) -> Optional[Dict[str, Any]]:
        res = supabase.table("clinical_history").select("*").eq("history_id", history_id).execute()
        return cls.map_to_frontend(res.data[0]) if res.data else None

    @staticmethod
    def map_to_frontend(row: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "id": str(row.get("history_id")),
            "patient_id": str(row.get("patient_id")),
            "diagnoses": [row.get("working_diagnosis")] if row.get("working_diagnosis") else [],
            "history": [row.get("history_present_illness")] if row.get("history_present_illness") else [],
            "medications": [row.get("drug_history")] if row.get("drug_history") else []
        }

    @classmethod
    def create(cls, history_data: Dict[str, Any]) -> Dict[str, Any]:
        history_data["id"] = history_data.get("id", str(uuid.uuid4()))
        patient_uuid = get_uuid(history_data.get("patient_id", ""))
        
        # Format string joins for list inputs
        diagnoses_str = ", ".join(history_data.get("diagnoses", [])) if isinstance(history_data.get("diagnoses"), list) else str(history_data.get("diagnoses", ""))
        history_str = ", ".join(history_data.get("history", [])) if isinstance(history_data.get("history"), list) else str(history_data.get("history", ""))
        meds_str = ", ".join(history_data.get("medications", [])) if isinstance(history_data.get("medications"), list) else str(history_data.get("medications", ""))
        
        db_data = {
            "history_id": history_data["id"],
            "patient_id": patient_uuid,
            "working_diagnosis": diagnoses_str,
            "history_present_illness": history_str,
            "drug_history": meds_str,
            "chief_complaint": history_str[:100] if history_str else "Admission presentation"
        }
        
        res = supabase.table("clinical_history").insert(db_data).execute()
        return cls.map_to_frontend(res.data[0]) if res.data else history_data

    @classmethod
    def update(cls, history_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        db_updates = {}
        if "diagnoses" in updates:
            db_updates["working_diagnosis"] = ", ".join(updates["diagnoses"]) if isinstance(updates["diagnoses"], list) else str(updates["diagnoses"])
        if "history" in updates:
            db_updates["history_present_illness"] = ", ".join(updates["history"]) if isinstance(updates["history"], list) else str(updates["history"])
        if "medications" in updates:
            db_updates["drug_history"] = ", ".join(updates["medications"]) if isinstance(updates["medications"], list) else str(updates["medications"])
            
        res = supabase.table("clinical_history").update(db_updates).eq("history_id", history_id).execute()
        return cls.map_to_frontend(res.data[0]) if res.data else None

    @classmethod
    def delete(cls, history_id: str) -> bool:
        res = supabase.table("clinical_history").delete().eq("history_id", history_id).execute()
        return len(res.data) > 0
