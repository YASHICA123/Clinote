export interface DischargeSummary {
  id: string;
  patientId: string;
  summaryDate: string;
  chiefComplaints: string;
  clinicalFindings: string;
  hospitalCourse: string;
  dischargeMedications: {
    name: string;
    dosage: string;
    frequency: string;
    route: string;
    duration: string;
  }[];
  followUpInstructions: string;
  dischargeCondition: string;
  consultantName: string;
}
