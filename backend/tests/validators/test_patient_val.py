from backend.validators.patient_validator import PatientValidator

def test_validate_and_clean_age_string():
    data = {"name": "Test Patient", "age": "45", "status": "icu"}
    cleaned = PatientValidator.validate_and_clean(data)
    assert cleaned["age"] == 45
    assert cleaned["status"] == "ICU"

def test_validate_and_clean_empty_bed():
    data = {"name": "Test Patient", "age": 30, "status": "ward", "bedNumber": ""}
    cleaned = PatientValidator.validate_and_clean(data)
    assert cleaned["bedNumber"] == "TBD"
    assert cleaned["status"] == "WARD"
