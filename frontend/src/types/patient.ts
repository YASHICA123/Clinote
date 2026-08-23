export type PatientStatus = 'ICU' | 'WARD' | 'DISCHARGED';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  bedNumber: string;
  status: PatientStatus;
  statusText: 'Active' | 'Discharged' | 'Admitted';
  admissionDate: string;
  admissionSource: string;
  consultant: string;
  isNew?: boolean;
  avatar?: string;
  ipNumber?: string;
  displayId?: string;
  diagnoses?: string[];
  vitals?: {
    hr: number;
    bp: string;
    rr: number;
    spo2: number;
    temp: string;
  };
  pastHistory?: string[];
  suspectedCause?: string;
}
