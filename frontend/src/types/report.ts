export interface Report {
  id: string;
  patientId: string;
  title: string;
  category: 'Radiology' | 'Lab' | 'Discharge' | 'Other';
  date: string;
  summary: string;
  status: 'Final' | 'Pending';
  fileUrl?: string;
}
