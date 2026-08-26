import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { patientService } from '../../features/patient/services/patientService';
import { encounterService } from '../../features/encounter/services/encounterService';
import type { Patient, Encounter } from '../../types';

// Tab subcomponents
import { TimelineTab } from '../../features/timeline/components/TimelineTab';
import { DocumentsTab } from '../../features/documents/components/DocumentsTab';
import { EncountersTab } from '../../features/encounter/components/EncountersTab';
import { AuditTab } from '../../features/audit/components/AuditTab';
import { OverviewTab } from '../../features/overview/components/OverviewTab';

// Modals
import { NewClinicalEventModal } from '../../features/timeline/components/NewClinicalEventModal';
import { NewEncounterModal } from '../../features/encounter/components/NewEncounterModal';

// UI components
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';

// Icons
import { 
  ArrowLeft,
  FileText,
  Calendar,
  Info,
  Clock,
  ShieldCheck,
  FileEdit
} from 'lucide-react';

export const PatientWorkspace: React.FC = () => {
  const { 
    activePatientId, 
    setActivePatientId, 
    setCurrentPage, 
    activeTab, 
    setActiveTab 
  } = useApp();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal toggles
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEncounterModal, setShowEncounterModal] = useState(false);

  // Fetch patient details and encounters
  const loadPatientData = async () => {
    if (!activePatientId) return;
    setLoading(true);
    try {
      const [patientData, encList] = await Promise.all([
        patientService.getPatientById(activePatientId),
        encounterService.getEncountersByPatient(activePatientId)
      ]);
      if (patientData) {
        setPatient(patientData);
      }
      setEncounters(encList || []);
    } catch (err) {
      console.error('Failed to load patient data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientData();
  }, [activePatientId]);

  if (loading) return <Loader label="Loading patient record..." />;
  if (!patient) return (
    <div className="p-8 text-center space-y-4">
      <p className="text-sm font-bold text-slate-600">Patient record not found.</p>
      <Button onClick={() => setCurrentPage('dashboard')}>Return to Dashboard</Button>
    </div>
  );

  const activeEncounter = encounters.find(e => e.status === 'ACTIVE') || encounters[0];

  return (
    <div className="space-y-6 text-left">
      {/* Top Navigation & Profile Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => {
            setActivePatientId(null);
            setCurrentPage('dashboard');
          }}
          className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* Global Patient Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowEventModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
          >
            <FileEdit size={15} />
            + New Clinical Event
          </Button>

          <Button
            onClick={() => setShowEncounterModal(true)}
            variant="outline"
            className="bg-white text-slate-700 hover:bg-slate-50 border-slate-200 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
          >
            <Calendar size={15} />
            + New Encounter
          </Button>
        </div>
      </div>

      {/* Patient Hero Info Card */}
      <Card className="p-6 bg-white border border-slate-200 shadow-xs rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Patient Identity */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-md shadow-blue-500/20 shrink-0">
              {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{patient.name}</h1>
                <span className="text-xs px-2.5 py-0.5 bg-blue-50 text-blue-700 font-mono font-bold rounded-lg border border-blue-200">
                  {patient.hospital_patient_id || 'MRN-PENDING'}
                </span>
                <span className={`text-[10px] px-2.5 py-0.5 font-extrabold rounded-full uppercase tracking-wider ${
                  patient.status === 'ICU' ? 'bg-rose-100 text-rose-700' :
                  patient.status === 'WARD' ? 'bg-purple-100 text-purple-700' :
                  patient.status === 'DISCHARGED' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {patient.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-3">
                <span>{patient.age ? `${patient.age} yrs` : ''} • {patient.gender === 'male' || patient.gender === 'M' ? 'Male' : patient.gender === 'female' || patient.gender === 'F' ? 'Female' : patient.gender}</span>
                {patient.date_of_birth && <span>• DOB: {patient.date_of_birth}</span>}
              </p>
            </div>
          </div>

          {/* Clinical Context Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department</span>
              <p className="font-extrabold text-slate-800 truncate">{patient.department || activeEncounter?.department || 'General Medicine'}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bed / Ward</span>
              <p className="font-extrabold text-slate-800 truncate">{patient.bed_number || patient.bedNumber || 'Unassigned'}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attending</span>
              <p className="font-extrabold text-slate-800 truncate">{patient.consultant || 'Dr. Deepak Bhasin'}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Admitted</span>
              <p className="font-extrabold text-slate-800 truncate">
                {patient.admissionDate || (activeEncounter ? new Date(activeEncounter.admission_date).toLocaleDateString() : 'Active')}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <Card className="p-5">
        <div className="flex border-b border-slate-100 pb-1 mb-5 overflow-x-auto gap-1 text-xs font-bold text-slate-400 select-none">
          {[
            { id: 'timeline', label: 'Timeline', icon: <Clock size={14} className="shrink-0" />, activeClass: 'border-blue-600 text-blue-700 bg-blue-50/20' },
            { id: 'documents', label: 'Documents', icon: <FileText size={14} className="shrink-0" />, activeClass: 'border-indigo-600 text-indigo-700 bg-indigo-50/20' },
            { id: 'encounters', label: 'Encounters', icon: <Calendar size={14} className="shrink-0" />, activeClass: 'border-emerald-600 text-emerald-700 bg-emerald-50/20' },
            { id: 'overview', label: 'Overview', icon: <Info size={14} className="shrink-0" />, activeClass: 'border-amber-600 text-amber-700 bg-amber-50/20' },
            { id: 'audit', label: 'Audit Trail', icon: <ShieldCheck size={14} className="shrink-0" />, activeClass: 'border-purple-600 text-purple-700 bg-purple-50/20' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 rounded-t-xl font-extrabold ${
                activeTab === tab.id 
                  ? tab.activeClass 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/60 border-transparent'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div>
          {activeTab === 'timeline' && (
            <TimelineTab 
              patientId={patient.id} 
              patientName={patient.name} 
              patientMrn={patient.hospital_patient_id}
              encounters={encounters} 
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsTab 
              patientId={patient.id} 
              encounters={encounters} 
            />
          )}

          {activeTab === 'encounters' && (
            <EncountersTab 
              patientId={patient.id} 
              patientName={patient.name} 
              encounters={encounters}
              onRefresh={loadPatientData}
            />
          )}

          {activeTab === 'overview' && (
            <OverviewTab 
              patient={patient} 
              medications={[]}
              completedOnboardingTasks={[]}
              onViewTrend={() => setActiveTab('timeline')}
              onViewMedications={() => setActiveTab('timeline')}
            />
          )}

          {activeTab === 'audit' && (
            <AuditTab patientId={patient.id} />
          )}
        </div>
      </Card>

      {/* Global Modals */}
      <NewClinicalEventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSuccess={() => {
          loadPatientData();
          setShowEventModal(false);
        }}
        patientId={patient.id}
        patientName={patient.name}
        patientMrn={patient.hospital_patient_id || ''}
        encounters={encounters}
      />

      <NewEncounterModal
        isOpen={showEncounterModal}
        onClose={() => setShowEncounterModal(false)}
        onSuccess={() => {
          loadPatientData();
          setShowEncounterModal(false);
        }}
        patientId={patient.id}
        patientName={patient.name}
      />
    </div>
  );
};
