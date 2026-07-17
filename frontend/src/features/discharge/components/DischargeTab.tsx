import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { 
  CheckCircle2, 
  RefreshCw, 
  User, 
  FileText, 
  ClipboardList, 
  FlaskConical, 
  Pill, 
  Users, 
  Activity, 
  Calendar,
  Eye,
  Download,
  Lock,
  Info,
  Edit2
} from 'lucide-react';

interface DischargeTabProps {
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
}

export const DischargeTab: React.FC<DischargeTabProps> = ({ 
  patientId,
  patientName,
  patientAge,
  patientGender
}) => {
  const [activeSection, setActiveSection] = useState<number>(1);

  const handleViewPDF = async () => {
    try {
      const response = await fetch('/rAJENDER NATH SHARMA.pdf');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Failed to view PDF:', error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch('/rAJENDER NATH SHARMA.pdf');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.setAttribute('download', 'Rajender_Nath_Sharma_Discharge_Summary.pdf');
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  const sections = [
    { id: 1, title: 'Patient Overview', status: 'completed' },
    { id: 2, title: 'Final Diagnosis', status: 'completed' },
    { id: 3, title: 'Presenting Complaints', status: 'completed' },
    { id: 4, title: 'History & Background', status: 'completed' },
    { id: 5, title: 'Course in Hospital', status: 'completed' },
    { id: 6, title: 'Investigations', status: 'completed' },
    { id: 7, title: 'Treatment & Medications', status: 'completed' },
    { id: 8, title: 'Consultations', status: 'completed' },
    { id: 9, title: 'Condition at Discharge', status: 'completed' },
    { id: 10, title: 'Follow-up & Advice', status: 'completed' }
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Header action bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">Discharge Summary</h4>
          <p className="text-[11px] text-slate-500 font-medium">Review and confirm the discharge summary compiled from all patient data.</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-slate-400 font-bold">
            Generated on: 02 Jun 2026, 11:16 AM
          </span>
          <Button variant="outline" size="sm" className="font-bold text-blue-600 border-blue-200 hover:bg-blue-50/50 rounded-xl px-3.5 flex items-center gap-1.5 shadow-sm">
            <RefreshCw size={12} />
            Regenerate Summary
          </Button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Progress/Navigation (3 cols) */}
        <div className="lg:col-span-3 space-y-1 bg-slate-50/30 p-2 border border-slate-100 rounded-3xl">
          {sections.map((section) => (
            <div 
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all select-none ${
                activeSection === section.id 
                  ? 'bg-white shadow-sm border border-slate-100' 
                  : 'hover:bg-slate-100/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${
                  activeSection === section.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'
                }`}>
                  {section.id}
                </div>
                <span className={`text-[10px] font-bold ${
                  activeSection === section.id ? 'text-slate-900' : 'text-slate-600'
                }`}>
                  {section.title}
                </span>
              </div>
              <CheckCircle2 size={13} className="text-emerald-500" />
            </div>
          ))}
        </div>

        {/* Middle Column: Content Cards (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Patient Overview */}
          <Card className="p-4 border border-blue-100/60 bg-blue-50/10 rounded-3xl flex gap-4 hover:border-blue-200 transition-colors group relative shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
              <User size={20} />
            </div>
            <div className="space-y-1 flex-1">
              <h5 className="font-extrabold text-xs text-slate-900">Patient Overview</h5>
              <p className="text-[10.5px] text-slate-700 font-medium">{patientName}, {patientAge} Years, {patientGender}</p>
              <p className="text-[9.5px] text-slate-500">IP No. {patientId} • ICU 45 • Admitted on 24 May 2026, 10:30 AM</p>
            </div>
            <button className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4 bg-blue-50 px-2 py-1 rounded-lg">
              <Edit2 size={10} /> Edit
            </button>
          </Card>

          {/* Final Diagnosis */}
          <Card className="p-4 border border-emerald-100/60 bg-emerald-50/10 rounded-3xl flex gap-4 hover:border-emerald-200 transition-colors group relative shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
              <FileText size={20} />
            </div>
            <div className="space-y-1.5 flex-1 pr-12">
              <h5 className="font-extrabold text-xs text-slate-900">Final Diagnosis</h5>
              <p className="text-[10.5px] text-slate-700 font-medium leading-relaxed">
                Diffuse Alveolar Hemorrhage (DAH) with underlying CKD, CAD s/p CABG, H/O CVA, long-term anticoagulation, ANA positivity.
              </p>
            </div>
            <button className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4 bg-blue-50 px-2 py-1 rounded-lg">
              <Edit2 size={10} /> Edit
            </button>
          </Card>

          {/* Course in Hospital */}
          <Card className="p-4 border border-orange-100/60 bg-orange-50/10 rounded-3xl flex gap-4 hover:border-orange-200 transition-colors group relative shadow-sm">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
              <ClipboardList size={20} />
            </div>
            <div className="space-y-1.5 flex-1 pr-12">
              <h5 className="font-extrabold text-xs text-slate-900">Course in Hospital</h5>
              <p className="text-[10.5px] text-slate-700 font-medium leading-relaxed">
                Presented with hemoptysis and breathlessness. Managed in ICU. Autoimmune workup done. Steroids started. Hemoptysis resolved.
              </p>
            </div>
            <button className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4 bg-blue-50 px-2 py-1 rounded-lg">
              <Edit2 size={10} /> Edit
            </button>
          </Card>

          {/* Key Investigations */}
          <Card className="p-4 border border-purple-100/60 bg-purple-50/10 rounded-3xl flex gap-4 hover:border-purple-200 transition-colors group relative shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
              <FlaskConical size={20} />
            </div>
            <div className="space-y-1.5 flex-1 pr-12">
              <h5 className="font-extrabold text-xs text-slate-900">Key Investigations</h5>
              <p className="text-[10.5px] text-slate-700 font-medium leading-relaxed">
                HRCT chest showed bilateral GGO. ANA positive, ANCA & anti-GBM negative. ACR: Sub-nephrotic proteinuria. Cultures and respiratory panel negative.
              </p>
            </div>
            <button className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4 bg-blue-50 px-2 py-1 rounded-lg">
              <Edit2 size={10} /> Edit
            </button>
          </Card>

          {/* Treatments & Medications */}
          <Card className="p-4 border border-emerald-100/60 bg-emerald-50/10 rounded-3xl flex gap-4 hover:border-emerald-200 transition-colors group relative shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-650 shrink-0">
              <Pill size={20} className="rotate-45" />
            </div>
            <div className="space-y-1.5 flex-1 pr-12">
              <h5 className="font-extrabold text-xs text-slate-900">Treatments & Medications</h5>
              <p className="text-[10.5px] text-slate-700 font-medium leading-relaxed">
                Antibiotics, steroids, nebulization and other supportive therapies. Discharge medications listed.
              </p>
            </div>
            <button className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4 bg-blue-50 px-2 py-1 rounded-lg">
              <Edit2 size={10} /> Edit
            </button>
          </Card>

          {/* Consultations */}
          <Card className="p-4 border border-blue-100/60 bg-blue-50/10 rounded-3xl flex gap-4 hover:border-blue-200 transition-colors group relative shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
              <Users size={20} />
            </div>
            <div className="space-y-1.5 flex-1 pr-12">
              <h5 className="font-extrabold text-xs text-slate-900">Consultations</h5>
              <div className="text-[10.5px] text-slate-700 font-medium leading-relaxed space-y-1">
                <p>Nephrology: CKD with no biopsy advised.</p>
                <p>Cardiology: Review for resumption of anticoagulation and antiplatelets.</p>
              </div>
            </div>
            <button className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4 bg-blue-50 px-2 py-1 rounded-lg">
              <Edit2 size={10} /> Edit
            </button>
          </Card>

        </div>

        {/* Right Column: Summaries & Actions (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Summary Statistics */}
          <Card className="p-5 border border-slate-100 rounded-3xl shadow-sm text-left bg-white">
            <h4 className="font-extrabold text-[11px] text-slate-900 border-b border-slate-50 pb-3 mb-3.5">
              Summary Statistics
            </h4>
            <div className="space-y-3 font-semibold text-[10px] text-slate-500">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><Calendar size={12} className="text-slate-400" /> Length of Stay</span>
                <span className="font-black text-slate-800">9 Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><Activity size={12} className="text-slate-400" /> ICU Stay</span>
                <span className="font-black text-slate-800">5 Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><Users size={12} className="text-slate-400" /> Total Consultations</span>
                <span className="font-black text-slate-800">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><FlaskConical size={12} className="text-slate-400" /> Total Investigations</span>
                <span className="font-black text-slate-800">28</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><Pill size={12} className="text-slate-400" /> Medications at Discharge</span>
                <span className="font-black text-slate-800">14</span>
              </div>
            </div>
          </Card>

          {/* Documents */}
          <Card className="p-5 border border-slate-100 rounded-3xl shadow-sm text-left bg-white">
            <h4 className="font-extrabold text-[11px] text-slate-900 border-b border-slate-50 pb-3 mb-3.5">
              Documents
            </h4>
            <div className="space-y-3 font-semibold text-[10px] text-slate-600">
              
              <div className="flex items-center justify-between group">
                <span className="flex items-center gap-2 text-rose-500 font-bold">
                  <FileText size={12} />
                  Discharge Summary (PDF)
                </span>
                <div className="flex items-center gap-2 text-slate-400 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button onClick={handleViewPDF} className="hover:text-blue-600"><Eye size={12} /></button>
                  <button onClick={handleDownloadPDF} className="hover:text-blue-600"><Download size={12} /></button>
                </div>
              </div>
              
              <div className="flex items-center justify-between group">
                <span className="flex items-center gap-2 text-rose-500 font-bold">
                  <FileText size={12} />
                  Discharge Summary (DOCX)
                </span>
                <div className="flex items-center gap-2 text-slate-400 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button className="hover:text-blue-600"><Eye size={12} /></button>
                  <button className="hover:text-blue-600"><Download size={12} /></button>
                </div>
              </div>

              <div className="flex items-center justify-between group">
                <span className="flex items-center gap-2 text-rose-500 font-bold">
                  <FileText size={12} />
                  Medication List (PDF)
                </span>
                <div className="flex items-center gap-2 text-slate-400 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button className="hover:text-blue-600"><Eye size={12} /></button>
                  <button className="hover:text-blue-600"><Download size={12} /></button>
                </div>
              </div>

            </div>
          </Card>

          {/* Checklist Before Discharge */}
          <Card className="p-5 border border-amber-100 bg-amber-50/30 rounded-3xl shadow-sm text-left">
            <h4 className="font-extrabold text-[11px] text-slate-900 border-b border-amber-100/50 pb-3 mb-3.5">
              Checklist Before Discharge
            </h4>
            <div className="space-y-2.5 font-bold text-[10px] text-slate-650">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                All summaries reviewed
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                Medications verified
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                Follow-up advised
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                Patient stable for discharge
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl shadow-sm text-[11px] flex items-center justify-center gap-2">
              <User size={14} />
              Discharge Patient
            </Button>
            <p className="flex items-start gap-1.5 text-[9px] text-slate-400 font-semibold leading-snug px-1">
              <Lock size={10} className="shrink-0 mt-0.5" />
              This action will finalize the discharge and update all hospital records.
            </p>
          </div>

        </div>

      </div>

      {/* Footer Info Banner */}
      <div className="w-full bg-[#f0f6ff] border border-[#d6e4ff] text-blue-750 p-4 rounded-3xl flex items-start sm:items-center gap-3 shadow-sm">
        <Info size={16} className="text-blue-600 shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-[10px] font-semibold leading-normal">
          Discharge summary is auto-generated from all tabs including Overview, Vitals, Investigations, Medications, Course in Hospital and Audit Trail.
        </p>
      </div>

    </div>
  );
};
