import type { Medication } from '../../types';

export const mockMedications: Record<string, Medication[]> = {
  '150612771': [
    {
      id: 'med-1',
      patientId: '150612771',
      name: 'Budesonide + Formoterol Inhaler (Symbicort)',
      dosage: '200 mcg / 6 mcg',
      frequency: '2 puffs twice daily (BID)',
      route: 'Inhalation',
      status: 'Active',
      startDate: '24 May 2026',
      prescriber: 'Dr. Deepak Bhasin'
    },
    {
      id: 'med-2',
      patientId: '150612771',
      name: 'Tiotropium Bromide (Spiriva)',
      dosage: '18 mcg',
      frequency: '1 capsule inhaled daily (OD)',
      route: 'Inhalation (Rotahaler)',
      status: 'Active',
      startDate: '24 May 2026',
      prescriber: 'Dr. Deepak Bhasin'
    },
    {
      id: 'med-3',
      patientId: '150612771',
      name: 'Amoxicillin-Clavulanate (Augmentin)',
      dosage: '625 mg',
      frequency: '1 tablet three times daily (TDS)',
      route: 'Oral',
      status: 'Active',
      startDate: '24 May 2026',
      prescriber: 'Dr. Deepak Bhasin'
    },
    {
      id: 'med-4',
      patientId: '150612771',
      name: 'Prednisolone Tablet',
      dosage: '40 mg',
      frequency: '1 tablet once daily (OD) in the morning',
      route: 'Oral',
      status: 'Active',
      startDate: '27 May 2026',
      prescriber: 'Dr. Deepak Bhasin'
    },
    {
      id: 'med-5',
      patientId: '150612771',
      name: 'Hydrocortisone Sodium Succinate IV',
      dosage: '100 mg',
      frequency: 'Every 8 hours (Q8H)',
      route: 'Intravenous',
      status: 'Discontinued',
      startDate: '24 May 2026',
      endDate: '27 May 2026',
      prescriber: 'Dr. Deepak Bhasin'
    },
    {
      id: 'med-6',
      patientId: '150612771',
      name: 'Duolin Nebulization (Levosalbutamol + Ipratropium)',
      dosage: '2.5 ml / 2.5 ml',
      frequency: 'Every 6 hours (Q6H)',
      route: 'Inhalation (Nebulizer)',
      status: 'Active',
      startDate: '24 May 2026',
      prescriber: 'Dr. Deepak Bhasin'
    }
  ]
};

export const getPatientMedications = (patientId: string): Medication[] => {
  return mockMedications[patientId] || [
    {
      id: `med-fallback-1-${patientId}`,
      patientId,
      name: 'Paracetamol',
      dosage: '650 mg',
      frequency: 'As needed (PRN) for pain/fever',
      route: 'Oral',
      status: 'Active',
      startDate: '12 May 2026',
    }
  ];
};

export interface MedicationTabItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  status: 'Active' | 'Discontinued';
  dayText: string;
  totalDays: number;
  currentDay: number;
}

export const mockMedicationTabItems: MedicationTabItem[] = [
  {
    id: 'med-1',
    name: 'Piperacillin + Tazobactam',
    dosage: '4.5 g',
    frequency: 'Q6H',
    route: 'IV',
    duration: '7 Days',
    status: 'Active',
    dayText: 'Day 2 of 7',
    totalDays: 7,
    currentDay: 2
  },
  {
    id: 'med-2',
    name: 'Azithromycin',
    dosage: '500 mg',
    frequency: 'OD',
    route: 'IV',
    duration: '5 Days',
    status: 'Active',
    dayText: 'Day 2 of 5',
    totalDays: 5,
    currentDay: 2
  },
  {
    id: 'med-3',
    name: 'Amoxicillin',
    dosage: '500 mg',
    frequency: 'TDS',
    route: 'Oral',
    duration: '5 Days',
    status: 'Discontinued',
    dayText: 'Completed',
    totalDays: 5,
    currentDay: 5
  }
];
