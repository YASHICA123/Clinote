-- SQL Seeding Script aligned with actual Supabase schemas

-- 1. Seed patient_master (using deterministic patient UUIDs)
INSERT INTO public.patient_master (
    patient_id, 
    patient_name, 
    age, 
    gender, 
    bed_number, 
    status, 
    consultant, 
    date_of_admission, 
    hospital_id, 
    mrn
) VALUES 
(
    'e6ea87a7-58fb-5c8e-8a07-88f6356c9a1d'::uuid, 
    'Roshan Lal Thakur', 
    68, 
    'M', 
    '11', 
    'Active', 
    'Dr. Deepak Bhasin', 
    '2026-05-10'::date, 
    'HOSP-001', 
    'MRN-150569341'
),
(
    'bc0e2270-3444-59e5-b1a7-19d266e7ff45'::uuid, 
    'Manohar Singh', 
    71, 
    'M', 
    '13', 
    'Active', 
    'Dr. Deepak Bhasin', 
    '2026-05-12'::date, 
    'HOSP-001', 
    'MRN-150647827'
),
(
    'fa6ec66c-5ce2-5ff8-868f-f7d3c9f225cd'::uuid, 
    'Ankita Rawat', 
    60, 
    'F', 
    '15', 
    'Active', 
    'Dr. Deepak Bhasin', 
    '2026-05-14'::date, 
    'HOSP-001', 
    'MRN-150691625'
),
(
    'd29d8977-1d60-5a52-b174-2c0695b1114b'::uuid, 
    'Rajinder N. Sharma', 
    81, 
    'M', 
    '45', 
    'Active', 
    'Dr. Deepak Bhasin', 
    '2026-05-24'::date, 
    'HOSP-001', 
    'MRN-150612771'
)
ON CONFLICT (patient_id) DO UPDATE SET
    patient_name = EXCLUDED.patient_name,
    age = EXCLUDED.age,
    gender = EXCLUDED.gender,
    bed_number = EXCLUDED.bed_number,
    status = EXCLUDED.status,
    consultant = EXCLUDED.consultant,
    date_of_admission = EXCLUDED.date_of_admission,
    hospital_id = EXCLUDED.hospital_id,
    mrn = EXCLUDED.mrn;

-- 2. Seed timeline_events
INSERT INTO public.timeline_events (
    event_id, 
    patient_id, 
    event_type, 
    title, 
    description, 
    source, 
    created_by
) VALUES 
(
    '00000000-0000-0000-0000-000000000001'::uuid, 
    'd29d8977-1d60-5a52-b174-2c0695b1114b'::uuid, 
    'admission', 
    'Patient Admitted to ICU', 
    'Admitted from Pulmonology OPD by Dr. Deepak Bhasin - Patient presented with severe dyspnea, orthopnea, active accessory muscle use, and bilateral diffuse wheezing.', 
    'FastAPI', 
    'Dr. Deepak Bhasin'
),
(
    '00000000-0000-0000-0000-000000000002'::uuid, 
    'd29d8977-1d60-5a52-b174-2c0695b1114b'::uuid, 
    'diagnosis', 
    'Primary Diagnosis Recorded', 
    'Acute Exacerbation of COPD, Type II Respiratory Failure - Based on history of heavy smoking, prior spirometry, clinical exam, and ABG.', 
    'FastAPI', 
    'Dr. Deepak Bhasin'
)
ON CONFLICT (event_id) DO UPDATE SET
    patient_id = EXCLUDED.patient_id,
    event_type = EXCLUDED.event_type,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    source = EXCLUDED.source,
    created_by = EXCLUDED.created_by;

-- 3. Seed medications
INSERT INTO public.medications (
    medication_id, 
    patient_id, 
    drug_name, 
    dose, 
    frequency, 
    route, 
    status, 
    start_date
) VALUES 
(
    '00000000-0000-0000-0000-000000000101'::uuid, 
    'd29d8977-1d60-5a52-b174-2c0695b1114b'::uuid, 
    'Budesonide + Formoterol Inhaler (Symbicort)', 
    '200 mcg / 6 mcg', 
    '2 puffs twice daily (BID)', 
    'Inhalation', 
    'Active', 
    '2026-05-24'::date
),
(
    '00000000-0000-0000-0000-000000000102'::uuid, 
    'd29d8977-1d60-5a52-b174-2c0695b1114b'::uuid, 
    'Tiotropium Bromide (Spiriva)', 
    '18 mcg', 
    '1 capsule inhaled daily (OD)', 
    'Inhalation (Rotahaler)', 
    'Active', 
    '2026-05-24'::date
)
ON CONFLICT (medication_id) DO UPDATE SET
    patient_id = EXCLUDED.patient_id,
    drug_name = EXCLUDED.drug_name,
    dose = EXCLUDED.dose,
    frequency = EXCLUDED.frequency,
    route = EXCLUDED.route,
    status = EXCLUDED.status,
    start_date = EXCLUDED.start_date;

-- 4. Seed investigations
INSERT INTO public.investigations (
    investigation_id, 
    patient_id, 
    test_name, 
    category, 
    ordered_date, 
    status, 
    summary
) VALUES 
(
    '00000000-0000-0000-0000-000000000201'::uuid, 
    'd29d8977-1d60-5a52-b174-2c0695b1114b'::uuid, 
    'Arterial Blood Gas (ABG) pH', 
    'Blood', 
    '2026-05-24'::date, 
    'Critical', 
    '7.28'
)
ON CONFLICT (investigation_id) DO UPDATE SET
    patient_id = EXCLUDED.patient_id,
    test_name = EXCLUDED.test_name,
    category = EXCLUDED.category,
    ordered_date = EXCLUDED.ordered_date,
    status = EXCLUDED.status,
    summary = EXCLUDED.summary;

-- 5. Seed reports
INSERT INTO public.reports (
    report_id, 
    patient_id, 
    report_type, 
    file_url, 
    ocr_text, 
    ai_summary
) VALUES 
(
    '00000000-0000-0000-0000-000000000301'::uuid, 
    'd29d8977-1d60-5a52-b174-2c0695b1114b'::uuid, 
    'Other', 
    '#', 
    'Patient presented in severe respiratory distress. Dyspnea onset 2 days ago after an upper respiratory infection.', 
    'Emergency Admission Assessment Sheet'
)
ON CONFLICT (report_id) DO UPDATE SET
    patient_id = EXCLUDED.patient_id,
    report_type = EXCLUDED.report_type,
    file_url = EXCLUDED.file_url,
    ocr_text = EXCLUDED.ocr_text,
    ai_summary = EXCLUDED.ai_summary;
