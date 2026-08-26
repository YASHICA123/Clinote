import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.database.session import SessionLocal, init_db
from backend.models import User, Patient, Encounter

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    init_db()
    db = SessionLocal()
    # Clean up test patients
    db.query(Patient).delete()
    db.commit()
    db.close()

def get_auth_token():
    res = client.post("/api/v1/auth/login", json={
        "email": "dr.bhasin@clinote.ai",
        "password": "doctor123"
    })
    assert res.status_code == 200
    data = res.json()
    token = data.get("access_token") or data.get("token") or data.get("data", {}).get("access_token")
    return {"Authorization": f"Bearer {token}"}

def test_process_admission_report_and_confirm():
    headers = get_auth_token()
    
    # 1. Simulate Admission Report File
    sample_report = (
        "MAX SUPER SPECIALITY HOSPITAL\n"
        "ADMISSION INTAKE REPORT\n"
        "Patient Name: Rajesh K. Verma\n"
        "UHID: MAX-992140\n"
        "Age / Gender: 52 Yrs / Male\n"
        "Date of Birth: 1974-04-12\n"
        "Phone: +91 9811234567\n"
        "Address: Flat 402, Green Valley Apartments, New Delhi\n"
        "Admission Date: 2026-08-25\n"
        "Admission Time: 11:15 AM\n"
        "Department: Pulmonology & Critical Care\n"
        "Ward / Bed: ICU-Bed-02\n"
        "Consultant: Dr. Deepak Bhasin\n"
    )
    
    files = {
        "file": ("admission_report.txt", sample_report.encode("utf-8"), "text/plain")
    }
    
    # Process admission report
    proc_res = client.post("/api/v1/patients/admission-report/process", headers=headers, files=files)
    assert proc_res.status_code == 200
    extracted = proc_res.json()["data"]
    assert extracted["status"] == "processed"
    p_data = extracted["patient_data"]
    assert "Rajesh" in p_data["full_name"]
    assert p_data["uhid"] == "MAX-992140"
    assert p_data["age"] == 52
    assert p_data["gender"] == "male"
    assert p_data["department"] == "Pulmonology & Critical Care"

    # 2. Confirm and Create Patient
    confirm_payload = {
        "upload_id": extracted["upload_id"],
        "patient_data": p_data
    }
    confirm_res = client.post("/api/v1/patients/confirm", headers=headers, json=confirm_payload)
    assert confirm_res.status_code == 201
    res_data = confirm_res.json()
    assert res_data["status"] == "success"
    patient_id = res_data["patient_id"]
    assert patient_id is not None
    assert res_data["encounter_id"] is not None

    # 3. Test Duplicate UHID Check
    dup_res = client.post("/api/v1/patients/confirm", headers=headers, json=confirm_payload)
    assert dup_res.status_code == 201  # Returns status duplicate in response body
    dup_data = dup_res.json()
    assert dup_data["status"] == "duplicate"
    assert dup_data["existing_patient_id"] == patient_id
    assert "already exists" in dup_data["message"]
