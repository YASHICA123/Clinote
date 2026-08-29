import type { DischargeSummary, Patient, Encounter, Medication, Investigation, CourseEntry } from '../../../types';
import { getPatientDischargeSummary, mockDischargeSummaries } from '../../../mock/discharge';
import { getPatientCourse } from '../../../mock/api/course';
import { getPatientMedications } from '../../../mock/api/medications';
import { getPatientInvestigations } from '../../../mock/api/investigations';
import { auditService } from '../../audit/services/auditService';
import { http } from '../../../services/http';
import { config } from '../../../services/config';

const STORAGE_KEY_PREFIX = 'clinote_discharge_summary_';

export const dischargeService = {
  getDischargeSummary: async (patientId: string, patient?: Patient, encounters?: Encounter[]): Promise<DischargeSummary> => {
    // Check localStorage cache first
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${patientId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read discharge summary from localStorage', e);
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
    
    // Synthesize fresh if patient data provided
    if (patient) {
      const synthesized = dischargeService.synthesizeFromPatientData(patient, encounters);
      return synthesized;
    }

    const fallback = getPatientDischargeSummary(patientId);
    return fallback;
  },

  synthesizeFromPatientData: (
    patient: Patient,
    encounters?: Encounter[],
    overrideMeds?: Medication[],
    overrideCourse?: CourseEntry[],
    overrideInvs?: Investigation[]
  ): DischargeSummary => {
    const pId = patient.id;
    const course = overrideCourse || getPatientCourse(pId);
    const meds = overrideMeds || getPatientMedications(pId);
    const invs = overrideInvs || getPatientInvestigations(pId);

    // 1. Diagnoses
    const diagnosisText = patient.diagnoses && patient.diagnoses.length > 0
      ? patient.diagnoses.join(', ') + (patient.suspectedCause ? ` (Secondary to ${patient.suspectedCause})` : '')
      : 'Diffuse Alveolar Hemorrhage (DAH) with underlying CKD Stage IIIb, CAD s/p CABG, H/O CVA, long-term anticoagulation, ANA positivity.';

    // 2. Complaints
    const complaintsText = patient.presentingComplaints ||
      patient.chiefComplaints ||
      'Severe breathlessness (NYHA Class IV), hemoptysis (approx 100ml fresh blood), dry cough, and tightness in the chest for 2 days.';

    // 3. Past History
    const pastHistoryText = patient.pastHistory && patient.pastHistory.length > 0
      ? patient.pastHistory.join(', ') + '. No known adverse drug reactions.'
      : 'Known case of Coronary Artery Disease post CABG (2018), Type 2 Diabetes Mellitus (10 yrs), Hypertension, and Chronic Kidney Disease. Prior history of ischemic stroke with mild right hemiparesis. On regular Aspirin and Clopidogrel.';

    // 4. Hospital Course Synthesis from daily course notes & timeline
    let hospitalCourseText = '';
    if (course && course.length > 0) {
      hospitalCourseText = course.map(c => `${c.date ? `[${c.date.split(',')[0]}]: ` : ''}${c.note}`).join('\n\n');
    } else if (patient.hospitalCourse) {
      hospitalCourseText = patient.hospitalCourse;
    } else {
      hospitalCourseText = `Admitted to ICU on ${patient.admissionDate || '24 May 2026'} with ${diagnosisText}. Immediately initiated on high-flow oxygen, IV Methylprednisolone pulse therapy, and empirical broad-spectrum coverage.\n\nSequential monitoring demonstrated steady clinical recovery with cessation of acute symptoms by Day 3. Weaned off supplemental oxygen to room air, hemodynamically stabilized, and shifted to ward for oral medication step-down.`;
    }

    // 5. Investigations Synthesis
    let invsText = '';
    if (invs && invs.length > 0) {
      const abnormal = invs.filter(i => i.status === 'Critical' || i.status === 'Abnormal');
      const normal = invs.filter(i => i.status === 'Normal');
      const abnormalSummary = abnormal.map(i => `${i.testName}: ${i.result} ${i.unit} (${i.status})`).join('; ');
      const normalSummary = normal.slice(0, 4).map(i => `${i.testName}: ${i.result} ${i.unit}`).join('; ');
      invsText = `${abnormalSummary ? `Significant Findings: ${abnormalSummary}. ` : ''}${normalSummary ? `Routine Panels: ${normalSummary}.` : ''}`;
    } else {
      invsText = 'HRCT Chest: Bilateral ground-glass opacities with crazy-paving pattern, predominantly middle and lower zones. ANA: 1:320 positive (Speckled). ANCA (p-ANCA & c-ANCA): Negative. Anti-GBM: Negative. Serum Creatinine: 1.8 mg/dL. 24h Urine Protein: 840 mg. Sputum Gram stain and culture: No pathogenic organisms.';
    }

    // 6. Medications Synthesis
    const dischargeMeds = (meds && meds.length > 0)
      ? meds.filter(m => m.status !== 'Discontinued').map((m, index) => ({
          id: m.id || `med-${index}`,
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          route: m.route || 'Oral',
          duration: m.duration || 'As directed by physician'
        }))
      : [
          {
            id: 'm-1',
            name: 'Prednisolone Tablet (5 mg)',
            dosage: '40 mg (8 tablets)',
            frequency: 'Once daily after breakfast',
            route: 'Oral',
            duration: 'Taper by 5mg every 5 days'
          },
          {
            id: 'm-2',
            name: 'Aspirin (Ecosprin 75 mg)',
            dosage: '75 mg',
            frequency: 'Once daily after lunch',
            route: 'Oral',
            duration: 'Ongoing (Review in OPD)'
          },
          {
            id: 'm-3',
            name: 'Pantoprazole Tablet (40 mg)',
            dosage: '40 mg',
            frequency: 'Once daily before breakfast',
            route: 'Oral',
            duration: '30 Days'
          },
          {
            id: 'm-4',
            name: 'Calcium Carbonate + Vit D3',
            dosage: '500 mg / 400 IU',
            frequency: 'Twice daily after meals',
            route: 'Oral',
            duration: 'Ongoing'
          }
        ];

    // 7. Vitals at Discharge
    const v = patient.vitals || { hr: 76, bp: '124/78', rr: 16, spo2: 97, temp: '98.4 °F' };

    const activeEnc = encounters?.find(e => e.status === 'ACTIVE') || encounters?.[0];

    const newSummary: DischargeSummary = {
      id: `ds_${pId}`,
      patientId: pId,
      summaryDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      hospitalName: 'Clinote Super Specialty Hospital & Medical Center',
      department: patient.department || activeEnc?.department || 'Department of Pulmonology & Critical Care',
      bedNumber: patient.bed_number || patient.bedNumber || 'ICU-45',
      admissionDate: patient.admissionDate || (activeEnc ? new Date(activeEnc.admission_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '24 May 2026'),
      dischargeDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      finalDiagnosis: diagnosisText,
      chiefComplaints: complaintsText,
      historyBackground: pastHistoryText,
      clinicalFindings: `Conscious, oriented, hemodynamically stable. Bilateral chest auscultation clear. Air entry equal bilaterally. Vitals: HR ${v.hr} bpm, BP ${v.bp} mmHg, RR ${v.rr}/min, SpO2 ${v.spo2}% on room air.`,
      hospitalCourse: hospitalCourseText,
      investigations: invsText,
      treatments: 'High-flow oxygenation, IV corticosteroid pulse therapy followed by oral taper, bronchodilator nebulizations, empiric antimicrobial coverage, and tight glycemic & blood pressure control.',
      consultations: '1. Nephrology (Dr. S. K. Sharma): CKD Stage IIIb - conservative management, avoid nephrotoxics. Repeat renal function tests in 2 weeks.\n2. Cardiology (Dr. R. K. Goyal): Low-dose Aspirin continuation advised; review post-CABG status in OPD.',
      dischargeMedications: dischargeMeds,
      followUpInstructions: '1. Follow up in Pulmonology & Critical Care OPD with Dr. Deepak Bhasin on 09 June 2026 at 10:30 AM with fresh CBC, Renal Function Test, and CXR PA view.\n2. In case of acute breathlessness, chest pain, fever > 101°F, or recurrent hemoptysis, report immediately to the 24x7 Emergency Room.',
      dischargeCondition: `Patient is clinically stable, afebrile, ambulatory on room air (SpO2 ${v.spo2}%). Hemoptysis completely resolved, tolerating normal oral diet with good compliance.`,
      vitalsAtDischarge: {
        hr: v.hr,
        bp: v.bp,
        spo2: v.spo2,
        rr: v.rr,
        temp: typeof v.temp === 'string' ? v.temp : `${v.temp} °C`
      },
      consultantName: patient.consultant || activeEnc?.doctor_name || 'Dr. Deepak Bhasin',
      status: patient.status === 'DISCHARGED' ? 'FINAL' : 'DRAFT',
      isFinalized: patient.status === 'DISCHARGED',
      finalizedAt: patient.status === 'DISCHARGED' ? new Date().toISOString() : undefined,
      finalizedBy: patient.status === 'DISCHARGED' ? (patient.consultant || 'Dr. Deepak Bhasin') : undefined
    };

    return newSummary;
  },

  saveDischargeSummary: async (patientId: string, summaryData: DischargeSummary, authorName?: string): Promise<DischargeSummary> => {
    const updated = {
      ...summaryData,
      patientId,
      updatedAt: new Date().toISOString()
    };

    mockDischargeSummaries[patientId] = updated;

    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${patientId}`, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save discharge summary to localStorage', e);
    }

    await auditService.createAuditLog({
      action: 'DISCHARGE_SUMMARY_UPDATED',
      resource_type: 'discharge_summary',
      resource_id: patientId,
      details: `Updated discharge summary clinical sections by ${authorName || 'Attending Clinician'}`
    });

    return updated;
  },

  finalizeDischargeSummary: async (patientId: string, summaryData: DischargeSummary, doctorName: string): Promise<DischargeSummary> => {
    const finalized: DischargeSummary = {
      ...summaryData,
      patientId,
      status: 'FINAL',
      isFinalized: true,
      finalizedAt: new Date().toISOString(),
      finalizedBy: doctorName
    };

    mockDischargeSummaries[patientId] = finalized;
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${patientId}`, JSON.stringify(finalized));
    } catch (e) {
      console.warn('Could not save finalized discharge summary to localStorage', e);
    }

    await auditService.createAuditLog({
      action: 'DISCHARGE_SUMMARY_FINALIZED',
      resource_type: 'discharge_summary',
      resource_id: patientId,
      details: `Finalized and digitally signed discharge summary by ${doctorName}`
    });

    return finalized;
  },

  resetToSynthesized: async (patient: Patient, encounters?: Encounter[]): Promise<DischargeSummary> => {
    const synthesized = dischargeService.synthesizeFromPatientData(patient, encounters);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${patient.id}`, JSON.stringify(synthesized));
    } catch (e) {
      console.warn('Could not reset discharge summary in localStorage', e);
    }

    await auditService.createAuditLog({
      action: 'DISCHARGE_SUMMARY_RECALCULATED',
      resource_type: 'discharge_summary',
      resource_id: patient.id,
      details: `Re-synthesized discharge summary from latest clinical course, vitals, and medication timeline`
    });

    return synthesized;
  },

  regenerateWithAI: async (patientId: string): Promise<Partial<DischargeSummary> | null> => {
    try {
      const res = await http.post<any>(`${config.apiUrl}/generate/discharge`, {
        patient_id: patientId
      });
      if (res && res.generated_text) {
        await auditService.createAuditLog({
          action: 'DISCHARGE_SUMMARY_AI_REGENERATED',
          resource_type: 'discharge_summary',
          resource_id: patientId,
          details: `Regenerated discharge summary via Clinical AI Engine`
        });
        return {
          hospitalCourse: res.generated_text
        };
      }
    } catch (err) {
      console.warn('Backend AI generation fallback:', err);
    }
    return null;
  }
};
