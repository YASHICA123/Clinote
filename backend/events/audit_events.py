from backend.events.dispatcher import EventDispatcher, ClinicalEvents
from backend.middleware.request_id import get_current_request_id, get_current_user_email, get_current_ip_address
from backend.repositories.patient_repository import get_uuid
from backend.database.supabase import supabase
from backend.config.logging import audit_logger
import json

def insert_audit_log(action: str, resource: str, patient_id: str, new_val: dict, prev_val: dict = None):
    # Resolve deterministic UUID for patient
    patient_uuid = get_uuid(patient_id) if patient_id else None
    
    user_email = get_current_user_email() or "system@clinote.ai"
    ip = get_current_ip_address() or "127.0.0.1"
    req_id = get_current_request_id() or "system"
    
    db_payload = {
        "patient_id": patient_uuid,
        "user_email": user_email,
        "action": action,
        "resource": resource,
        "previous_value": prev_val,
        "new_value": new_val,
        "ip_address": ip,
        "request_id": req_id
    }
    
    # 1. Log to text audit file
    audit_logger.info(
        f"REQ_ID: {req_id} | USER: {user_email} | IP: {ip} | ACTION: {action} | "
        f"RESOURCE: {resource} | PATIENT: {patient_id} | DATA: {json.dumps(new_val)}"
    )
    
    # 2. Write to Supabase DB audit_logs
    try:
        supabase.table("audit_logs").insert(db_payload).execute()
    except Exception as e:
        audit_logger.error(f"Failed to save audit log to Supabase: {str(e)}")

# Listeners
def handle_patient_admitted(data: dict):
    insert_audit_log("patient.admitted", "patient_master", data.get("id"), data)

def handle_patient_discharged(data: dict):
    insert_audit_log("patient.discharged", "patient_master", data.get("patient_id"), data)

def handle_medication_prescribed(data: dict):
    insert_audit_log("medication.prescribed", "medications", data.get("patientId"), data)

def handle_medication_stopped(data: dict):
    insert_audit_log("medication.stopped", "medications", data.get("patientId"), data)

def handle_report_uploaded(data: dict):
    insert_audit_log("report.uploaded", "reports", data.get("patientId"), data)

def handle_note_created(data: dict):
    insert_audit_log("note.created", "daily_notes", data.get("patient_id"), data)

def handle_consultation_created(data: dict):
    insert_audit_log("consultation.created", "consultations", data.get("patient_id"), data)

def handle_investigation_created(data: dict):
    insert_audit_log("investigation.created", "investigations", data.get("patientId"), data)

def handle_procedure_created(data: dict):
    insert_audit_log("procedure.created", "procedures", data.get("patient_id"), data)

# Subscriptions
EventDispatcher.subscribe(ClinicalEvents.PATIENT_ADMITTED, handle_patient_admitted)
EventDispatcher.subscribe(ClinicalEvents.PATIENT_DISCHARGED, handle_patient_discharged)
EventDispatcher.subscribe(ClinicalEvents.MEDICATION_PRESCRIBED, handle_medication_prescribed)
EventDispatcher.subscribe(ClinicalEvents.MEDICATION_STOPPED, handle_medication_stopped)
EventDispatcher.subscribe(ClinicalEvents.REPORT_UPLOADED, handle_report_uploaded)
EventDispatcher.subscribe(ClinicalEvents.NOTE_CREATED, handle_note_created)
EventDispatcher.subscribe(ClinicalEvents.CONSULTATION_CREATED, handle_consultation_created)
EventDispatcher.subscribe(ClinicalEvents.INVESTIGATION_CREATED, handle_investigation_created)
EventDispatcher.subscribe(ClinicalEvents.PROCEDURE_CREATED, handle_procedure_created)
