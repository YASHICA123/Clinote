import React from 'react';
import {
  Activity,
  Pill,
  FileText,
  Info,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { Patient, Medication } from '../../../types';

interface OverviewTabProps {
  patient: Patient;
  medications: Medication[];
  /** Which onboarding actions the doctor has completed: 'upload' | 'medication' */
  completedOnboardingTasks?: string[];
  onViewTrend: () => void;
  onViewMedications: () => void;
}

// Empty-state placeholder used inside a card when data hasn't been added yet
const EmptyCardState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex-1 flex flex-col items-center justify-center py-6 text-center gap-2">
    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
      <span className="text-slate-300 text-lg font-black">—</span>
    </div>
    <p className="text-[10px] text-slate-400 font-semibold max-w-[120px] leading-relaxed">{message}</p>
  </div>
);

export const OverviewTab: React.FC<OverviewTabProps> = ({
  patient,
  medications,
  completedOnboardingTasks = [],
  onViewTrend,
  onViewMedications
}) => {
  // Determine which sections are available
  // For non-new patients (bypassed onboarding or established), show everything
  const isEstablished = !patient.isNew;
  const hasAssessment = isEstablished || completedOnboardingTasks.includes('upload');
  const hasMedication = isEstablished || completedOnboardingTasks.includes('medication');

  // Vitals — fall back to Rajinder's sample values if not yet entered
  const vitals = patient.vitals || {
    temp: '37.2 °C',
    hr: 102,
    bp: '128/76',
    spo2: 92,
    rr: 24
  };

  // Format temp nicely
  const tempLabel = typeof vitals.temp === 'string'
    ? (vitals.temp.includes('°') ? vitals.temp : `${vitals.temp} °C`)
    : `${vitals.temp} °C`;

  // Primary diagnosis
  const primaryDiagnosis = patient.diagnoses?.[0] || 'Diffuse Alveolar Hemorrhage (DAH)';
  const suspectedCause = patient.suspectedCause || 'Severe lower respiratory tract infection';

  // Medications list — use actual saved meds; fall back to antibiotic defaults
  const displayMeds = medications.length > 0
    ? medications
    : [
      { id: '1', name: 'Piperacillin + Tazobactam', dosage: '4.5 g IV', frequency: 'Every 8 hours' },
      { id: '2', name: 'Azithromycin', dosage: '500 mg IV', frequency: 'Once daily' },
      { id: '3', name: 'Linezolid', dosage: '600 mg IV', frequency: 'Every 12 hours' },
    ] as Medication[];

  return (
    <div className="space-y-5 text-left">

      {/* ── 3-Column Overview Grid ── */}
      <div className="grid md:grid-cols-3 gap-5">

        {/* ── Column 1: Current Diagnosis ── */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 flex flex-col min-h-[240px]">
          {/* Card Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <FileText size={15} />
            </div>
            <h4 className="font-extrabold text-[11px] text-emerald-700 uppercase tracking-wider">
              Current Diagnosis
            </h4>
          </div>

          {hasAssessment ? (
            <>
              <div className="flex-1 space-y-2">
                <h3 className="text-[15px] font-black text-slate-800 leading-snug">
                  {primaryDiagnosis}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  {suspectedCause}
                </p>
              </div>
              <div className="pt-4 mt-auto">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-black rounded-lg border border-emerald-100">
                  <CheckCircle2 size={9} />
                  Primary Diagnosis
                </span>
              </div>
            </>
          ) : (
            <EmptyCardState message="Upload Initial Assessment to populate diagnosis details." />
          )}
        </div>

        {/* ── Column 2: Initial Vitals ── */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 flex flex-col min-h-[240px]">
          {/* Card Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <Activity size={15} />
              </div>
              <h4 className="font-extrabold text-[11px] text-blue-600 uppercase tracking-wider leading-tight">
                Initial Vitals{' '}
                <span className="text-slate-400 normal-case font-semibold text-[9px]">
                  (at Admission)
                </span>
              </h4>
            </div>
            {hasAssessment && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewTrend}
                className="text-[9px] font-bold text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-emerald-700 px-2.5 py-1 h-auto rounded-lg flex items-center gap-1"
              >
                <TrendingUp size={10} />
                View Trend
              </Button>
            )}
          </div>

          {hasAssessment ? (
            <div className="grid grid-cols-2 gap-2.5 text-xs flex-1 content-start">
              {/* Temp */}
              <div className="bg-slate-50 rounded-xl p-2.5 space-y-0.5">
                <span className="text-[9px] text-slate-400 font-semibold block">Temp</span>
                <p className="font-black text-slate-800 text-[13px]">{tempLabel}</p>
              </div>
              {/* HR */}
              <div className="bg-slate-50 rounded-xl p-2.5 space-y-0.5">
                <span className="text-[9px] text-slate-400 font-semibold block">HR</span>
                <p className="font-black text-slate-800 text-[13px]">{vitals.hr} bpm</p>
              </div>
              {/* BP — full row */}
              <div className="bg-slate-50 rounded-xl p-2.5 space-y-0.5 col-span-2">
                <span className="text-[9px] text-slate-400 font-semibold block">BP</span>
                <p className="font-black text-slate-800 text-[13px]">{vitals.bp} mmHg</p>
              </div>
              {/* SpO2 */}
              <div className="bg-slate-50 rounded-xl p-2.5 space-y-0.5">
                <span className="text-[9px] text-slate-400 font-semibold block">SpO₂</span>
                <p className="font-black text-slate-800 text-[13px]">{vitals.spo2}%</p>
                <span className="text-[8px] text-slate-400 font-semibold block leading-none">(FiO₂ 40%)</span>
              </div>
              {/* RR */}
              <div className="bg-slate-50 rounded-xl p-2.5 space-y-0.5">
                <span className="text-[9px] text-slate-400 font-semibold block">RR</span>
                <p className="font-black text-slate-800 text-[13px]">{vitals.rr} /min</p>
              </div>
            </div>
          ) : (
            <EmptyCardState message="Upload Initial Assessment to populate admission vitals." />
          )}
        </div>

        {/* ── Column 3: Medications (Antibiotics) ── */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 flex flex-col min-h-[240px]">
          {/* Card Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 bg-orange-50 text-orange-500 rounded-xl shrink-0">
              <Pill size={15} />
            </div>
            <h4 className="font-extrabold text-[11px] text-orange-500 uppercase tracking-wider">
              Medications (Antibiotics)
            </h4>
          </div>

          {hasMedication ? (
            <>
              <div className="flex-1 space-y-3">
                {displayMeds.slice(0, 3).map((med, i) => (
                  <div key={med.id || i} className="space-y-0.5">
                    <div className="flex items-start gap-2">
                      <span className="text-[9px] font-black text-slate-400 mt-0.5 shrink-0 w-3">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-[11px] text-slate-800 leading-tight truncate">{med.name}</p>
                        <div className="flex items-center justify-between text-[9px] text-slate-400 font-semibold mt-0.5">
                          <span>{med.dosage}</span>
                          <span className="text-right">{med.frequency}</span>
                        </div>
                      </div>
                    </div>
                    {i < Math.min(displayMeds.length, 3) - 1 && (
                      <div className="h-px bg-slate-50 ml-5 mt-1" />
                    )}
                  </div>
                ))}
              </div>
              <div className="pt-4 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewMedications}
                  className="w-full text-[10px] font-extrabold text-orange-500 border-orange-200 hover:bg-orange-50 py-2 rounded-xl h-auto"
                >
                  View All
                </Button>
              </div>
            </>
          ) : (
            <EmptyCardState message="Add Medication to see prescribed antibiotics here." />
          )}
        </div>

      </div>

      {/* ── Info Banner ── */}
      <div className="w-full bg-blue-50/60 border border-blue-100 rounded-2xl p-4 flex gap-3 items-center">
        <Info size={16} className="text-blue-500 shrink-0" />
        <p className="text-[10px] text-blue-700 font-semibold leading-relaxed">
          All updates including Course in Hospital, Antibiotic Timeline &amp; Discharge Summary memory will be updated automatically.
        </p>
      </div>

    </div>
  );
};
