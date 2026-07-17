import type { Report } from '../../types';

export const mockReports: Record<string, Report[]> = {
  '150612771': [
    {
      id: 'rep-1',
      patientId: '150612771',
      title: 'Emergency Admission Assessment Sheet',
      category: 'Other',
      date: '24 May 2026',
      summary: 'Patient presented in severe respiratory distress. Dyspnea onset 2 days ago after an upper respiratory infection. Chronic smoker (40 pack-years). Known case of COPD since 10 years, on inhalers. Clinical exam shows active accessory muscle use, barrel chest, distant heart sounds, and bilateral wheezes.',
      status: 'Final',
      fileUrl: '#'
    },
    {
      id: 'rep-2',
      title: 'Chest X-Ray AP View',
      patientId: '150612771',
      category: 'Radiology',
      date: '24 May 2026',
      summary: 'Reveals hyperinflated lung fields, increased retrosternal airspace, and flattening of bilateral hemidiaphragms, highly characteristic of chronic emphysema. No acute consolidations or pleural effusions detected. Heart size is within normal limits.',
      status: 'Final',
      fileUrl: '#'
    },
    {
      id: 'rep-3',
      title: 'High-Resolution CT Chest (HRCT)',
      patientId: '150612771',
      category: 'Radiology',
      date: '24 May 2026',
      summary: 'Shows extensive bilateral panlobular emphysema, worse in the upper lobes. Diffuse bronchial wall thickening and luminal narrowing. A patch of subsegmental ground-glass opacities in the right lower lobe represents early localized bronchopneumonia.',
      status: 'Final',
      fileUrl: '#'
    },
    {
      id: 'rep-4',
      title: 'Transthoracic Echocardiography Report',
      patientId: '150612771',
      category: 'Other',
      date: '25 May 2026',
      summary: 'Left ventricle size and systolic function normal (LVEF 58%). Mild right ventricular hypertrophy (RVH) and mild right atrial enlargement. Estimated pulmonary artery systolic pressure (PASP) is elevated at 42 mmHg, indicating mild pulmonary hypertension.',
      status: 'Final',
      fileUrl: '#'
    }
  ]
};

export const getPatientReports = (patientId: string): Report[] => {
  return mockReports[patientId] || [
    {
      id: `rep-fallback-1-${patientId}`,
      patientId,
      title: 'Routine Blood Panel Report',
      category: 'Lab',
      date: '12 May 2026',
      summary: 'Complete blood counts and basic metabolic panel within normal limits.',
      status: 'Final',
      fileUrl: '#'
    }
  ];
};
