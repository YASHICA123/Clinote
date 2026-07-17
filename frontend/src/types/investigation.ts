export interface Investigation {
  id: string;
  patientId: string;
  testName: string;
  category: 'Blood' | 'Imaging' | 'Pulmonary' | 'Other';
  result: string;
  referenceRange?: string;
  unit?: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
  testDate: string;
  reportUrl?: string;
}
