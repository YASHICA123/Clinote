from typing import List, Optional, Dict, Any
from backend.database.supabase import supabase
from backend.repositories.patient_repository import get_uuid, parse_date_to_iso
from datetime import datetime
import uuid

class MedicationRepository:
    @staticmethod
    def map_to_db(data: Dict[str, Any]) -> Dict[str, Any]:
        med_id = data.get("id")
        if not med_id:
            med_id = f"med-{uuid.uuid4().hex[:8]}"
            
        return {
            "medication_id": get_uuid(med_id),
            "patient_id": get_uuid(data.get("patientId", "")),
            "drug_name": data.get("name"),
            "dose": data.get("dosage"),
            "frequency": data.get("frequency"),
            "route": data.get("route"),
            "status": data.get("status"),
            "start_date": parse_date_to_iso(data.get("startDate", "")) or datetime.now().date().isoformat(),
            "end_date": parse_date_to_iso(data.get("endDate", ""))
        }

    @staticmethod
    def map_to_frontend(row: Dict[str, Any]) -> Dict[str, Any]:
        start_date_str = ""
        if row.get("start_date"):
            try:
                dt = datetime.strptime(row["start_date"], "%Y-%m-%d")
                start_date_str = dt.strftime("%d %b %Y")
            except Exception:
                start_date_str = str(row["start_date"])

        end_date_str = None
        if row.get("end_date"):
            try:
                dt = datetime.strptime(row["end_date"], "%Y-%m-%d")
                end_date_str = dt.strftime("%d %b %Y")
            except Exception:
                end_date_str = str(row["end_date"])

        return {
            "id": str(row.get("medication_id")),
            "patientId": str(row.get("patient_id")),
            "name": row.get("drug_name"),
            "dosage": row.get("dose"),
            "frequency": row.get("frequency"),
            "route": row.get("route"),
            "status": row.get("status", "Active"),
            "startDate": start_date_str,
            "endDate": end_date_str,
            "prescriber": "Dr. Deepak Bhasin"
        }

    @classmethod
    def get_by_patient_id(cls, patient_id: str) -> List[Dict[str, Any]]:
        db_uuid = get_uuid(patient_id)
        res = supabase.table("medications").select("*").eq("patient_id", db_uuid).execute()
        return [cls.map_to_frontend(row) for row in res.data]

    @classmethod
    def get_by_id(cls, medication_id: str) -> Optional[Dict[str, Any]]:
        med_uuid = get_uuid(medication_id)
        res = supabase.table("medications").select("*").eq("medication_id", med_uuid).execute()
        return cls.map_to_frontend(res.data[0]) if res.data else None

    @classmethod
    def create(cls, medication_data: Dict[str, Any]) -> Dict[str, Any]:
        if not medication_data.get("id"):
            medication_data["id"] = f"med-{uuid.uuid4().hex[:8]}"
            
        db_payload = cls.map_to_db(medication_data)
        res = supabase.table("medications").insert(db_payload).execute()
        return cls.map_to_frontend(res.data[0]) if res.data else medication_data

    @classmethod
    def update(cls, medication_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        med_uuid = get_uuid(medication_id)
        db_updates = {}
        if "name" in updates: db_updates["drug_name"] = updates["name"]
        if "dosage" in updates: db_updates["dose"] = updates["dosage"]
        if "frequency" in updates: db_updates["frequency"] = updates["frequency"]
        if "route" in updates: db_updates["route"] = updates["route"]
        if "status" in updates: db_updates["status"] = updates["status"]
        if "endDate" in updates: db_updates["end_date"] = parse_date_to_iso(updates["endDate"])
        
        res = supabase.table("medications").update(db_updates).eq("medication_id", med_uuid).execute()
        return cls.map_to_frontend(res.data[0]) if res.data else None

    @classmethod
    def delete(cls, medication_id: str) -> bool:
        med_uuid = get_uuid(medication_id)
        res = supabase.table("medications").delete().eq("medication_id", med_uuid).execute()
        return len(res.data) > 0
