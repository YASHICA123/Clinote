export type EncounterStatus = 'ACTIVE' | 'DISCHARGED' | 'CLOSED';

export interface Encounter {
  id: string;
  patient_id: string;
  doctor_id?: string;
  doctor_name?: string;
  department: string;
  admission_date: string;
  discharge_date?: string;
  status: EncounterStatus;
  admission_notes?: string;
  created_at?: string;
  updated_at?: string;
}
