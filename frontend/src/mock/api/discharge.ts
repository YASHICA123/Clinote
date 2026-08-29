import type { DischargeSummary } from '../../types';

export const mockDischargeSummaries: Record<string, DischargeSummary> = {
  '150612771': {
    id: 'ds_150612771',
    patientId: '150612771',
    summaryDate: '02 Jun 2026',
    finalDiagnosis: 'Diffuse Alveolar Hemorrhage (DAH) with underlying CKD Stage IIIb, CAD s/p CABG, H/O CVA, long-term anticoagulation, ANA positivity (1:320, speckled pattern).',
    chiefComplaints: 'Severe breathlessness (NYHA Class IV), hemoptysis (approx 100ml fresh blood), dry cough, and tightness in the chest for 2 days.',
    historyBackground: 'Known case of Coronary Artery Disease post CABG (2018), Type 2 Diabetes Mellitus (10 yrs), Hypertension, and Chronic Kidney Disease. Prior history of ischemic stroke with mild right hemiparesis. On regular Aspirin and Clopidogrel.',
    clinicalFindings: 'On admission: Conscious, alert but anxious. Severe respiratory distress. Accessory muscles of respiration active. Auscultation revealed bilateral diffuse fine crackles and inspiratory crepitations. Vitals on admission: HR 102 bpm, BP 138/88 mmHg, RR 26/min, SpO2 88% on room air, improving to 95% on 4L O2 via nasal prongs.',
    hospitalCourse: 'Admitted to ICU on 24 May 2026 with Diffuse Alveolar Hemorrhage and Type I Respiratory Failure. Immediate high-flow oxygen, IV Methylprednisolone pulse therapy (500mg IV OD for 3 days), and broad-spectrum coverage initiated. Bronchoscopy with sequential BAL confirmed alveolar hemorrhage without endobronchial lesion. Autoimmune panel confirmed ANA positivity. By Day 4 (28 May), hemoptysis ceased and oxygenation stabilized. Weaned off oxygen and shifted to ward on Day 6 (30 May). Tapered to oral Prednisolone 40mg daily.',
    investigations: 'HRCT Chest (24 May): Bilateral ground-glass opacities with crazy-paving pattern, predominantly middle and lower zones. ANA: 1:320 positive (Speckled). ANCA (p-ANCA & c-ANCA): Negative. Anti-GBM: Negative. Serum Creatinine: 1.8 mg/dL. 24h Urine Protein: 840 mg. Sputum Gram stain and culture: No pathogenic organisms.',
    treatments: 'Pulse Methylprednisolone followed by oral Prednisolone. Nebulized Budesonide and Levosalbutamol. IV Ceftriaxone 1g BD for 5 days. Supportive renal care with tight glycemic control.',
    consultations: '1. Nephrology (Dr. S. K. Sharma): CKD Stage IIIb - conservative management, avoid NSAIDs and nephrotoxic drugs. Repeat eGFR in 2 weeks.\n2. Cardiology (Dr. R. K. Goyal): Hold Clopidogrel until 2 weeks hemoptysis-free; continue low-dose Aspirin 75mg once daily under close observation.',
    dischargeMedications: [
      {
        name: 'Prednisolone Tablet (5 mg)',
        dosage: '40 mg (8 tablets)',
        frequency: 'Once daily after breakfast',
        route: 'Oral',
        duration: 'Taper by 5mg every 5 days'
      },
      {
        name: 'Aspirin (Ecosprin 75 mg)',
        dosage: '75 mg',
        frequency: 'Once daily after lunch',
        route: 'Oral',
        duration: 'Ongoing'
      },
      {
        name: 'Pantoprazole Tablet (40 mg)',
        dosage: '40 mg',
        frequency: 'Once daily before breakfast',
        route: 'Oral',
        duration: '30 Days'
      },
      {
        name: 'Calcium Carbonate + Vit D3',
        dosage: '500 mg / 400 IU',
        frequency: 'Twice daily after meals',
        route: 'Oral',
        duration: 'Ongoing'
      }
    ],
    followUpInstructions: '1. Review in Pulmonology & Rheumatology OPD with Dr. Deepak Bhasin on 09 June 2026 at 10:30 AM with fresh CBC, Renal Function Test, and CXR.\n2. Immediate ER visit if: Recurrent hemoptysis, sudden dyspnea, fever > 101°F, or dark tarry stools.',
    dischargeCondition: 'Patient is clinically stable, afebrile, ambulatory on room air (SpO2 97%). Bilateral lung fields clear. Hemoptysis completely resolved. Vitals: BP 124/78 mmHg, HR 76 bpm.',
    consultantName: 'Dr. Deepak Bhasin',
    status: 'FINAL',
    isFinalized: true,
    finalizedAt: '2026-06-02T11:16:00Z',
    finalizedBy: 'Dr. Deepak Bhasin'
  }
};

export const getPatientDischargeSummary = (patientId: string): DischargeSummary => {
  if (mockDischargeSummaries[patientId]) {
    return mockDischargeSummaries[patientId];
  }

  return {
    id: `ds_${patientId}`,
    patientId,
    summaryDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    finalDiagnosis: 'Acute Lower Respiratory Tract Infection with reactive airway disease; Resolving.',
    chiefComplaints: 'Persistent cough with expectoration, intermittent low-grade fever, and exertional breathlessness for 4 days.',
    historyBackground: 'No prior documented history of asthma, COPD, or cardiac illness. Non-smoker. No known drug allergies.',
    clinicalFindings: 'Conscious, oriented, hemodynamically stable. Chest examination revealed mild bilateral rhonchi on forced expiration. Vitals: HR 78 bpm, BP 122/76 mmHg, SpO2 98% on room air, Temp 98.4°F.',
    hospitalCourse: 'Patient was admitted for intravenous antibiotics, bronchodilator nebulizations, and monitoring. Demonstrated swift clinical recovery with resolution of cough and fever by Day 3. Vitals remained stable throughout the stay.',
    investigations: 'CBC: Hb 13.4 g/dL, TLC 8,200/cumm. CRP: 6.2 mg/L. Chest X-Ray PA: Mild peribronchial thickening, no consolidation or pleural effusion.',
    treatments: 'IV Augmentin 1.2g Q8H x 3 days, transitioned to Oral Augmentin 625mg. Budesonide + Levosalbutamol nebulizations. Paracetamol SOS.',
    consultations: 'General Medicine evaluation completed. No subspecialty intervention required.',
    dischargeMedications: [
      {
        name: 'Amoxicillin + Clavulanic Acid (Augmentin 625 mg)',
        dosage: '1 tablet',
        frequency: 'Twice daily after meals (BD)',
        route: 'Oral',
        duration: '5 Days'
      },
      {
        name: 'Levocetirizine + Montelukast (10 mg / 5 mg)',
        dosage: '1 tablet',
        frequency: 'Once daily at bedtime (HS)',
        route: 'Oral',
        duration: '7 Days'
      },
      {
        name: 'Paracetamol (650 mg)',
        dosage: '1 tablet',
        frequency: 'As needed for fever or body ache (SOS)',
        route: 'Oral',
        duration: '5 Days'
      }
    ],
    followUpInstructions: '1. Follow up in General Medicine OPD in 7 days or earlier if symptoms worsen.\n2. In case of high fever, breathlessness, or chest pain, visit the 24x7 Emergency Room immediately.',
    dischargeCondition: 'Patient is stable, ambulatory on room air, afebrile, tolerating oral diet with normal bowel and bladder habits.',
    consultantName: 'Dr. Deepak Bhasin',
    status: 'DRAFT',
    isFinalized: false
  };
};
