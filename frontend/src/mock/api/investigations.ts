import type { Investigation } from '../../types';

export const mockInvestigations: Record<string, Investigation[]> = {
  '150612771': [
    {
      id: 'inv-1',
      patientId: '150612771',
      testName: 'Arterial Blood Gas (ABG) pH',
      category: 'Blood',
      result: '7.28',
      referenceRange: '7.35 - 7.45',
      unit: '',
      status: 'Critical',
      testDate: '24 May 2026, 10:45 AM'
    },
    {
      id: 'inv-2',
      patientId: '150612771',
      testName: 'ABG pCO2 (Partial Pressure of CO2)',
      category: 'Blood',
      result: '62.0',
      referenceRange: '35.0 - 45.0',
      unit: 'mmHg',
      status: 'Critical',
      testDate: '24 May 2026, 10:45 AM'
    },
    {
      id: 'inv-3',
      patientId: '150612771',
      testName: 'ABG pO2 (Partial Pressure of O2)',
      category: 'Blood',
      result: '55.0',
      referenceRange: '75.0 - 100.0',
      unit: 'mmHg',
      status: 'Critical',
      testDate: '24 May 2026, 10:45 AM'
    },
    {
      id: 'inv-4',
      patientId: '150612771',
      testName: 'White Blood Cell (WBC) Count',
      category: 'Blood',
      result: '14.8',
      referenceRange: '4.0 - 11.0',
      unit: 'x10^3 / µL',
      status: 'Abnormal',
      testDate: '24 May 2026, 11:00 AM'
    },
    {
      id: 'inv-5',
      patientId: '150612771',
      testName: 'Hemoglobin',
      category: 'Blood',
      result: '14.2',
      referenceRange: '13.0 - 17.0',
      unit: 'g/dL',
      status: 'Normal',
      testDate: '24 May 2026, 11:00 AM'
    },
    {
      id: 'inv-6',
      patientId: '150612771',
      testName: 'Serum Potassium',
      category: 'Blood',
      result: '4.1',
      referenceRange: '3.5 - 5.0',
      unit: 'mEq/L',
      status: 'Normal',
      testDate: '24 May 2026, 11:00 AM'
    },
    {
      id: 'inv-7',
      patientId: '150612771',
      testName: 'High-Resolution Chest CT (HRCT)',
      category: 'Imaging',
      result: 'Severe panlobular emphysema, bronchial wall thickening, ground-glass opacities in RLL',
      status: 'Abnormal',
      testDate: '24 May 2026, 02:00 PM',
      reportUrl: '#'
    },
    {
      id: 'inv-8',
      patientId: '150612771',
      testName: 'Electrocardiogram (ECG)',
      category: 'Other',
      result: 'Sinus Tachycardia (HR 104), Right Axis Deviation, P Pulmonale in lead II',
      status: 'Abnormal',
      testDate: '24 May 2026, 10:45 AM'
    },
    {
      id: 'inv-9',
      patientId: '150612771',
      testName: 'Spirometry (Post-Bronchodilator)',
      category: 'Pulmonary',
      result: 'FEV1: 42% predicted, FVC: 72% predicted, FEV1/FVC: 0.52 (Severe Obstruction)',
      status: 'Abnormal',
      testDate: '15 April 2026, 11:30 AM'
    }
  ]
};

export const getPatientInvestigations = (patientId: string): Investigation[] => {
  return mockInvestigations[patientId] || [
    {
      id: `inv-fallback-1-${patientId}`,
      patientId,
      testName: 'Complete Blood Count',
      category: 'Blood',
      result: 'WBC 8.5, Hb 14.0, Plt 250',
      status: 'Normal',
      testDate: '12 May 2026, 10:00 AM'
    }
  ];
};

export interface InvestigationReport {
  id: string;
  testName: string;
  date: string;
  reportedBy: string;
  status: 'Normal' | 'Abnormal';
  findings: string[];
  impression: string;
  imageUrl: string;
}

export const mockInvestigationReports: InvestigationReport[] = [
  {
    id: 'inv-1',
    testName: 'Chest X-Ray (PA View)',
    date: '24 May 2026, 09:15 AM',
    reportedBy: 'Dr. Anil Verma',
    status: 'Normal',
    findings: [
      'Bilateral lung fields are clear.',
      'No evidence of focal consolidation.',
      'Cardiothoracic ratio is within normal limits.',
      'Both costophrenic angles are clear.',
      'No pleural effusion or pneumothorax.',
      'Bony thorax appears normal.'
    ],
    impression: 'No significant abnormality detected.',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'inv-2',
    testName: 'CT Chest (HRCT)',
    date: '23 May 2026, 04:45 PM',
    reportedBy: 'Dr. Anil Verma',
    status: 'Abnormal',
    findings: [
      'Mild ground-glass opacities observed in right lower lobe.',
      'Bronchial wall thickening in bilateral lower lobes.',
      'No significant mediastinal adenopathy detected.',
      'Trace pleural thickening observed.'
    ],
    impression: 'Mild ground-glass changes consistent with recovering pulmonary infection.',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'inv-3',
    testName: 'USG Thorax',
    date: '22 May 2026, 11:30 AM',
    reportedBy: 'Dr. Neha Kapoor',
    status: 'Normal',
    findings: [
      'No significant pleural effusion detected bilaterally.',
      'Diaphragmatic movements are normal.',
      'No consolidation or chest wall masses.'
    ],
    impression: 'Normal study with no fluid accumulation.',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde655bc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'inv-4',
    testName: 'Chest X-Ray (AP View)',
    date: '21 May 2026, 08:20 AM',
    reportedBy: 'Dr. Anil Verma',
    status: 'Normal',
    findings: [
      'Bilateral fields appear normal with no focal infiltrates.',
      'Costophrenic angles are sharp.',
      'Cardiac silhouette is normal.'
    ],
    impression: 'No acute cardiopulmonary disease detected.',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'inv-5',
    testName: 'CT Pulmonary Angiography',
    date: '19 May 2026, 07:10 PM',
    reportedBy: 'Dr. Anil Verma',
    status: 'Abnormal',
    findings: [
      'Bilateral pulmonary arteries show normal contrast opacification.',
      'No filling defect observed in main, lobar or segmental arteries.',
      'Localized consolidation segment in RLL.'
    ],
    impression: 'No pulmonary embolism. Localized right lower lobe consolidation.',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80'
  }
];
