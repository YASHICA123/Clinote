from typing import List, Dict, Any
from backend.database.supabase import supabase
from backend.repositories.patient_repository import get_uuid
from datetime import datetime
import uuid
import logging

class TimelineRepository:
    @staticmethod
    def map_to_db(data: Dict[str, Any]) -> Dict[str, Any]:
        evt_id = data.get("id")
        if not evt_id:
            evt_id = f"evt-{uuid.uuid4().hex[:8]}"
            
        return {
            "event_id": get_uuid(evt_id),
            "patient_id": get_uuid(data.get("patientId", "")),
            "event_type": data.get("type"),
            "title": data.get("title"),
            "description": f"{data.get('subtitle', '')} - {data.get('details', '')}" if data.get('subtitle') else data.get('details', ''),
            "source": "FastAPI",
            "created_by": "Dr. Deepak Bhasin"
        }

    @staticmethod
    def map_to_frontend(row: Dict[str, Any]) -> Dict[str, Any]:
        # Formats date back to frontend style
        created_at_str = ""
        if row.get("created_at"):
            try:
                dt_str = row["created_at"]
                if "T" in dt_str:
                    clean_dt = dt_str.split(".")[0].replace("Z", "")
                    dt = datetime.strptime(clean_dt, "%Y-%m-%dT%H:%M:%S")
                else:
                    dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
                created_at_str = dt.strftime("%d %b %Y, %I:%M %p")
            except Exception:
                created_at_str = str(row["created_at"])
                
        return {
            "id": str(row.get("event_id")),
            "patientId": str(row.get("patient_id")),
            "type": row.get("event_type", "admission"),
            "title": row.get("title", ""),
            "subtitle": "",
            "timestamp": created_at_str,
            "details": row.get("description", "")
        }

    @classmethod
    def get_by_patient_id(cls, patient_id: str) -> List[Dict[str, Any]]:
        db_uuid = get_uuid(patient_id)
        res = supabase.table("timeline_events").select("*").eq("patient_id", db_uuid).execute()
        return [cls.map_to_frontend(row) for row in res.data]

    @classmethod
    def create_event(cls, event_data: Dict[str, Any]) -> Dict[str, Any]:
        patient_id = event_data.get("patientId")
        if not event_data.get("id"):
            event_data["id"] = f"evt-{uuid.uuid4().hex[:8]}"
            
        db_payload = cls.map_to_db(event_data)
        res = supabase.table("timeline_events").insert(db_payload).execute()
        return cls.map_to_frontend(res.data[0]) if res.data else event_data
