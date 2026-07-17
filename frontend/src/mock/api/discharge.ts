import type { DischargeSummary } from '../../types';

export const mockDischargeSummaries: Record<string, DischargeSummary> = {
  '150612771': {
    id: 'ds_150612771',
    patientId: '150612771',
    summaryDate: '29 May 2026',
    chiefComplaints: 'Severe breathlessness (NYHA Class IV), dry cough, and tightness in the chest for 2 days, following a mild cold.',
    clinicalFindings: 'On admission: Conscious, alert but anxious. Severe respiratory distress. Accessory muscles of respiration active. Barrel chest, chest hyper-resonant on percussion. Auscultation revealed diffuse expiratory wheeze bilaterally with prolonged expiratory phase. Decreased air entry in bilateral lung bases. Vitals: HR 84, BP 128/80, RR 18, SpO2 94% on 35% Venturi Mask.',
    hospitalCourse: 'Admitted to ICU on 24 May 2026 with Severe Acute Exacerbation of COPD and Type II Respiratory Failure. Immediately started on IV Hydrocortisone 100mg Q8H, Duolin + Budecort nebulizations Q6H, and supplemental oxygen. A right radial arterial line was inserted for close ABG monitoring. Sputum culture was sent and empiric IV Augmentin was initiated. By Day 3 (26 May), ABG and clinical symptoms normalized. Weaned to nasal cannula 2L/min. On Day 4 (27 May), transferred to Pulmonology Ward. IV Hydrocortisone transitioned to Oral Prednisolone 40mg daily. Discharged on Day 6 in stable condition, ambulatory on room air with SpO2 96%.',
    dischargeMedications: [
      {
        name: 'Symbicort Inhaler (Budesonide + Formoterol 200/6 mcg)',
        dosage: '2 puffs',
        frequency: 'Twice daily (BID)',
        route: 'Inhalation',
        duration: 'Continual (Review in OPD)'
      },
      {
        name: 'Spiriva Rotacaps (Tiotropium Bromide 18 mcg)',
        dosage: '1 capsule',
        frequency: 'Once daily in morning (OD)',
        route: 'Inhalation (via Rotahaler)',
        duration: 'Continual (Review in OPD)'
      },
      {
        name: 'Prednisolone Tablet (5 mg)',
        dosage: '40 mg (8 tablets)',
        frequency: 'Once daily after breakfast, tapered by 5mg every 5 days',
        route: 'Oral',
        duration: '40 Days (As per taper schedule)'
      },
      {
        name: 'Pantoprazole Tablet (40 mg)',
        dosage: '1 tablet',
        frequency: 'Daily 30 mins before breakfast (OD)',
        route: 'Oral',
        duration: '30 Days'
      }
    ],
    followUpInstructions: '1. Follow up in Pulmonology OPD with Dr. Deepak Bhasin on 5 June 2026 at 10:00 AM.\n2. In case of emergency (severe dyspnea, chest pain, fever, or change in color/quantity of sputum), report immediately to the Emergency Room.',
    dischargeCondition: 'Stable, ambulatory on room air, chest clear on auscultation, no active wheezing. SpO2 96% on room air.',
    consultantName: 'Dr. Deepak Bhasin'
  }
};

export const getPatientDischargeSummary = (patientId: string): DischargeSummary => {
  return mockDischargeSummaries[patientId] || {
    id: `ds_${patientId}`,
    patientId,
    summaryDate: '29 May 2026',
    chiefComplaints: 'Complaints of mild dyspnea on exertion.',
    clinicalFindings: 'Patient is stable, chest clear.',
    hospitalCourse: 'Patient admitted, treated with routine ward protocols, and discharged in stable condition.',
    dischargeMedications: [
      {
        name: 'Paracetamol',
        dosage: '650 mg',
        frequency: 'As needed for fever/pain',
        route: 'Oral',
        duration: '5 Days'
      }
    ],
    followUpInstructions: 'Follow up in OPD in 1 week.',
    dischargeCondition: 'Stable, ambulatory.',
    consultantName: 'Dr. Deepak Bhasin'
  };
};
