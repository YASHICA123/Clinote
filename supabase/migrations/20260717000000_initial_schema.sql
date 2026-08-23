-- Supabase SQL Setup Script
-- Run this in your Supabase SQL Editor

-- 1. Patient Master
CREATE TABLE IF NOT EXISTS public.patient_master (
    patient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id TEXT,
    mrn TEXT UNIQUE,
    patient_name TEXT NOT NULL,
    age INT,
    gender TEXT,
    date_of_birth DATE,
    phone TEXT,
    address TEXT,
    consultant TEXT,
    department TEXT,
    ward TEXT,
    bed_number TEXT,
    date_of_admission DATE,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Clinical History
CREATE TABLE IF NOT EXISTS public.clinical_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_master(patient_id) ON DELETE CASCADE,
    chief_complaint TEXT,
    history_present_illness TEXT,
    past_history TEXT,
    family_history TEXT,
    drug_history TEXT,
    allergies TEXT,
    working_diagnosis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Investigations (Lab tests, etc)
CREATE TABLE IF NOT EXISTS public.investigations (
    investigation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_master(patient_id) ON DELETE CASCADE,
    test_name TEXT,
    category TEXT,
    ordered_date TIMESTAMP WITH TIME ZONE,
    status TEXT,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Medications
CREATE TABLE IF NOT EXISTS public.medications (
    medication_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_master(patient_id) ON DELETE CASCADE,
    drug_name TEXT NOT NULL,
    dose TEXT,
    frequency TEXT,
    route TEXT,
    status TEXT DEFAULT 'Active',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Reports (Radiology, Pathology documents)
CREATE TABLE IF NOT EXISTS public.reports (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_master(patient_id) ON DELETE CASCADE,
    report_type TEXT,
    file_url TEXT,
    ocr_text TEXT,
    ai_summary TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Timeline Events
CREATE TABLE IF NOT EXISTS public.timeline_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_master(patient_id) ON DELETE CASCADE,
    event_type TEXT,
    title TEXT,
    description TEXT,
    source TEXT,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Consultations
CREATE TABLE IF NOT EXISTS public.consultations (
    consultation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_master(patient_id) ON DELETE CASCADE,
    consultant TEXT NOT NULL,
    department TEXT NOT NULL,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Procedures
CREATE TABLE IF NOT EXISTS public.procedures (
    procedure_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_master(patient_id) ON DELETE CASCADE,
    procedure_name TEXT NOT NULL,
    performed_by TEXT,
    performed_at TIMESTAMP WITH TIME ZONE,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Daily Notes (Ward progress notes)
CREATE TABLE IF NOT EXISTS public.daily_notes (
    note_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_master(patient_id) ON DELETE CASCADE,
    note_text TEXT NOT NULL,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Generated Outputs
CREATE TABLE IF NOT EXISTS public.generated_outputs (
    output_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patient_master(patient_id) ON DELETE CASCADE,
    summary_type TEXT NOT NULL,
    generated_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Audit Logs (Enhanced)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patient_master(patient_id) ON DELETE SET NULL,
    user_email TEXT,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    previous_value JSONB,
    new_value JSONB,
    ip_address TEXT,
    request_id TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
