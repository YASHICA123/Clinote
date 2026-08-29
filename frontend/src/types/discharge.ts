export interface DischargeMedication {
  id?: string;
  name: string;
  dosage: string;
  frequency: string;
  route?: string;
  duration?: string;
}

export interface DischargeVitals {
  hr?: number | string;
  bp?: string;
  spo2?: number | string;
  rr?: number | string;
  temp?: string;
}

export interface DischargeSummary {
  id: string;
  patientId: string;
  summaryDate: string;
  hospitalName?: string;
  department?: string;
  bedNumber?: string;
  admissionDate?: string;
  dischargeDate?: string;
  finalDiagnosis?: string;
  chiefComplaints: string;
  historyBackground?: string;
  clinicalFindings: string;
  hospitalCourse: string;
  investigations?: string;
  treatments?: string;
  consultations?: string;
  dischargeMedications: DischargeMedication[];
  followUpInstructions: string;
  dischargeCondition: string;
  vitalsAtDischarge?: DischargeVitals;
  consultantName: string;
  status?: 'DRAFT' | 'FINAL' | 'PENDING_REVIEW';
  isFinalized?: boolean;
  finalizedAt?: string;
  finalizedBy?: string;
}
