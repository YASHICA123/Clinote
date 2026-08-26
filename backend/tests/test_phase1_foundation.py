import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.database.session import init_db

# Initialize database tables and seeds
init_db()
client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"

def test_auth_flow():
    # 1. Login with seeded credentials
    login_payload = {
        "email": "doctor@clinote.ai",
        "password": "doctor123"
    }
    res = client.post("/api/v1/auth/login", json=login_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    token = data["data"]["access_token"]
    assert token is not None

    # 2. Access protected /me endpoint
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["data"]["email"] == "doctor@clinote.ai"

def test_patient_management_and_search():
    import uuid
    # Login
    login_res = client.post("/api/v1/auth/login", json={"email": "doctor@clinote.ai", "password": "doctor123"})
    token = login_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    unique_mrn = f"MRN-{uuid.uuid4().hex[:6].upper()}"
    # 1. Create a new patient
    new_patient = {
        "name": "Marcus Aurelius",
        "hospital_patient_id": unique_mrn,
        "date_of_birth": "1975-04-26",
        "gender": "male",
        "age": 51,
        "department": "Critical Care",
        "bed_number": "Bed-101",
        "initial_encounter_note": "Admitted for observation."
    }
    create_res = client.post("/api/v1/patients", json=new_patient, headers=headers)
    assert create_res.status_code == 201
    created_patient = create_res.json()["data"]
    patient_id = created_patient["id"]
    assert created_patient["hospital_patient_id"] == unique_mrn

    # 2. Search patients by MRN
    search_res = client.get(f"/api/v1/patients?hospital_patient_id={unique_mrn}", headers=headers)
    assert search_res.status_code == 200
    results = search_res.json()["data"]
    assert len(results) >= 1
    assert any(p["id"] == patient_id for p in results)

    # 3. Search patients by query
    query_res = client.get("/api/v1/patients?search=Marcus", headers=headers)
    assert query_res.status_code == 200
    assert len(query_res.json()["data"]) >= 1

    # 4. Get patient by ID
    get_res = client.get(f"/api/v1/patients/{patient_id}", headers=headers)
    assert get_res.status_code == 200
    assert get_res.json()["data"]["name"] == "Marcus Aurelius"

def test_encounters_and_clinical_events_timeline():
    # Login
    login_res = client.post("/api/v1/auth/login", json={"email": "doctor@clinote.ai", "password": "doctor123"})
    token = login_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Create patient
    p_res = client.post("/api/v1/patients", json={"name": "Sarah Connor", "gender": "female"}, headers=headers)
    patient_id = p_res.json()["data"]["id"]

    # 2. Create encounter
    enc_payload = {
        "department": "Trauma ICU",
        "admission_notes": "Admitted via Trauma Bay",
        "status": "ACTIVE"
    }
    enc_res = client.post(f"/api/v1/patients/{patient_id}/encounters", json=enc_payload, headers=headers)
    assert enc_res.status_code == 201
    encounter_id = enc_res.json()["data"]["id"]

    # 3. Add Clinical Events
    evt1 = {
        "patient_id": patient_id,
        "encounter_id": encounter_id,
        "event_type": "INITIAL_ASSESSMENT",
        "title": "Initial Trauma Assessment",
        "content": "Patient conscious and alert. GCS 15. Vital signs stable."
    }
    evt1_res = client.post("/api/v1/clinical/events", json=evt1, headers=headers)
    assert evt1_res.status_code == 201

    evt2 = {
        "patient_id": patient_id,
        "encounter_id": encounter_id,
        "event_type": "DAILY_UPDATE",
        "title": "Day 1 Follow-up",
        "content": "Patient recovering smoothly. No active complaints."
    }
    evt2_res = client.post("/api/v1/clinical/events", json=evt2, headers=headers)
    assert evt2_res.status_code == 201

    # 4. Fetch Timeline
    timeline_res = client.get(f"/api/v1/patients/{patient_id}/timeline?order=asc", headers=headers)
    assert timeline_res.status_code == 200
    timeline_data = timeline_res.json()["data"]
    events = timeline_data["events"] if isinstance(timeline_data, dict) and "events" in timeline_data else timeline_data
    assert len(events) >= 2
    assert events[0]["event_type"] == "INITIAL_ASSESSMENT"
    assert events[1]["event_type"] == "DAILY_UPDATE"

def test_document_draft_and_finalize_lifecycle():
    # Login
    login_res = client.post("/api/v1/auth/login", json={"email": "doctor@clinote.ai", "password": "doctor123"})
    token = login_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Create Patient
    p_res = client.post("/api/v1/patients", json={"name": "Alice Kingsley", "gender": "female"}, headers=headers)
    patient_id = p_res.json()["data"]["id"]

    # 2. Create Draft Document
    doc_payload = {
        "patient_id": patient_id,
        "document_type": "DISCHARGE_SUMMARY",
        "title": "Discharge Summary for Alice",
        "content": "Initial draft text."
    }
    doc_res = client.post("/api/v1/documents", json=doc_payload, headers=headers)
    assert doc_res.status_code == 201
    doc = doc_res.json()["data"]
    doc_id = doc["id"]
    assert doc["status"] == "DRAFT"

    # 3. Update Draft Document (should succeed)
    update_res = client.patch(f"/api/v1/documents/{doc_id}", json={"content": "Updated clinical summary."}, headers=headers)
    assert update_res.status_code == 200
    assert update_res.json()["data"]["content"] == "Updated clinical summary."

    # 4. Finalize Document
    finalize_res = client.post(f"/api/v1/documents/{doc_id}/finalize", headers=headers)
    assert finalize_res.status_code == 200
    assert finalize_res.json()["data"]["status"] == "FINAL"

    # 5. Attempt to edit Finalized Document (MUST FAIL with 403)
    edit_final_res = client.patch(f"/api/v1/documents/{doc_id}", json={"content": "Illegal edit after finalize!"}, headers=headers)
    assert edit_final_res.status_code == 403

def test_audit_logs():
    # Login
    login_res = client.post("/api/v1/auth/login", json={"email": "doctor@clinote.ai", "password": "doctor123"})
    token = login_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch audit logs
    audit_res = client.get("/api/v1/audit/logs", headers=headers)
    assert audit_res.status_code == 200
    logs = audit_res.json()["data"]
    assert len(logs) > 0
    actions = [l["action"] for l in logs]
    assert any(a in actions for a in ["PATIENT_CREATED", "DOCUMENT_FINALIZED", "CLINICAL_EVENT_CREATED"])
