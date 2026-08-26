import io
import zipfile
import pytest
from backend.services.admission_report_service import AdmissionReportService

def test_extract_patient_admission_report_from_docx():
    # Build a simulated .docx file in-memory
    docx_buf = io.BytesIO()
    with zipfile.ZipFile(docx_buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        doc_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>PATIENT ADMISSION REPORT</w:t></w:r></w:p>
    <w:p><w:r><w:t>Full Name: Rajesh Kumar Verma</w:t></w:r></w:p>
    <w:p><w:r><w:t>UHID / MRN: MRN-1004</w:t></w:r></w:p>
    <w:p><w:r><w:t>Gender: Male</w:t></w:r></w:p>
    <w:p><w:r><w:t>Age: 52 Years</w:t></w:r></w:p>
    <w:p><w:r><w:t>Date of Birth: 18 May 1974</w:t></w:r></w:p>
    <w:p><w:r><w:t>Phone Number: +91 9811234567</w:t></w:r></w:p>
    <w:p><w:r><w:t>Residential Address: Flat 402, Green Valley Apartments, New Delhi</w:t></w:r></w:p>
    <w:p><w:r><w:t>Admission Date: 25 August 2026</w:t></w:r></w:p>
    <w:p><w:r><w:t>Admission Time: 11:15 AM</w:t></w:r></w:p>
    <w:p><w:r><w:t>Department: General Medicine</w:t></w:r></w:p>
    <w:p><w:r><w:t>Ward / Room / Bed: General Ward</w:t></w:r></w:p>
    <w:p><w:r><w:t>Consultant / Attending Doctor: Dr. Deepak Bhasin</w:t></w:r></w:p>
    <w:p><w:r><w:t>Hospital / Facility: Clinote Hospital &amp; Medical Centre</w:t></w:r></w:p>
  </w:body>
</w:document>"""
        zf.writestr('word/document.xml', doc_xml.encode('utf-8'))

    docx_bytes = docx_buf.getvalue()

    result = AdmissionReportService.process_admission_file("admission_form.docx", docx_bytes)
    assert result["status"] == "processed"
    assert result["ocr_engine"] == "word_docx"
    
    p = result["patient_data"]
    assert p["full_name"] == "Rajesh Kumar Verma"
    assert p["uhid"] == "MRN-1004"
    assert p["gender"] == "male"
    assert p["age"] == 52
    assert p["date_of_birth"] == "1974-05-18"
    assert p["phone_number"] == "+91 9811234567"
    assert p["address"] == "Flat 402, Green Valley Apartments, New Delhi"
    assert p["admission_date"] == "2026-08-25"
    assert p["admission_time"] == "11:15 AM"
    assert p["department"] == "General Medicine"
    assert p["ward"] == "General Ward"
    assert p["consultant"] == "Dr. Deepak Bhasin"
