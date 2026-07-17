from typing import List, Dict, Any, Optional
from backend.database.supabase import supabase
from backend.repositories.patient_repository import get_uuid, parse_date_to_iso
from datetime import datetime
import uuid

class InvestigationRepository:
    @staticmethod
    def map_to_db(data: Dict[str, Any]) -> Dict[str, Any]:
        inv_id = data.get("id")
        if not inv_id:
            inv_id = f"inv-{uuid.uuid4().hex[:8]}"
            
        return {
            "investigation_id": get_uuid(inv_id),
            "patient_id": get_uuid(data.get("patientId", "")),
            "test_name": data.get("testName"),
            "category": data.get("category"),
            "ordered_date": parse_date_to_iso(data.get("testDate", "")) or datetime.now().date().isoformat(),
            "status": data.get("status"),
            "summary": data.get("result")
        }

    @staticmethod
    def map_to_frontend(row: Dict[str, Any]) -> Dict[str, Any]:
        ordered_date_str = ""
        if row.get("ordered_date"):
            try:
                # Support parsing timestamps with offsets like 2026-07-17T10:00:00+00:00
                date_part = row["ordered_date"].split("T")[0]
                dt = datetime.strptime(date_part, "%Y-%m-%d")
                ordered_date_str = dt.strftime("%d %b %Y, %I:%M %p")
            except Exception:
                ordered_date_str = str(row["ordered_date"])
                
        return {
            "id": str(row.get("investigation_id")),
            "patientId": str(row.get("patient_id")),
            "testName": row.get("test_name"),
            "category": row.get("category"),
            "result": row.get("summary", ""),
            "referenceRange": "Normal range",
            "unit": "",
            "status": row.get("status", "Normal"),
            "testDate": ordered_date_str
        }

    @classmethod
    def get_by_patient_id(cls, patient_id: str) -> List[Dict[str, Any]]:
        db_uuid = get_uuid(patient_id)
        res = supabase.table("investigations").select("*").eq("patient_id", db_uuid).execute()
        return [cls.map_to_frontend(row) for row in res.data]

    @classmethod
    def get_by_id(cls, investigation_id: str) -> Optional[Dict[str, Any]]:
        db_uuid = get_uuid(investigation_id)
        res = supabase.table("investigations").select("*").eq("investigation_id", db_uuid).execute()
        return cls.map_to_frontend(res.data[0]) if res.data else None

    @classmethod
    def create(cls, investigation_data: Dict[str, Any]) -> Dict[str, Any]:
        if not investigation_data.get("id"):
            investigation_data["id"] = f"inv-{uuid.uuid4().hex[:8]}"
            
        db_payload = cls.map_to_db(investigation_data)
        res = supabase.table("investigations").insert(db_payload).execute()
        return cls.map_to_frontend(res.data[0]) if res.data else investigation_data

    @classmethod
    def update(cls, investigation_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        db_uuid = get_uuid(investigation_id)
        db_updates = {}
        if "testName" in updates: db_updates["test_name"] = updates["testName"]
        if "category" in updates: db_updates["category"] = updates["category"]
        if "result" in updates: db_updates["summary"] = updates["result"]
        if "status" in updates: db_updates["status"] = updates["status"]
        if "testDate" in updates:
            db_updates["ordered_date"] = parse_date_to_iso(updates["testDate"])
            
        res = supabase.table("investigations").update(db_updates).eq("investigation_id", db_uuid).execute()
        return cls.map_to_frontend(res.data[0]) if res.data else None

    @classmethod
    def delete(cls, investigation_id: str) -> bool:
        db_uuid = get_uuid(investigation_id)
        res = supabase.table("investigations").delete().eq("investigation_id", db_uuid).execute()
        return len(res.data) > 0
