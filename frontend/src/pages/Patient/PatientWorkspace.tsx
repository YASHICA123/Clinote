import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { patientService } from '../../features/patient/services/patientService';
import { courseService } from '../../features/course/services/courseService';
import { medicationService } from '../../features/medication/services/medicationService';
import type { Patient, Medication } from '../../types';

// Import tab subcomponents
import { MedicationTab } from '../../features/medication/components/MedicationTab';
import { InvestigationTab } from '../../features/investigation/components/InvestigationTab';
import { ReportsTab } from '../../features/reports/components/ReportsTab';
import { CourseTab } from '../../features/course/components/CourseTab';
import { DischargeTab } from '../../features/discharge/components/DischargeTab';
import { VitalsTrendTab } from '../../features/timeline/components/VitalsTrendTab';
import { AuditTab } from '../../features/audit/components/AuditTab';

// Onboarding and Overview subcomponents
import { UploadAssessmentModal } from '../../features/patient/components/UploadAssessmentModal';
import { AddMedicationModal } from '../../features/patient/components/AddMedicationModal';
import { AddProgressNoteModal } from '../../features/patient/components/AddProgressNoteModal';
import { OverviewTab } from '../../features/overview/components/OverviewTab';

// UI components
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { Badge } from '../../components/ui/Badge';

// Icons
import { 
  Mic, 
  Upload, 
  ArrowLeft,
  CheckCircle2,
  FileText,
  AlertCircle,
  Calendar,
  User,
  FolderOpen,
  ClipboardList,
  Pill,
  Info,
  Activity,
  FlaskConical,
  ShieldCheck
} from 'lucide-react';

// Custom Lungs Illustration matching design details
const LungsIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 160 140" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Trachea & Bronchi */}
    <path d="M80 15V55" stroke="#93C5FD" strokeWidth="5" strokeLinecap="round" opacity="0.8"/>
    <path d="M80 55C80 65 72 75 62 80" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
    <path d="M80 55C80 65 88 75 98 80" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
    
    {/* Left Lung Outer */}
    <path d="M72 50C52 40 22 55 22 90C22 120 47 130 67 122C72 120 74 100 72 70" fill="url(#leftLungGrad)" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
    
    {/* Right Lung Outer */}
    <path d="M88 50C108 40 138 55 138 90C138 120 113 130 93 122C88 120 86 100 88 70" fill="url(#rightLungGrad)" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
    
    {/* Internal Branches (Stylized Lungs Airway Tree) */}
    <path d="M62 80C52 82 45 78 40 72" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M62 80C58 90 50 96 42 98" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M98 80C108 82 115 78 120 72" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M98 80C102 90 110 96 118 98" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>

    {/* Dot grid decoration */}
    <circle cx="145" cy="20" r="1.5" fill="#BFDBFE" opacity="0.7" />
    <circle cx="153" cy="20" r="1.5" fill="#BFDBFE" opacity="0.7" />
    <circle cx="145" cy="28" r="1.5" fill="#BFDBFE" opacity="0.7" />
    <circle cx="153" cy="28" r="1.5" fill="#BFDBFE" opacity="0.7" />
    <circle cx="145" cy="36" r="1.5" fill="#BFDBFE" opacity="0.7" />
    <circle cx="153" cy="36" r="1.5" fill="#BFDBFE" opacity="0.7" />
    
    <defs>
      <linearGradient id="leftLungGrad" x1="22" y1="50" x2="72" y2="122" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DBEAFE" stopOpacity="0.8"/>
        <stop offset="1" stopColor="#EFF6FF" stopOpacity="0.1"/>
      </linearGradient>
      <linearGradient id="rightLungGrad" x1="138" y1="50" x2="88" y2="122" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DBEAFE" stopOpacity="0.8"/>
        <stop offset="1" stopColor="#EFF6FF" stopOpacity="0.1"/>
      </linearGradient>
    </defs>
  </svg>
);

export const PatientWorkspace: React.FC = () => {
  const { 
    activePatientId, 
    setActivePatientId, 
    setCurrentPage, 
    activeTab, 
    setActiveTab 
  } = useApp();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedOnboardingTasks, setCompletedOnboardingTasks] = useState<string[]>([]);
  const [showUploadAssessmentModal, setShowUploadAssessmentModal] = useState(false);
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);
  const [showAddProgressNoteModal, setShowAddProgressNoteModal] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);

  // Helper to extract patient initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Fetch patient details on load
  const loadPatientData = async () => {
    if (!activePatientId) return;
    setLoading(true);
    try {
      const data = await patientService.getPatientById(activePatientId);
      if (data) {
        setPatient(data);
        const meds = await medicationService.getMedications(data.id);
        setMedications(meds);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientData();
  }, [activePatientId]);

  const handleSaveAssessment = async (data: {
    vitals: { hr: number; bp: string; rr: number; spo2: number; temp: string };
    diagnoses: string[];
    suspectedCause: string;
    pastHistory: string[];
  }) => {
    if (!patient) return;
    try {
      await patientService.updatePatient(patient.id, {
        vitals: data.vitals,
        diagnoses: data.diagnoses,
        suspectedCause: data.suspectedCause,
        pastHistory: data.pastHistory
      });
      
      const newTasks = [...completedOnboardingTasks, 'upload'];
      setCompletedOnboardingTasks(newTasks);
      
      if (newTasks.includes('upload') && newTasks.includes('medication')) {
        await patientService.updatePatient(patient.id, { isNew: false });
        setActiveTab('overview');
      }
      
      const updated = await patientService.getPatientById(patient.id);
      if (updated) setPatient(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveMedsFromVoice = async (meds: { name: string; dosage: string; frequency: string }[]) => {
    if (!patient) return;
    try {
      for (const med of meds) {
        await medicationService.addMedication(patient.id, {
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          route: 'IV',
          status: 'Active',
          startDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          prescriber: 'Dr. Deepak Bhasin'
        });
      }

      const newTasks = [...completedOnboardingTasks, 'medication'];
      setCompletedOnboardingTasks(newTasks);

      if (newTasks.includes('upload') && newTasks.includes('medication')) {
        await patientService.updatePatient(patient.id, { isNew: false });
        setActiveTab('overview');
      }
      
      const updated = await patientService.getPatientById(patient.id);
      if (updated) setPatient(updated);
      
      const updatedMeds = await medicationService.getMedications(patient.id);
      setMedications(updatedMeds);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProgressNote = async (noteData: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  }) => {
    if (!patient) return;
    try {
      const formattedNoteText = `Subjective:\n- ${noteData.subjective}\n\nObjective:\n- ${noteData.objective}\n\nAssessment:\n- ${noteData.assessment}\n\nPlan:\n- ${noteData.plan}`;

      // Helper to parse vitals from the Objective text
      const parseVitalsFromText = (objectiveText: string, currentVitals?: any) => {
        const vitals = {
          hr: currentVitals?.hr || 102,
          bp: currentVitals?.bp || '128/76',
          rr: currentVitals?.rr || 24,
          spo2: currentVitals?.spo2 || 92,
          temp: currentVitals?.temp || '37.2 °C'
        };

        const spo2Match = objectiveText.match(/(?:spo2|spO₂|spo₂)\s*[:\s]?\s*(\d+)/i);
        if (spo2Match) {
          vitals.spo2 = parseInt(spo2Match[1]);
        }

        const bpMatch = objectiveText.match(/(\d{2,3}\/\d{2,3})/);
        if (bpMatch) {
          vitals.bp = bpMatch[1];
        }

        const hrMatch = objectiveText.match(/(?:hr|heart rate)\s*[:\s]?\s*(\d+)/i) || objectiveText.match(/(\d+)\s*bpm/i);
        if (hrMatch) {
          vitals.hr = parseInt(hrMatch[1]);
        }

        const rrMatch = objectiveText.match(/(?:rr|resp rate)\s*[:\s]?\s*(\d+)/i) || objectiveText.match(/(\d+)\s*\/min/i);
        if (rrMatch) {
          vitals.rr = parseInt(rrMatch[1]);
        }

        const tempMatch = objectiveText.match(/(?:temp|temperature)\s*[:\s]?\s*([\d.]+)/i) || objectiveText.match(/([\d.]+)\s*°/);
        if (tempMatch) {
          vitals.temp = tempMatch[1].includes('°') ? tempMatch[1] : `${tempMatch[1]} °C`;
        }

        return vitals;
      };

      const newVitals = parseVitalsFromText(noteData.objective, patient.vitals);

      await courseService.addCourseEntry(patient.id, {
        date: new Date().toLocaleString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        note: formattedNoteText,
        doctorId: 'doc-1',
        doctorName: 'Dr. Deepak Bhasin',
        vitals: newVitals
      });

      await patientService.updatePatient(patient.id, {
        vitals: newVitals
      });

      const updated = await patientService.getPatientById(patient.id);
      if (updated) setPatient(updated);

      setActiveTab('course');
    } catch (err) {
      console.error(err);
    }
  };

  const bypassOnboarding = async () => {
    if (!patient) return;
    await patientService.updatePatient(patient.id, { isNew: false });
    const updated = await patientService.getPatientById(patient.id);
    if (updated) setPatient(updated);
    setActiveTab('overview');
  };

  if (loading) return <Loader label="Loading patient clinical workspace..." fullscreen />;
  if (!patient) {
    return (
      <div className="py-12 text-center text-slate-500 space-y-4">
        <AlertCircle size={36} className="mx-auto text-red-500" />
        <p className="font-semibold text-xs">Patient records not found.</p>
        <Button variant="outline" size="sm" onClick={() => setCurrentPage('dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Consistent ID formatting matching the style
  const formattedID = patient.displayId ? `ID: ${patient.displayId}` : `ID: MHLL.${patient.id.substring(Math.max(0, patient.id.length - 6))}`;
  const formattedIP = patient.ipNumber ? `IP No. ${patient.ipNumber}` : `IP No. 269${patient.id.substring(Math.max(0, patient.id.length - 3))}`;

  return (
    <div className="space-y-6 text-left">
      
      {/* Back to dashboard */}
      <div className="space-y-4">
        <button 
          onClick={() => {
            setActivePatientId(null);
            setCurrentPage('dashboard');
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </button>

        {/* Premium Patient Details Header Banner */}
        <Card className="relative overflow-hidden bg-white border border-slate-100 p-6 rounded-3xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-6">
            
            {/* Left side details */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl select-none shrink-0 ring-4 ring-blue-50/50">
                {getInitials(patient.name)}
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">{patient.name}</h2>
                  <div className="flex gap-1.5">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 font-bold border-transparent px-2.5 py-0.5 rounded-lg text-[10px]">
                      {patient.status} {patient.bedNumber}
                    </Badge>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 font-bold border-transparent px-2.5 py-0.5 rounded-lg text-[10px]">
                      Stable
                    </Badge>
                  </div>
                </div>
                
                {/* Horizontal row of details */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <User size={13} className="text-slate-400" />
                    {patient.age} Years, {patient.gender === 'M' ? 'Male' : 'Female'}
                  </span>
                  <span className="h-3 w-[1px] bg-slate-200 hidden sm:block"></span>
                  <span className="flex items-center gap-1.5">
                    <FolderOpen size={13} className="text-slate-400" />
                    {formattedID}
                  </span>
                  <span className="h-3 w-[1px] bg-slate-200 hidden sm:block"></span>
                  <span className="flex items-center gap-1.5">
                    <FileText size={13} className="text-slate-400" />
                    {formattedIP}
                  </span>
                  <span className="h-3 w-[1px] bg-slate-200 hidden sm:block"></span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-400" />
                    Admitted: {patient.admissionDate}
                  </span>
                  <span className="h-3 w-[1px] bg-slate-200 hidden sm:block"></span>
                  <span className="flex items-center gap-1.5">
                    <User size={13} className="text-slate-400" />
                    Consultant: {patient.consultant}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side Actions / Lungs Graphic Illustration */}
            <div className="flex items-center gap-4 relative z-10 shrink-0">
              {!patient.isNew && (
                <button
                  className="bg-[#fcfaff] border border-[#ecdffd] text-purple-750 hover:bg-purple-50 font-bold text-[10px] flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl shadow-sm mr-32 shrink-0 transition-all active:scale-[0.98] cursor-pointer hover:shadow-md"
                  onClick={() => {
                    setShowAddProgressNoteModal(true);
                  }}
                >
                  <Mic size={12} className="text-purple-600" />
                  + Add Daily Progress Note
                </button>
              )}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 md:opacity-100 hidden md:block select-none pointer-events-none pr-4">
                <LungsIllustration className="w-40 h-32" />
              </div>
            </div>

          </div>
        </Card>
      </div>

      {/* Conditional Layout Routing: Onboarding Workspace vs Full Tab Workspace */}
      {patient.isNew ? (
        
        /* Initial Setup Workspace Landing Page (New Patient Empty State Actions) */
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            
            {/* Card 1: Upload Initial Assessment */}
            <div className={`border rounded-3xl p-6 flex flex-col justify-between items-center text-center space-y-5 transition-all ${
              completedOnboardingTasks.includes('upload') 
                ? 'bg-[#fffbf6] border-[#fbe9d6]' 
                : 'bg-white border-slate-100 hover:border-orange-300'
            }`}>
              
              {completedOnboardingTasks.includes('upload') ? (
                <>
                  <div className="space-y-4 flex flex-col items-center">
                    <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-orange-650">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm text-slate-900">Upload Initial Assessment</h3>
                      <p className="text-[10px] text-slate-500 font-medium px-4 leading-normal">Initial assessment scanned sheet extracted and saved.</p>
                      <span className="inline-block mt-2 px-2.5 py-0.5 bg-orange-100 text-orange-850 text-[9px] font-black rounded-lg">Completed</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 py-2.5 rounded-xl text-[10px] font-bold shadow-sm"
                    onClick={() => setShowUploadAssessmentModal(true)}
                  >
                    Edit Assessment
                  </Button>
                </>
              ) : (
                // Default Card State
                <>
                  <div className="space-y-4 flex flex-col items-center">
                    <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center">
                      <div className="w-9 h-9 bg-orange-100/60 rounded-full flex items-center justify-center text-orange-650">
                        <ClipboardList size={16} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm text-slate-900">Upload Initial Assessment</h3>
                      <p className="text-[10px] text-slate-500 font-medium px-4 leading-normal">Upload the initial assessment document scanned from admission.</p>
                      <div className="h-5" /> {/* spacing alignment */}
                    </div>
                  </div>

                  <Button 
                    variant="primary" 
                    className="w-full bg-orange-600 hover:bg-orange-755 py-2.5 rounded-xl text-[10px] font-bold shadow-sm"
                    onClick={() => setShowUploadAssessmentModal(true)}
                  >
                    <Upload size={13} className="inline mr-1" />
                    Upload Document
                  </Button>

                  <div className="text-[9px] text-orange-650 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Secure • PDF, JPG, PNG (Max 10 MB)
                  </div>
                </>
              )}
            </div>

            {/* Card 2: Add Medication */}
            <div className={`border rounded-3xl p-6 flex flex-col justify-between items-center text-center space-y-5 transition-all ${
              completedOnboardingTasks.includes('medication') 
                ? 'bg-[#f4faf7] border-[#d8f0e5]' 
                : 'bg-white border-slate-100 hover:border-emerald-300'
            }`}>
              {completedOnboardingTasks.includes('medication') ? (
                <>
                  <div className="space-y-4 flex flex-col items-center">
                    <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm text-slate-900">Add Medication</h3>
                      <p className="text-[10px] text-slate-500 font-medium px-4 leading-normal">Medications successfully processed and added to patient profile.</p>
                      <span className="inline-block mt-2 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded-lg">Completed</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 py-2.5 rounded-xl text-[10px] font-bold shadow-sm"
                    onClick={() => setShowAddMedicationModal(true)}
                  >
                    Edit Medications
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-4 flex flex-col items-center">
                    <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center">
                      <div className="w-9 h-9 bg-emerald-100/60 rounded-full flex items-center justify-center text-emerald-600">
                        <Pill size={16} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm text-slate-900">Add Medication</h3>
                      <p className="text-[10px] text-slate-500 font-medium px-4 leading-normal">Add antibiotic prescribed for the patient.</p>
                      <p className="text-[10px] text-emerald-755 font-extrabold mt-1">Only current antibiotic medications.</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    className="w-full bg-emerald-700 hover:bg-emerald-855 py-2.5 rounded-xl text-[10px] font-bold shadow-sm"
                    onClick={() => setShowAddMedicationModal(true)}
                  >
                    + Add Medication
                  </Button>

                  <div className="text-[9px] text-emerald-650 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    AI assisted • Auto fetch from voice
                  </div>
                </>
              )}
            </div>

          </div>

          {/* Quick bypass link for doctor */}
          <div className="flex justify-center pt-2">
            <button 
              onClick={bypassOnboarding}
              className="text-[10px] text-slate-400 hover:text-emerald-700 font-bold hover:underline"
            >
              Skip onboarding actions & go directly to full clinical timeline →
            </button>
          </div>
        </div>

      ) : (
         /* Full Workspace Clinical Panels (Standard Patient Records Display) */
        <div className="space-y-6">
          
          {/* Quick Info Grid Banner Card */}
          <Card className="p-4 bg-white border border-slate-100 rounded-2xl">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-xs font-semibold text-slate-500">
              
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Age / Gender</span>
                <p className="font-extrabold text-slate-800 text-[11px] truncate">{patient.age} Years, {patient.gender === 'M' ? 'Male' : 'Female'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Patient ID</span>
                <p className="font-extrabold text-slate-800 text-[11px] truncate">{patient.displayId || `MHLL.${patient.id.substring(Math.max(0, patient.id.length - 6))}`}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Consultant</span>
                <p className="font-extrabold text-slate-800 text-[11px] truncate">{patient.consultant}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Diagnosis</span>
                <p className="font-extrabold text-slate-800 text-[11px] truncate" title={patient.diagnoses?.[0] || 'Diffuse Alveolar Hemorrhage (DAH)'}>
                  {patient.diagnoses?.[0] || 'Diffuse Alveolar Hemorrhage (DAH)'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Bed</span>
                <p className="font-extrabold text-slate-800 text-[11px] truncate">{patient.bedNumber}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Admit Date</span>
                <p className="font-extrabold text-slate-800 text-[11px] truncate">{patient.admissionDate}</p>
              </div>

            </div>
          </Card>

          <div className="space-y-6">
            {/* Full-width tab panel */}
            <div className="space-y-6">
              <Card className="p-5">
                {/* Horizontal custom tab links */}
                <div className="flex border-b border-slate-100 pb-1 mb-5 overflow-x-auto gap-1 text-[11px] font-bold text-slate-400 select-none">
                  {[
                    { id: 'overview', label: 'Overview', icon: <Info size={13} className="shrink-0" />, activeClass: 'border-emerald-600 text-emerald-700 bg-emerald-50/10', inactiveClass: 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/5' },
                    { id: 'timeline', label: 'Vitals Trend', icon: <Activity size={13} className="shrink-0" />, activeClass: 'border-blue-600 text-blue-700 bg-blue-50/10', inactiveClass: 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/5' },
                    { id: 'investigations', label: 'Investigations', icon: <FlaskConical size={13} className="shrink-0" />, activeClass: 'border-purple-600 text-purple-700 bg-purple-50/10', inactiveClass: 'text-slate-500 hover:text-purple-600 hover:bg-purple-50/5' },
                    { id: 'medications', label: 'Medication', icon: <Pill size={13} className="shrink-0" />, activeClass: 'border-orange-600 text-orange-700 bg-orange-50/10', inactiveClass: 'text-slate-500 hover:text-orange-600 hover:bg-orange-50/5' },
                    { id: 'course', label: 'Course in Hospital', icon: <ClipboardList size={13} className="shrink-0" />, activeClass: 'border-teal-600 text-teal-700 bg-teal-50/10', inactiveClass: 'text-slate-500 hover:text-teal-600 hover:bg-teal-50/5' },
                    { id: 'audit', label: 'Audit Trail', icon: <ShieldCheck size={13} className="shrink-0" />, activeClass: 'border-indigo-600 text-indigo-700 bg-indigo-50/10', inactiveClass: 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/5' },
                    { id: 'discharge', label: 'Discharge', icon: <FileText size={13} className="shrink-0" />, activeClass: 'border-rose-600 text-rose-700 bg-rose-50/10', inactiveClass: 'text-slate-500 hover:text-rose-600 hover:bg-rose-50/5' }
                  ].map(tab => (
                    <button
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id as any)}
                       className={`px-4 py-2 border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 rounded-t-xl font-extrabold ${
                         activeTab === tab.id 
                            ? tab.activeClass 
                            : `${tab.inactiveClass} border-transparent`
                       }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Rendering Tab Components */}
                <div>
                  {activeTab === 'overview' && (
                    <OverviewTab 
                      patient={patient} 
                      medications={medications}
                      completedOnboardingTasks={completedOnboardingTasks}
                      onViewTrend={() => setActiveTab('timeline')}
                      onViewMedications={() => setActiveTab('medications')}
                    />
                  )}
                  {activeTab === 'timeline' && <VitalsTrendTab patientId={patient.id} />}
                  {activeTab === 'medications' && <MedicationTab patientId={patient.id} />}
                  {activeTab === 'investigations' && <InvestigationTab patientId={patient.id} />}
                  {activeTab === 'reports' && <ReportsTab patientId={patient.id} />}
                  {activeTab === 'course' && <CourseTab patientId={patient.id} />}
                  {activeTab === 'audit' && <AuditTab patientId={patient.id} />}
                  {activeTab === 'discharge' && (
                    <DischargeTab 
                      patientId={patient.id} 
                      patientName={patient.name} 
                      patientAge={patient.age} 
                      patientGender={patient.gender} 
                    />
                  )}
                </div>
              </Card>
            </div>

          </div>
        </div>

      )}

      {/* Onboarding Modals */}
      <UploadAssessmentModal 
        isOpen={showUploadAssessmentModal}
        onClose={() => setShowUploadAssessmentModal(false)}
        patient={patient}
        onSave={handleSaveAssessment}
      />

      <AddMedicationModal 
        isOpen={showAddMedicationModal}
        onClose={() => setShowAddMedicationModal(false)}
        onSave={handleSaveMedsFromVoice}
      />

      <AddProgressNoteModal
        isOpen={showAddProgressNoteModal}
        onClose={() => setShowAddProgressNoteModal(false)}
        onSave={handleSaveProgressNote}
      />

    </div>
  );
};
