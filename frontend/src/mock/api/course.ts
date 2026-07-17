import type { CourseEntry } from '../../types';

export const mockCourseEntries: Record<string, CourseEntry[]> = {
  '150612771': [
    {
      id: 'course-1',
      patientId: '150612771',
      date: '24 May 2026, 06:00 PM',
      note: 'Day 1 ICU Note: Patient is conscious, alert, and oriented. Dyspnea has partially improved after IV Hydrocortisone and initial nebulizations. Chest exam reveals bilateral expiratory wheezes and prolonged expiratory phase. Repeated ABG indicates mild respiratory acidosis improvement (pH 7.32, pCO2 54 mmHg). Plan: Continue Venturi mask (35%) targetting SpO2 88-92%. Maintain Q6H Duolin/Budecort nebulization.',
      doctorId: 'doc-1',
      doctorName: 'Dr. Deepak Bhasin',
      vitals: { hr: 88, bp: '128/80', rr: 18, spo2: 91, temp: '98.4 °F' }
    },
    {
      id: 'course-2',
      patientId: '150612771',
      date: '25 May 2026, 09:30 AM',
      note: 'Day 2 ICU Note: Arterial line successfully placed in right radial artery for continuous BP tracking. Sputum is thick, whitish-yellow. Chest auscultation shows persistent wheezes. Started empirical IV Augmentin for suspected early bronchopneumonia. Steroids continued. Plan: Monitor fluid intake/output, check ABG twice daily, chest physiotherapy.',
      doctorId: 'doc-1',
      doctorName: 'Dr. Deepak Bhasin',
      vitals: { hr: 92, bp: '120/75', rr: 19, spo2: 93, temp: '98.6 °F' }
    },
    {
      id: 'course-3',
      patientId: '150612771',
      date: '26 May 2026, 10:00 AM',
      note: 'Day 3 ICU Note: Patient is resting comfortably, sitting upright in bed. Able to speak in full sentences without dyspnea. Auscultation reveals significantly reduced wheezing and better air entry. ABG is stable (pH 7.37, pCO2 46 mmHg). Plan: Wean oxygen therapy down to nasal cannula 2L/min. If stable overnight, transfer to pulmonology ward tomorrow.',
      doctorId: 'doc-1',
      doctorName: 'Dr. Deepak Bhasin',
      vitals: { hr: 80, bp: '122/78', rr: 17, spo2: 94, temp: '98.2 °F' }
    },
    {
      id: 'course-4',
      patientId: '150612771',
      date: '27 May 2026, 11:30 AM',
      note: 'Day 4 Ward Transfer Note: Patient transferred to Pulmonology Ward Bed 2212 in stable condition. Tolerating room air well with SpO2 at 95%. Discontinued IV Hydrocortisone; transitioned to oral Prednisolone 40mg once daily with weekly tapering. Nebulizations stepped down to Q8H. Chest is clear. Plan: Complete oral antibiotic course.',
      doctorId: 'doc-1',
      doctorName: 'Dr. Deepak Bhasin',
      vitals: { hr: 78, bp: '120/80', rr: 16, spo2: 95, temp: '98.4 °F' }
    },
    {
      id: 'course-5',
      patientId: '150612771',
      date: '28 May 2026, 09:30 AM',
      note: 'Day 5 Ward Note: Patient is ambulatory, reporting no dyspnea or cough. Inhaler technique (Symbicort and Spiriva) reviewed with nursing staff; demonstration was satisfactory. Completed antibiotic course. Plan: Discharge planned for tomorrow morning. Home medication counseling and emergency guidelines provided.',
      doctorId: 'doc-1',
      doctorName: 'Dr. Deepak Bhasin',
      vitals: { hr: 74, bp: '118/76', rr: 16, spo2: 96, temp: '98.1 °F' }
    }
  ]
};

export const getPatientCourse = (patientId: string): CourseEntry[] => {
  return mockCourseEntries[patientId] || [
    {
      id: `course-fallback-1-${patientId}`,
      patientId,
      date: '12 May 2026, 10:00 AM',
      note: 'Daily progress note: Patient is stable on current therapy. Chest clear. Vital parameters monitored.',
      doctorId: 'doc-1',
      doctorName: 'Dr. Deepak Bhasin',
      vitals: { hr: 76, bp: '120/80', rr: 16, spo2: 98, temp: '98.6 °F' }
    }
  ];
};

export interface StaticEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  actor: string;
  type: 'admission' | 'oxygen' | 'antibiotics' | 'investigations' | 'update';
}

export const mockStaticCourseEvents: StaticEvent[] = [
  {
    id: 'course-static-1',
    time: '25 May 2026, 09:00 AM',
    title: 'Clinical Update',
    description: 'Breathlessness improved. Hemoptysis reduced. SpO₂: 96% on 3 L/min oxygen.',
    actor: 'Dr. Deepak Bhasin',
    type: 'update'
  },
  {
    id: 'course-static-2',
    time: '24 May 2026, 06:45 PM',
    title: 'Investigations Done',
    description: 'CT Chest (HRCT) and ABG done.',
    actor: 'Dr. Deepak Bhasin',
    type: 'investigations'
  },
  {
    id: 'course-static-3',
    time: '24 May 2026, 02:30 PM',
    title: 'Antibiotics Started',
    description: 'Piperacillin + Tazobactam 4.5 g IV started. Azithromycin 500 mg IV once daily.',
    actor: 'Dr. Deepak Bhasin',
    type: 'antibiotics'
  },
  {
    id: 'course-static-4',
    time: '24 May 2026, 11:15 AM',
    title: 'Oxygen Started',
    description: 'Oxygen via nasal cannula started at 4 L/min. SpO₂: 92% on FiO₂ 40%.',
    actor: 'Dr. Deepak Bhasin',
    type: 'oxygen'
  },
  {
    id: 'course-static-5',
    time: '24 May 2026, 10:30 AM',
    title: 'Patient Admitted',
    description: 'Admitted to ICU 45 with complaints of breathlessness and hemoptysis.',
    actor: 'Dr. Deepak Bhasin',
    type: 'admission'
  }
];
