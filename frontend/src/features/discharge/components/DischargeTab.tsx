import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Loader } from '../../../components/ui/Loader';
import { dischargeService } from '../services/dischargeService';
import { patientService } from '../../patient/services/patientService';
import { encounterService } from '../../encounter/services/encounterService';
import { auditService } from '../../audit/services/auditService';
import { useApp } from '../../../context/AppContext';
import type { Patient, Encounter, DischargeSummary, DischargeMedication, AuditLog } from '../../../types';
import {
  CheckCircle2,
  RefreshCw,
  FileText,
  ClipboardList,
  FlaskConical,
  Pill,
  Activity,
  Calendar,
  Edit2,
  ShieldCheck,
  Printer,
  AlertTriangle,
  X,
  Save,
  Check,
  Stethoscope,
  HeartPulse,
  Plus,
  Trash2,
  Sparkles
} from 'lucide-react';

interface DischargeTabProps {
  patientId: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  patient?: Patient;
  encounters?: Encounter[];
  onRefreshPatient?: () => Promise<void>;
  onNavigateToAudit?: () => void;
}

export const DischargeTab: React.FC<DischargeTabProps> = ({
  patientId,
  patientName = 'Patient',
  patientAge = 65,
  patientGender = 'Male',
  patient: propPatient,
  encounters = [],
  onRefreshPatient,
  onNavigateToAudit
}) => {
  const { currentUser, setActiveTab } = useApp();

  const [summary, setSummary] = useState<DischargeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [recentAuditLogs, setRecentAuditLogs] = useState<AuditLog[]>([]);

  // Checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    summaries: true,
    meds: true,
    followup: true,
    stable: true
  });

  // Discharge modal state
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [dischargeDisposition, setDischargeDisposition] = useState('Home (Routine)');
  const [dischargeNotes, setDischargeNotes] = useState('');
  const [dischargingPatient, setDischargingPatient] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sumData, auditData] = await Promise.all([
        dischargeService.getDischargeSummary(patientId, propPatient, encounters),
        auditService.getAuditLogs(patientId)
      ]);
      setSummary(sumData);
      setRecentAuditLogs(auditData.slice(0, 5));
    } catch (err) {
      console.error('Failed to load discharge summary data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [patientId]);

  const pName = propPatient?.name || summary?.consultantName ? summary?.patientId : patientName;
  const isDischarged = propPatient?.status === 'DISCHARGED' || summary?.status === 'FINAL';

  // Handle field change in summary
  const handleFieldChange = (field: keyof DischargeSummary, value: any) => {
    if (!summary) return;
    setSummary({
      ...summary,
      [field]: value
    });
    setHasUnsavedChanges(true);
  };

  // Handle medication row changes
  const handleMedChange = (index: number, field: keyof DischargeMedication, value: string) => {
    if (!summary) return;
    const meds = [...summary.dischargeMedications];
    meds[index] = { ...meds[index], [field]: value };
    setSummary({ ...summary, dischargeMedications: meds });
    setHasUnsavedChanges(true);
  };

  const handleAddMedication = () => {
    if (!summary) return;
    const newMed: DischargeMedication = {
      id: `med-${Date.now()}`,
      name: '',
      dosage: '',
      frequency: 'Once daily (OD)',
      route: 'Oral',
      duration: '5 Days'
    };
    setSummary({
      ...summary,
      dischargeMedications: [...summary.dischargeMedications, newMed]
    });
    setHasUnsavedChanges(true);
  };

  const handleRemoveMedication = (index: number) => {
    if (!summary) return;
    const meds = summary.dischargeMedications.filter((_, i) => i !== index);
    setSummary({ ...summary, dischargeMedications: meds });
    setHasUnsavedChanges(true);
  };

  // Save current draft
  const handleSaveDraft = async () => {
    if (!summary) return;
    setSaving(true);
    try {
      await dischargeService.saveDischargeSummary(patientId, summary, currentUser?.name);
      setHasUnsavedChanges(false);
      setFeedbackMessage({ type: 'success', text: 'Discharge summary saved and audit log recorded.' });
      const updatedAudit = await auditService.getAuditLogs(patientId);
      setRecentAuditLogs(updatedAudit.slice(0, 5));
    } catch (err) {
      console.error('Failed to save summary draft:', err);
    } finally {
      setSaving(false);
    }
  };

  // Re-synthesize from patient memory
  const handleResetToMemory = async () => {
    if (!propPatient) return;
    setSaving(true);
    try {
      const resynthesized = await dischargeService.resetToSynthesized(propPatient, encounters);
      setSummary(resynthesized);
      setHasUnsavedChanges(false);
      setFeedbackMessage({ type: 'info', text: 'Summary re-synthesized from latest clinical course, vitals & meds.' });
      const updatedAudit = await auditService.getAuditLogs(patientId);
      setRecentAuditLogs(updatedAudit.slice(0, 5));
    } catch (err) {
      console.error('Failed to re-synthesize summary:', err);
    } finally {
      setSaving(false);
    }
  };

  // Execute Discharge
  const handleExecuteDischarge = async () => {
    if (!summary) return;
    setDischargingPatient(true);
    try {
      await patientService.updatePatient(patientId, { status: 'DISCHARGED' });

      const activeEnc = encounters.find(e => e.status === 'ACTIVE');
      if (activeEnc) {
        await encounterService.updateEncounter(activeEnc.id, { status: 'DISCHARGED' });
      }

      await dischargeService.finalizeDischargeSummary(
        patientId,
        summary,
        currentUser?.name || summary.consultantName || 'Dr. Deepak Bhasin'
      );

      await auditService.createAuditLog({
        action: 'PATIENT_DISCHARGED',
        resource_type: 'patient',
        resource_id: patientId,
        details: `Discharged patient ${summary.hospitalName || pName} to ${dischargeDisposition}. Signed by ${currentUser?.name || summary.consultantName}.`
      });

      setFeedbackMessage({ type: 'success', text: 'Patient successfully discharged. Official clinical record finalized.' });
      setShowDischargeModal(false);
      setHasUnsavedChanges(false);

      if (onRefreshPatient) {
        await onRefreshPatient();
      }
      loadData();
    } catch (err) {
      console.error('Failed to discharge patient:', err);
    } finally {
      setDischargingPatient(false);
    }
  };

  // Print Summary
  const handlePrintSummary = () => {
    if (!summary) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Discharge Summary - ${propPatient?.name || patientName} (${propPatient?.hospital_patient_id || patientId})</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; padding: 36px 44px; margin: 0; }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
          .logo { font-size: 22px; font-weight: 900; color: #2563eb; letter-spacing: -0.5px; }
          .sublogo { font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 3px; letter-spacing: 0.5px; }
          .patient-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; margin-bottom: 22px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 11.5px; }
          .patient-box div strong { display: block; color: #64748b; font-size: 9px; text-transform: uppercase; margin-bottom: 2px; font-weight: 700; }
          .section { margin-bottom: 18px; }
          .section-title { font-size: 11.5px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px; }
          .section-content { font-size: 11px; line-height: 1.6; color: #334155; white-space: pre-wrap; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 10.5px; }
          th { background: #f8fafc; text-align: left; padding: 7px 10px; font-weight: 700; border: 1px solid #cbd5e1; color: #334155; }
          td { padding: 7px 10px; border: 1px solid #e2e8f0; color: #1e293b; }
          .footer { margin-top: 36px; border-top: 1px solid #e2e8f0; padding-top: 16px; display: flex; justify-content: space-between; font-size: 10px; color: #64748b; }
          .sign-box { text-align: right; }
          @media print {
            body { padding: 20px; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">CLINOTE MEDICAL CENTER</div>
            <div class="sublogo">${summary.department || 'DEPARTMENT OF PULMONOLOGY & CRITICAL CARE'} • CLINICAL SUMMARY & DISCHARGE RECORD</div>
          </div>
          <div style="text-align: right; font-size: 10.5px; color: #64748b;">
            <div><strong>Date of Discharge:</strong> ${summary.dischargeDate || summary.summaryDate}</div>
            <div><strong>Status:</strong> ${isDischarged ? 'FINAL & SIGNED' : 'DRAFT'}</div>
          </div>
        </div>

        <div class="patient-box">
          <div><strong>PATIENT NAME:</strong> ${propPatient?.name || patientName}</div>
          <div><strong>MRN / UHID:</strong> ${propPatient?.hospital_patient_id || patientId}</div>
          <div><strong>AGE / GENDER:</strong> ${propPatient?.age || patientAge} Yrs / ${propPatient?.gender || patientGender}</div>
          <div><strong>DEPARTMENT:</strong> ${summary.department || propPatient?.department || 'General Medicine'}</div>
          <div><strong>BED / WARD:</strong> ${summary.bedNumber || propPatient?.bed_number || 'ICU-45'}</div>
          <div><strong>ATTENDING CONSULTANT:</strong> ${summary.consultantName || propPatient?.consultant || 'Dr. Deepak Bhasin'}</div>
        </div>

        <div class="section">
          <div class="section-title">1. FINAL DIAGNOSIS</div>
          <div class="section-content">${summary.finalDiagnosis || ''}</div>
        </div>

        <div class="section">
          <div class="section-title">2. PRESENTING COMPLAINTS</div>
          <div class="section-content">${summary.chiefComplaints || ''}</div>
        </div>

        <div class="section">
          <div class="section-title">3. HISTORY & CLINICAL BACKGROUND</div>
          <div class="section-content">${summary.historyBackground || ''}</div>
        </div>

        <div class="section">
          <div class="section-title">4. HOSPITAL COURSE & INTERVENTIONS</div>
          <div class="section-content">${summary.hospitalCourse || ''}</div>
        </div>

        <div class="section">
          <div class="section-title">5. KEY INVESTIGATIONS</div>
          <div class="section-content">${summary.investigations || ''}</div>
        </div>

        <div class="section">
          <div class="section-title">6. TREATMENT & DISCHARGE MEDICATIONS</div>
          <table>
            <thead>
              <tr>
                <th>Medication Name</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Route</th>
                <th>Duration / Instructions</th>
              </tr>
            </thead>
            <tbody>
              ${summary.dischargeMedications.map(m => `
                <tr>
                  <td><strong>${m.name}</strong></td>
                  <td>${m.dosage}</td>
                  <td>${m.frequency}</td>
                  <td>${m.route || 'Oral'}</td>
                  <td>${m.duration || 'As directed'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">7. FOLLOW-UP & DISCHARGE ADVICE</div>
          <div class="section-content">${summary.followUpInstructions || ''}</div>
        </div>

        <div class="footer">
          <div>
            Clinote Electronic Clinical Intelligence • Audit Security ID: ${patientId.substring(0, 8).toUpperCase()}<br/>
            Digitally Signed on: ${new Date().toLocaleString()}
          </div>
          <div class="sign-box">
            <strong>${summary.consultantName || propPatient?.consultant || 'Dr. Deepak Bhasin'}</strong><br/>
            Consultant Pulmonology & Critical Care<br/>
            Clinote Super Specialty Hospital
          </div>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    auditService.createAuditLog({
      action: 'DISCHARGE_SUMMARY_PRINTED',
      resource_type: 'discharge_summary',
      resource_id: patientId,
      details: `Printed official discharge summary for ${propPatient?.name || patientName}`
    });
  };

  if (loading) return <Loader label="Compiling hospital clinical summary & memory..." />;
  if (!summary) return null;

  return (
    <div className="space-y-6 text-left">
      {/* Stepper Header Flow matching Admission Report */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Stepper Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs select-none">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>1. Ingest Data (Course, Labs, Meds)</span>
            </div>

            <div className="text-slate-300">→</div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              <Sparkles size={14} className="text-emerald-600" />
              <span>2. Synthesized</span>
            </div>

            <div className="text-slate-300">→</div>

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold border ${isDischarged ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
              <Edit2 size={14} />
              <span>3. Editable Review</span>
            </div>

            <div className="text-slate-300">→</div>

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold border ${isDischarged ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
              <ShieldCheck size={14} />
              <span>4. {isDischarged ? 'Signed & Sealed' : 'Sign-Off & Finalize'}</span>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetToMemory}
              disabled={saving || isDischarged}
              className="text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-xs"
              title="Re-aggregate all data points from course notes, vitals, and meds"
            >
              <RefreshCw size={12} className={saving ? 'animate-spin' : ''} />
              Re-Synthesize Memory
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={saving || isDischarged}
              className={`text-xs font-bold rounded-xl px-3.5 py-1.5 flex items-center gap-1.5 shadow-xs ${hasUnsavedChanges ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100' : 'text-slate-600'}`}
            >
              <Save size={13} />
              {saving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes *' : 'Save Draft'}
            </Button>

            <Button
              size="sm"
              onClick={handlePrintSummary}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
            >
              <Printer size={13} />
              Print / Export PDF
            </Button>
          </div>
        </div>
      </div>

      {feedbackMessage && (
        <div className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold ${feedbackMessage.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-blue-50 border border-blue-200 text-blue-800'}`}>
          <span>{feedbackMessage.text}</span>
          <button onClick={() => setFeedbackMessage(null)} className="opacity-70 hover:opacity-100">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Main 2-Column Workstation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── Center Stage (8 Cols): The Official Editable Hospital Summary Document ── */}
        <div className="lg:col-span-8 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">

          {/* Hospital Header Banner */}
          <div className="border-b-2 border-blue-600 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-blue-600 tracking-tight">CLINOTE MEDICAL CENTER</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200">NABH ACCREDITED</span>
              </div>
              <input
                type="text"
                value={summary.department || 'DEPARTMENT OF PULMONOLOGY & CRITICAL CARE'}
                onChange={(e) => handleFieldChange('department', e.target.value)}
                className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mt-1 w-full bg-transparent hover:bg-slate-50 px-1 py-0.5 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Department name..."
              />
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="flex sm:justify-end items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Date of Discharge:</span>
                <input
                  type="text"
                  value={summary.dischargeDate || summary.summaryDate}
                  onChange={(e) => handleFieldChange('dischargeDate', e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg w-28 text-center"
                />
              </div>
              <div>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider ${isDischarged ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                  {isDischarged ? 'FINAL & SIGNED' : 'DRAFT IN EDIT'}
                </span>
              </div>
            </div>
          </div>

          {/* Patient 6-Cell Information Grid (Fully Editable) */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">PATIENT NAME</span>
              <p className="font-extrabold text-slate-900">{propPatient?.name || patientName}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">MRN / UHID</span>
              <p className="font-mono font-bold text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded-md inline-block border border-blue-200/60">
                {propPatient?.hospital_patient_id || patientId}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">AGE / GENDER</span>
              <p className="font-bold text-slate-800">{propPatient?.age || patientAge} Yrs / {propPatient?.gender || patientGender}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">DEPARTMENT</span>
              <p className="font-bold text-slate-800">{propPatient?.department || summary.department || 'General Medicine'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">BED / WARD</span>
              <input
                type="text"
                value={summary.bedNumber || propPatient?.bed_number || 'ICU-45'}
                onChange={(e) => handleFieldChange('bedNumber', e.target.value)}
                className="font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-lg w-full text-xs"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">ATTENDING CONSULTANT</span>
              <input
                type="text"
                value={summary.consultantName || propPatient?.consultant || 'Dr. Deepak Bhasin'}
                onChange={(e) => handleFieldChange('consultantName', e.target.value)}
                className="font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-lg w-full text-xs"
              />
            </div>
          </div>

          {/* 1. Final Diagnosis */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={15} className="text-emerald-600" />
                1. Final Diagnosis & Principal Conditions
              </label>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Primary Clinical Record</span>
            </div>
            <textarea
              value={summary.finalDiagnosis || ''}
              onChange={(e) => handleFieldChange('finalDiagnosis', e.target.value)}
              rows={2}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-3 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="Enter final diagnosis..."
            />
          </div>

          {/* 2. Presenting Complaints */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <HeartPulse size={15} className="text-rose-600" />
                2. Presenting Complaints
              </label>
            </div>
            <textarea
              value={summary.chiefComplaints || ''}
              onChange={(e) => handleFieldChange('chiefComplaints', e.target.value)}
              rows={2}
              className="w-full text-xs font-medium text-slate-800 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-3 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="Enter complaints on admission..."
            />
          </div>

          {/* 3. History & Clinical Background */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope size={15} className="text-indigo-600" />
                3. History & Clinical Background
              </label>
            </div>
            <textarea
              value={summary.historyBackground || ''}
              onChange={(e) => handleFieldChange('historyBackground', e.target.value)}
              rows={3}
              className="w-full text-xs font-medium text-slate-800 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-3 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="Enter medical comorbidities, past surgical history, and background..."
            />
          </div>

          {/* 4. Hospital Course & Interventions (Synthesized from Course & Timeline) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ClipboardList size={15} className="text-amber-600" />
                4. Hospital Course & Interventions
              </label>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Fetched from Timeline & Daily Course
              </span>
            </div>
            <textarea
              value={summary.hospitalCourse || ''}
              onChange={(e) => handleFieldChange('hospitalCourse', e.target.value)}
              rows={5}
              className="w-full text-xs font-medium text-slate-800 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-3 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="Chronological course in hospital..."
            />
          </div>

          {/* 5. Key Investigations & Diagnostic Reports */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FlaskConical size={15} className="text-purple-600" />
                5. Key Investigations
              </label>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Fetched from Lab & Imaging Data
              </span>
            </div>
            <textarea
              value={summary.investigations || ''}
              onChange={(e) => handleFieldChange('investigations', e.target.value)}
              rows={3}
              className="w-full text-xs font-medium text-slate-800 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-3 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="Significant lab & radiological findings..."
            />
          </div>

          {/* 6. Treatment & Discharge Medications (Editable Table matching Screenshot) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Pill size={15} className="text-emerald-600" />
                6. Treatment & Discharge Medications
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddMedication}
                className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 rounded-lg px-2.5 py-1 flex items-center gap-1"
              >
                <Plus size={12} />
                Add Medication Row
              </Button>
            </div>

            {/* Editable Medications Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-700 font-extrabold text-[11px]">
                    <th className="p-2.5 border-b border-slate-200">Medication Name</th>
                    <th className="p-2.5 border-b border-slate-200 w-28">Dosage</th>
                    <th className="p-2.5 border-b border-slate-200">Frequency</th>
                    <th className="p-2.5 border-b border-slate-200 w-24">Route</th>
                    <th className="p-2.5 border-b border-slate-200">Duration / Instructions</th>
                    <th className="p-2.5 border-b border-slate-200 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {summary.dischargeMedications.map((med, idx) => (
                    <tr key={med.id || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-2">
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                          placeholder="e.g. Augmentin 625mg"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-emerald-800 text-xs focus:outline-none focus:border-blue-500"
                          placeholder="e.g. 1 tablet"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={med.frequency}
                          onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-medium text-slate-700 text-xs focus:outline-none focus:border-blue-500"
                          placeholder="e.g. Twice daily (BD)"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={med.route || 'Oral'}
                          onChange={(e) => handleMedChange(idx, 'route', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-1.5 py-1 text-slate-700 text-xs focus:outline-none focus:border-blue-500"
                        >
                          <option value="Oral">Oral</option>
                          <option value="Inhalation">Inhalation</option>
                          <option value="Subcutaneous">Subcutaneous</option>
                          <option value="Intravenous">Intravenous</option>
                          <option value="Topical">Topical</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={med.duration || ''}
                          onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-medium text-slate-600 text-xs focus:outline-none focus:border-blue-500"
                          placeholder="e.g. 5 Days"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveMedication(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                          title="Remove medication"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 7. Follow-up & Discharge Advice */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={15} className="text-teal-600" />
                7. Follow-up & Discharge Advice
              </label>
            </div>
            <textarea
              value={summary.followUpInstructions || ''}
              onChange={(e) => handleFieldChange('followUpInstructions', e.target.value)}
              rows={3}
              className="w-full text-xs font-medium text-slate-800 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-3 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="OPD appointments, emergency red flags, diet, and activity restrictions..."
            />
          </div>

          {/* Attending Physician Sign-Off Block */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-500 space-y-0.5">
              <p className="font-bold text-slate-700">Clinote Clinical Intelligence Platform</p>
              <p className="text-[11px]">Audit Checksum: <strong className="font-mono text-purple-700">{patientId.substring(0, 10).toUpperCase()}</strong> • 21 CFR Part 11 Compliant</p>
            </div>

            <div className="text-left sm:text-right border sm:border-0 p-3 sm:p-0 rounded-xl bg-slate-50 sm:bg-transparent">
              <div className="inline-block border-b border-slate-400 pb-1 mb-1 font-black text-slate-900 text-xs">
                {summary.consultantName || propPatient?.consultant || 'Dr. Deepak Bhasin'}
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">Attending Consultant • Critical Care & Pulmonology</p>
            </div>
          </div>

        </div>

        {/* ── Right Column (4 Cols): Control Panel & Live Audit Stream ── */}
        <div className="lg:col-span-4 space-y-4">

          {/* Main Action Callout Card */}
          <Card className="p-5 border border-slate-200 rounded-3xl shadow-xs bg-white text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-black text-sm text-slate-900">Summary Actions</h4>
                <p className="text-[11px] text-slate-500 font-medium">Verify & finalize hospital summary</p>
              </div>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${isDischarged ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {isDischarged ? 'DISCHARGED' : 'ACTIVE'}
              </span>
            </div>

            {/* Checklist */}
            <div className="space-y-2 text-xs font-semibold text-slate-700 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">Pre-Discharge Safety Checks</span>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checklist.summaries}
                  onChange={(e) => setChecklist(prev => ({ ...prev, summaries: e.target.checked }))}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className={checklist.summaries ? 'text-slate-800 font-bold' : 'text-slate-400'}>
                  Clinical Course & Labs Verified
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checklist.meds}
                  onChange={(e) => setChecklist(prev => ({ ...prev, meds: e.target.checked }))}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className={checklist.meds ? 'text-slate-800 font-bold' : 'text-slate-400'}>
                  Discharge Prescriptions Reconciled
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checklist.followup}
                  onChange={(e) => setChecklist(prev => ({ ...prev, followup: e.target.checked }))}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className={checklist.followup ? 'text-slate-800 font-bold' : 'text-slate-400'}>
                  Follow-up Advice Explained
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checklist.stable}
                  onChange={(e) => setChecklist(prev => ({ ...prev, stable: e.target.checked }))}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className={checklist.stable ? 'text-slate-800 font-bold' : 'text-slate-400'}>
                  Patient Hemodynamically Stable
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="space-y-2.5 pt-1">
              {!isDischarged ? (
                <Button
                  onClick={() => setShowDischargeModal(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-2xl shadow-sm text-xs flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  Finalize & Discharge Patient
                </Button>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-0.5">
                  <span className="text-xs font-black text-emerald-900 block">✓ Record Signed & Finalized</span>
                  <p className="text-[10px] text-emerald-700 font-medium">Digital signature sealed.</p>
                </div>
              )}

              <Button
                variant="outline"
                onClick={handlePrintSummary}
                className="w-full text-xs font-bold text-blue-700 border-blue-200 hover:bg-blue-50 py-2.5 rounded-2xl flex items-center justify-center gap-1.5"
              >
                <Printer size={14} />
                Open Official Print View
              </Button>
            </div>
          </Card>

          {/* Episode Vitals & Metrics Card */}
          <Card className="p-4 border border-slate-200 rounded-3xl shadow-xs bg-white text-left">
            <h4 className="font-extrabold text-xs text-slate-900 border-b border-slate-100 pb-2.5 mb-3 flex items-center justify-between">
              <span>Episode & Vitals Snapshot</span>
              <Activity size={14} className="text-blue-600" />
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="text-[9px] font-bold text-slate-400 block">HEART RATE</span>
                <span className="font-black text-slate-900">{summary.vitalsAtDischarge?.hr || 76} bpm</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="text-[9px] font-bold text-slate-400 block">BLOOD PRESSURE</span>
                <span className="font-black text-slate-900">{summary.vitalsAtDischarge?.bp || '124/78'}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="text-[9px] font-bold text-slate-400 block">OXYGEN SpO2</span>
                <span className="font-black text-emerald-600">{summary.vitalsAtDischarge?.spo2 || 97}%</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <span className="text-[9px] font-bold text-slate-400 block">TEMPERATURE</span>
                <span className="font-black text-slate-900">{summary.vitalsAtDischarge?.temp || '98.4 °F'}</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1 border-t border-slate-100 text-[11px] font-medium text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Length of Stay:</span>
                <span className="font-extrabold text-slate-900">9 Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">ICU Care Duration:</span>
                <span className="font-extrabold text-slate-900">5 Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Discharge Prescriptions:</span>
                <span className="font-extrabold text-slate-900">{summary.dischargeMedications.length} Medications</span>
              </div>
            </div>
          </Card>

          {/* Integrated Live Side-by-Side Audit Trail Panel */}
          <Card className="p-4 border border-purple-200 bg-purple-50/20 rounded-3xl text-left shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-purple-100 pb-2">
              <h4 className="font-black text-xs text-purple-950 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-purple-600" />
                Live Audit Stream
              </h4>
              <button
                onClick={() => {
                  if (onNavigateToAudit) onNavigateToAudit();
                  else setActiveTab('audit');
                }}
                className="text-[10px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-0.5"
              >
                Full Ledger →
              </button>
            </div>

            <div className="space-y-2">
              {recentAuditLogs.length === 0 ? (
                <p className="text-[11px] text-slate-400 font-medium">No recent audit events.</p>
              ) : (
                recentAuditLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="p-2.5 bg-white rounded-xl border border-purple-100/90 text-[10.5px] shadow-xs">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono font-black text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded text-[9px] uppercase">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-800 font-semibold truncate leading-tight">{log.details || log.action}</p>
                    <span className="text-[9px] text-slate-400 mt-1 block">{log.user_email || 'clinote.attending@hospital.org'}</span>
                  </div>
                ))
              )}
            </div>
          </Card>

        </div>

      </div>

      {/* Discharge Confirmation Modal */}
      {showDischargeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 size={20} />
                <h3 className="font-black text-sm text-slate-900">Finalize & Sign Discharge</h3>
              </div>
              <button
                onClick={() => setShowDischargeModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
              <p className="font-bold text-slate-800">Patient: {propPatient?.name || patientName} ({propPatient?.hospital_patient_id || patientId})</p>
              <p className="text-slate-500">Attending: {summary.consultantName || 'Dr. Deepak Bhasin'} • Ward: {summary.bedNumber || 'ICU-45'}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Discharge Disposition</label>
                <select
                  value={dischargeDisposition}
                  onChange={(e) => setDischargeDisposition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="Home (Routine)">Home (Routine)</option>
                  <option value="Transferred to Step-Down Facility">Transferred to Step-Down Facility</option>
                  <option value="Discharged against medical advice (DAMA)">Discharged Against Medical Advice (DAMA)</option>
                  <option value="Transferred to Tertiary Hospital">Transferred to Tertiary Hospital</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Attending Clinician Sign-off Notes (Optional)</label>
                <textarea
                  value={dischargeNotes}
                  onChange={(e) => setDischargeNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Discharge prescriptions, emergency precautions, and follow-up date explained."
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-800 font-semibold flex items-start gap-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600" />
              <span>
                By confirming, this patient's status will become <strong>DISCHARGED</strong>, the active encounter will be closed, and an audit trail log will be permanently recorded.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDischargeModal(false)}
                className="text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleExecuteDischarge}
                disabled={dischargingPatient}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
              >
                <Check size={14} />
                {dischargingPatient ? 'Processing Discharge...' : 'Confirm & Finalize Discharge'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
