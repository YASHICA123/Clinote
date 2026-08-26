from fastapi.testclient import TestClient
from backend.main import app
from backend.utils.auth import TokenUtils

client = TestClient(app)

def get_auth_headers():
    token = TokenUtils.create_access_token({
        "sub": "u1",
        "email": "doctor@clinote.ai",
        "role": "DOCTOR",
        "name": "Dr. Deepak Bhasin"
    })
    return {"Authorization": f"Bearer {token}"}

def test_get_patients():
    response = client.get("/api/v1/patients", headers=get_auth_headers())
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["success"] is True
    assert "data" in res_json
    data = res_json["data"]
    assert isinstance(data, list)

def test_get_patient_by_id():
    headers = get_auth_headers()
    # Create patient first
    create_res = client.post("/api/v1/patients", headers=headers, json={
        "name": "Test Patient Flow",
        "gender": "male",
        "age": 42,
        "department": "Internal Medicine"
    })
    assert create_res.status_code == 201
    created_id = create_res.json()["data"]["id"]

    # Retrieve by ID
    response = client.get(f"/api/v1/patients/{created_id}", headers=headers)
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["success"] is True
    data = res_json["data"]
    assert data["id"] == created_id
    assert data["name"] == "Test Patient Flow"
