import pytest
from backend.services.admission_report_service import AdmissionReportService

def test_extract_exact_patient_admission_report():
    sample_pdf_report = """PATIENT ADMISSION REPORT
Official Admission Record

Patient Information
Full Name            Rajesh Kumar Verma
UHID / MRN           MRN-1004
Gender               Male
Age                  52 Years
Date of Birth        18 May 1974
Phone Number         +91 9811234567
Residential Address  Flat 402, Green Valley Apartments, New Delhi

Admission Information
Admission Date                  25 August 2026
Admission Time                  11:15 AM
Department                      General Medicine
Ward / Room / Bed               General Ward
Consultant / Attending Doctor   Dr. Deepak Bhasin
Hospital / Facility             Clinote Hospital & Medical Centre

This report confirms that the above patient has been admitted and the provided patient and admission details have been recorded."""

    res = AdmissionReportService.parse_admission_text(sample_pdf_report)

    assert res["full_name"] == "Rajesh Kumar Verma"
    assert res["uhid"] == "MRN-1004"
    assert res["gender"] == "male"
    assert res["age"] == 52
    assert res["date_of_birth"] == "1974-05-18"
    assert res["phone_number"] == "+91 9811234567"
    assert res["address"] == "Flat 402, Green Valley Apartments, New Delhi"
    assert res["admission_date"] == "2026-08-25"
    assert res["admission_time"] == "11:15 AM"
    assert res["department"] == "General Medicine"
    assert res["ward"] == "General Ward"
    assert res["consultant"] == "Dr. Deepak Bhasin"
    assert res["hospital"] == "Clinote Hospital & Medical Centre"
