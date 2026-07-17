from typing import List, Optional, Dict, Any
import uuid
import logging
from datetime import datetime
from backend.database.supabase import supabase

# Helper to generate a deterministic UUID from patient ID string
def get_uuid(patient_id: str) -> str:
    try:
        # Check if already a valid UUID
        return str(uuid.UUID(patient_id))
    except ValueError:
        # Generate deterministic UUID
        return str(uuid.uuid5(uuid.NAMESPACE_DNS, str(patient_id)))

# Helper to parse frontend date strings to YYYY-MM-DD
def parse_date_to_iso(date_str: str) -> Optional[str]:
    if not date_str:
        return None
    for fmt in ("%d %b %Y, %I:%M %p", "%d %b %Y", "%Y-%m-%d"):
        try:
            clean_str = date_str.split(",")[0].strip() if "," in date_str and fmt != "%d %b %Y, %I:%M %p" else date_str.strip()
            return datetime.strptime(clean_str, fmt).date().isoformat()
        except ValueError:
            continue
    return None

class PatientRepository:
    @staticmethod
    def map_to_db(data: Dict[str, Any]) -> Dict[str, Any]:
        patient_id = get_uuid(data.get("id", ""))
        admission_date = parse_date_to_iso(data.get("admissionDate", "")) or datetime.now().date().isoformat()
        return {
            "patient_id": patient_id,
            "patient_name": data.get("name", "Unknown"),
            "age": data.get("age"),
            "gender": data.get("gender"),
            "bed_number": data.get("bedNumber"),
            "status": data.get("status"),
            "consultant": data.get("consultant"),
            "date_of_admission": admission_date
        }

    @staticmethod
    def map_to_frontend(db_row: Dict[str, Any]) -> Dict[str, Any]:
        # Formats date back to frontend style e.g., "10 May 2026"
        admission_date_str = ""
        if db_row.get("date_of_admission"):
            try:
                dt = datetime.strptime(db_row["date_of_admission"], "%Y-%m-%d")
                admission_date_str = dt.strftime("%d %b %Y")
            except Exception:
                admission_date_str = str(db_row["date_of_admission"])

        status = db_row.get("status", "WARD")
        return {
            "id": db_row.get("patient_id"),
            "name": db_row.get("patient_name", "Unknown"),
            "age": db_row.get("age", 0),
            "gender": db_row.get("gender", "M"),
            "bedNumber": db_row.get("bed_number", "TBD"),
            "status": status,
            "statusText": "Active" if status in ("ICU", "WARD") else "Discharged",
            "admissionDate": admission_date_str,
            "consultant": db_row.get("consultant", ""),
            "diagnoses": [], # In future, join with clinical_history or retrieve separately
            "vitals": { "hr": 80, "bp": "120/80", "rr": 18, "spo2": 98, "temp": "98.6" }
        }

    @classmethod
    def get_all_active(cls) -> List[Dict[str, Any]]:
        res = supabase.table("patient_master").select("*").in_("status", ["ICU", "WARD"]).execute()
        return [cls.map_to_frontend(row) for row in res.data]

    @classmethod
    def get_by_id(cls, patient_id: str) -> Optional[Dict[str, Any]]:
        db_uuid = get_uuid(patient_id)
        res = supabase.table("patient_master").select("*").eq("patient_id", db_uuid).execute()
        return cls.map_to_frontend(res.data[0]) if res.data else None

    @classmethod
    def create(cls, patient_data: Dict[str, Any]) -> Dict[str, Any]:
        patient_id = patient_data.get("id")
        if not patient_id:
            import random
            patient_id = str(150600000 + random.randint(1000, 99999))
            patient_data["id"] = patient_id
            
        patient_data["statusText"] = "Active"
        
        db_payload = cls.map_to_db(patient_data)
        res = supabase.table("patient_master").insert(db_payload).execute()
        return cls.map_to_frontend(res.data[0]) if res.data else patient_data

    @classmethod
    def update(cls, patient_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        db_uuid = get_uuid(patient_id)
        db_updates = {}
        if "name" in updates: db_updates["patient_name"] = updates["name"]
        if "age" in updates: db_updates["age"] = updates["age"]
        if "gender" in updates: db_updates["gender"] = updates["gender"]
        if "bedNumber" in updates: db_updates["bed_number"] = updates["bedNumber"]
        if "status" in updates: db_updates["status"] = updates["status"]
        if "consultant" in updates: db_updates["consultant"] = updates["consultant"]
        
        res = supabase.table("patient_master").update(db_updates).eq("patient_id", db_uuid).execute()
        return cls.map_to_frontend(res.data[0]) if res.data else None

    @classmethod
    def delete(cls, patient_id: str) -> bool:
        db_uuid = get_uuid(patient_id)
        res = supabase.table("patient_master").delete().eq("patient_id", db_uuid).execute()
        return len(res.data) > 0
