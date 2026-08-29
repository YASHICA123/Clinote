export type PatientStatus = 'ACTIVE' | 'ICU' | 'WARD' | 'DISCHARGED';

export interface Patient {
  id: string;
  hospital_patient_id?: string;
  displayId?: string;
  ipNumber?: string;
  name: string;
  date_of_birth?: string;
  age?: number;
  gender: string;
  bedNumber?: string;
  bed_number?: string;
  status: PatientStatus;
  statusText?: string;
  department?: string;
  admissionDate?: string;
  admissionSource?: string;
  consultant?: string;
  active_encounter_id?: string;
  isNew?: boolean;
  avatar?: string;
  diagnoses?: string[];
  vitals?: {
    hr: number;
    bp: string;
    rr: number;
    spo2: number;
    temp: string;
  };
  suspectedCause?: string;
  pastHistory?: string[];
  chiefComplaints?: string;
  presentingComplaints?: string;
  hospitalCourse?: string;
  created_at?: string;
  updated_at?: string;
}
