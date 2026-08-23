from typing import List, Dict, Any, Optional
from backend.database.supabase import supabase
from backend.repositories.patient_repository import get_uuid
from datetime import datetime
import uuid

class ReportRepository:
    @staticmethod
    def map_to_db(data: Dict[str, Any]) -> Dict[str, Any]:
        rep_id = data.get("id")
        if not rep_id:
            rep_id = f"rep-{uuid.uuid4().hex[:8]}"
            
        return {
            "report_id": get_uuid(rep_id),
            "patient_id": get_uuid(data.get("patientId", "")),
            "report_type": data.get("category"),
            "file_url": data.get("fileUrl"),
            "ocr_text": data.get("ocrText", ""),
            "ai_summary": data.get("summary")
        }

    @staticmethod
    def map_to_frontend(row: Dict[str, Any]) -> Dict[str, Any]:
        uploaded_at_str = ""
        if row.get("uploaded_at"):
            try:
                dt_str = row["uploaded_at"]
                if "T" in dt_str:
                    clean_dt = dt_str.split(".")[0].replace("Z", "")
                    dt = datetime.strptime(clean_dt, "%Y-%m-%dT%H:%M:%S")
                else:
                    dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
                uploaded_at_str = dt.strftime("%d %b %Y, %I:%M %p")
            except Exception:
                uploaded_at_str = str(row["uploaded_at"])
                
        return {
            "id": str(row.get("report_id")),
            "patientId": str(row.get("patient_id")),
            "title": f"Radiological Report ({row.get('report_type')})" if row.get("report_type") else "Clinical Report",
            "category": row.get("report_type", "Other"),
            "date": uploaded_at_str,
            "summary": row.get("ai_summary", ""),
            "status": "Final",
            "fileUrl": row.get("file_url", "#")
        }

    @classmethod
    def get_by_patient_id(cls, patient_id: str) -> List[Dict[str, Any]]:
        db_uuid = get_uuid(patient_id)
        res = supabase.table("reports").select("*").eq("patient_id", db_uuid).execute()
        return [cls.map_to_frontend(row) for row in res.data]

    @classmethod
    def get_by_id(cls, report_id: str) -> Optional[Dict[str, Any]]:
        db_uuid = get_uuid(report_id)
        res = supabase.table("reports").select("*").eq("report_id", db_uuid).execute()
        return cls.map_to_frontend(res.data[0]) if res.data else None

    @classmethod
    def create(cls, report_data: Dict[str, Any]) -> Dict[str, Any]:
        if not report_data.get("id"):
            report_data["id"] = f"rep-{uuid.uuid4().hex[:8]}"
            
        db_payload = cls.map_to_db(report_data)
        res = supabase.table("reports").insert(db_payload).execute()
        return cls.map_to_frontend(res.data[0]) if res.data else report_data

    @classmethod
    def delete(cls, report_id: str) -> bool:
        db_uuid = get_uuid(report_id)
        res = supabase.table("reports").delete().eq("report_id", db_uuid).execute()
        return len(res.data) > 0
