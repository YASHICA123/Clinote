import os
import sys
import pytest
from unittest.mock import MagicMock

# Add root folder to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

class MockResponse:
    def __init__(self, data):
        self.data = data

class MockQueryBuilder:
    def __init__(self, data=None):
        self.data = data or []

    def select(self, *args, **kwargs): return self
    def eq(self, *args, **kwargs): return self
    def in_(self, *args, **kwargs): return self
    def order(self, *args, **kwargs): return self
    def limit(self, *args, **kwargs): return self
    def insert(self, payload, *args, **kwargs):
        ret = payload if isinstance(payload, list) else [payload]
        return MockQueryBuilder(ret)
    def update(self, payload, *args, **kwargs):
        ret = payload if isinstance(payload, list) else [payload]
        return MockQueryBuilder(ret)
    def delete(self, *args, **kwargs):
        return MockQueryBuilder([{"status": "deleted"}])
    def execute(self):
        return MockResponse(self.data)

@pytest.fixture(autouse=True)
def mock_supabase(monkeypatch):
    mock_client = MagicMock()
    
    mock_patients = [
        {
            "patient_id": "d29d8977-1d60-5a52-b174-2c0695b1114b", # Deterministic UUID of 150612771
            "patient_name": "Rajinder N. Sharma",
            "age": 81,
            "gender": "M",
            "bed_number": "45",
            "status": "ICU",
            "consultant": "Dr. Deepak Bhasin",
            "date_of_admission": "2026-05-24"
        }
    ]
    
    def mock_table(table_name):
        if table_name == "patient_master":
            return MockQueryBuilder(mock_patients)
        return MockQueryBuilder([])
        
    mock_client.table = mock_table
    
    # Mock storage calls
    mock_bucket = MagicMock()
    mock_client.storage.get_bucket.return_value = mock_bucket
    
    # Apply monkeypatch to backend.database.supabase
    import backend.database.supabase
    monkeypatch.setattr(backend.database.supabase, "supabase", mock_client)
    monkeypatch.setattr(backend.database.supabase, "is_supabase_configured", True)
    
    return mock_client
