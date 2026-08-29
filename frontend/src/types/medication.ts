export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  status: 'Active' | 'Discontinued';
  startDate: string;
  endDate?: string;
  duration?: string;
  prescriber?: string;
}
