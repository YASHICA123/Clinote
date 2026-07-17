from fastapi.testclient import TestClient
from backend.main import app
from backend.utils.auth import TokenUtils

client = TestClient(app)

# Generate a valid doctor token to pass auth checks
def get_auth_headers():
    token = TokenUtils.create_access_token({
        "sub": "u1",
        "email": "doctor@clinote.ai",
        "role": "Doctor",
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
    if data:
        assert "id" in data[0]
        assert "name" in data[0]

def test_get_patient_by_id():
    uuid_str = "d29d8977-1d60-5a52-b174-2c0695b1114b"
    response = client.get(f"/api/v1/patients/{uuid_str}", headers=get_auth_headers())
    assert response.status_code == 200
    res_json = response.json()
    assert res_json["success"] is True
    data = res_json["data"]
    assert data["id"] == uuid_str
    assert data["name"] == "Rajinder N. Sharma"
