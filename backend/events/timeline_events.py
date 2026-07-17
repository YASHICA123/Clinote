from backend.events.dispatcher import EventDispatcher, ClinicalEvents
from backend.repositories.timeline_repository import TimelineRepository
from datetime import datetime

def handle_patient_admitted(patient_data: dict):
    TimelineRepository.create_event({
        "patientId": patient_data.get("id"),
        "type": "admission",
        "title": "Patient Admitted",
        "subtitle": f"Bed: {patient_data.get('bedNumber', 'TBD')}",
        "details": f"Admitted under Consultant: {patient_data.get('consultant', 'TBD')}"
    })

def handle_patient_discharged(data: dict):
    TimelineRepository.create_event({
        "patientId": data.get("patient_id"),
        "type": "discharge",
        "title": "Patient Discharged",
        "subtitle": "Discharged from Ward/ICU",
        "details": "Patient clinical active list finalized and discharged."
    })

def handle_medication_prescribed(med_data: dict):
    TimelineRepository.create_event({
        "patientId": med_data.get("patientId"),
        "type": "medication",
        "title": f"Medication Prescribed: {med_data.get('name')}",
        "subtitle": f"Dosage: {med_data.get('dosage')} - Route: {med_data.get('route')}",
        "details": f"Prescribed status set to Active."
    })

def handle_medication_stopped(med_data: dict):
    TimelineRepository.create_event({
        "patientId": med_data.get("patientId"),
        "type": "medication",
        "title": f"Medication Stopped: {med_data.get('name')}",
        "subtitle": f"Discontinued",
        "details": "Medication marked as discontinued."
    })

def handle_report_uploaded(report_data: dict):
    TimelineRepository.create_event({
        "patientId": report_data.get("patientId"),
        "type": "report",
        "title": f"Clinical Report Uploaded: {report_data.get('title')}",
        "subtitle": f"Category: {report_data.get('category')}",
        "details": f"Summary: {report_data.get('summary')}"
    })

def handle_note_created(note_data: dict):
    TimelineRepository.create_event({
        "patientId": note_data.get("patient_id"),
        "type": "clinical_history",
        "title": "Daily Progress Note Added",
        "subtitle": f"By: {note_data.get('created_by')}",
        "details": note_data.get("note_text")[:200]
    })

def handle_consultation_created(cons_data: dict):
    TimelineRepository.create_event({
        "patientId": cons_data.get("patient_id"),
        "type": "consultation",
        "title": f"Consultation Requested: {cons_data.get('department')}",
        "subtitle": f"Consultant: {cons_data.get('consultant')}",
        "details": cons_data.get("summary", "")
    })

def handle_investigation_created(inv_data: dict):
    TimelineRepository.create_event({
        "patientId": inv_data.get("patientId"),
        "type": "investigation",
        "title": f"Investigation Ordered: {inv_data.get('testName')}",
        "subtitle": f"Category: {inv_data.get('category')} - Status: {inv_data.get('status')}",
        "details": f"Result summary: {inv_data.get('result', '')}"
    })

def handle_procedure_created(proc_data: dict):
    TimelineRepository.create_event({
        "patientId": proc_data.get("patient_id"),
        "type": "procedure",
        "title": f"Procedure Recorded: {proc_data.get('procedure_name')}",
        "subtitle": f"Performed by: {proc_data.get('performed_by')}",
        "details": proc_data.get("summary", "")
    })

# Register listeners
EventDispatcher.subscribe(ClinicalEvents.PATIENT_ADMITTED, handle_patient_admitted)
EventDispatcher.subscribe(ClinicalEvents.PATIENT_DISCHARGED, handle_patient_discharged)
EventDispatcher.subscribe(ClinicalEvents.MEDICATION_PRESCRIBED, handle_medication_prescribed)
EventDispatcher.subscribe(ClinicalEvents.MEDICATION_STOPPED, handle_medication_stopped)
EventDispatcher.subscribe(ClinicalEvents.REPORT_UPLOADED, handle_report_uploaded)
EventDispatcher.subscribe(ClinicalEvents.NOTE_CREATED, handle_note_created)
EventDispatcher.subscribe(ClinicalEvents.CONSULTATION_CREATED, handle_consultation_created)
EventDispatcher.subscribe(ClinicalEvents.INVESTIGATION_CREATED, handle_investigation_created)
EventDispatcher.subscribe(ClinicalEvents.PROCEDURE_CREATED, handle_procedure_created)
