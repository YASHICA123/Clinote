import type { TimelineEvent } from '../../types';

export const mockTimelines: Record<string, TimelineEvent[]> = {
  '150612771': [
    {
      id: 'evt-1',
      patientId: '150612771',
      type: 'admission',
      title: 'Patient Admitted to ICU',
      subtitle: 'Admitted from Pulmonology OPD by Dr. Deepak Bhasin',
      timestamp: '24 May 2026, 10:30 AM',
      details: 'Patient presented with severe dyspnea, orthopnea, active accessory muscle use, and bilateral diffuse wheezing. Arterial Blood Gas (ABG) analysis showed acute respiratory acidosis (pH: 7.28, pCO2: 62 mmHg, pO2: 55 mmHg).'
    },
    {
      id: 'evt-2',
      patientId: '150612771',
      type: 'diagnosis',
      title: 'Primary Diagnosis Recorded',
      subtitle: 'Acute Exacerbation of COPD, Type II Respiratory Failure',
      timestamp: '24 May 2026, 11:15 AM',
      details: 'Based on history of heavy smoking, prior spirometry, clinical exam, and ABG. Secondary diagnosis of Cor Pulmonale noted due to chronic hypoxemia and signs of right heart strain.'
    },
    {
      id: 'evt-3',
      patientId: '150612771',
      type: 'medication',
      title: 'Emergency Medical Therapy Initiated',
      subtitle: 'IV Hydrocortisone, Nebulization, & Oxygen Therapy',
      timestamp: '24 May 2026, 11:30 AM',
      details: 'Administered IV Hydrocortisone 100mg stat, followed by Duolin (Levosalbutamol + Ipratropium) and Budecort (Budesonide) nebulizations. Started oxygen therapy via venturi mask (35%) targetting SpO2 between 88-92%.'
    },
    {
      id: 'evt-4',
      patientId: '150612771',
      type: 'investigation',
      title: 'HRCT Chest Scan Performed & Uploaded',
      subtitle: 'Radiology Report - Bilateral Emphysema & Bronchiectasis',
      timestamp: '24 May 2026, 02:00 PM',
      details: 'High-Resolution CT Chest shows severe panlobular emphysema, marked bronchial wall thickening, and mild cystic bronchiectatic changes in bilateral lower lobes. Patchy ground-glass opacities in the right lower lobe suggest subsegmental bronchopneumonia.'
    },
    {
      id: 'evt-5',
      patientId: '150612771',
      type: 'procedure',
      title: 'Arterial Line Insertion',
      subtitle: 'Right radial artery cannulation',
      timestamp: '25 May 2026, 09:00 AM',
      details: 'Procedure performed under aseptic precautions by ICU team for continuous blood pressure monitoring and frequent ABG sampling. Left patent, dressing dry and intact. Distal perfusion normal.'
    },
    {
      id: 'evt-6',
      patientId: '150612771',
      type: 'transfer',
      title: 'Transferred to Pulmonology Ward',
      subtitle: 'Shifted from ICU Bed 24 to Ward Bed 2212',
      timestamp: '27 May 2026, 11:00 AM',
      details: 'Patient responded well to IV corticosteroids and aggressive nebulization. ABG normalized (pH: 7.39, pCO2: 44 mmHg, pO2: 74 mmHg). Dyspnea resolved to baseline (NYHA Class II). Weaned off oxygen therapy.'
    },
    {
      id: 'evt-7',
      patientId: '150612771',
      type: 'discharge',
      title: 'Discharge Summary Generated & Approved',
      subtitle: 'Discharge planned for 29 May 2026',
      timestamp: '29 May 2026, 10:00 AM',
      details: 'Final discharge counseling completed. Home medications reconciled including Formoterol/Budesonide inhaler. Scheduled follow-up in Pulmonology OPD in 7 days.'
    }
  ]
};

// Fallback timeline for other patients
export const getPatientTimeline = (patientId: string): TimelineEvent[] => {
  return mockTimelines[patientId] || [
    {
      id: `evt-fallback-1-${patientId}`,
      patientId,
      type: 'admission',
      title: 'Patient Admitted',
      subtitle: 'Admitted by Dr. Deepak Bhasin',
      timestamp: '12 May 2026, 10:00 AM',
      details: 'Initial clinical evaluation completed. Patient stable.'
    },
    {
      id: `evt-fallback-2-${patientId}`,
      patientId,
      type: 'diagnosis',
      title: 'Diagnosis Confirmed',
      subtitle: 'Primary Diagnosis Added',
      timestamp: '12 May 2026, 11:30 AM',
      details: 'Standard treatment plan initiated.'
    }
  ];
};
