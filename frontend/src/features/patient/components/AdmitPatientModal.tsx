import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { patientService } from '../services/patientService';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import {
  X,
  Upload,
  Camera,
  FolderOpen,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  User,
  Bed,
  Calendar,
  Building
} from 'lucide-react';

interface AdmitPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdmitPatientModal: React.FC<AdmitPatientModalProps> = ({ isOpen, onClose }) => {
  const { setActivePatientId, setCurrentPage, refreshPatients } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Progress sub-steps for Step 2
  const [extractionSubStep, setExtractionSubStep] = useState<1 | 2 | 3 | 4>(1);

  // New patient placeholder that we "admit"
  const [newPatientData, setNewPatientData] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setStep(1);
      setUploadedFile(null);
      setExtractionSubStep(1);
      setNewPatientData(null);
    }
  }, [isOpen]);

  // Handle file upload simulation
  const handleFileUpload = (fileName: string) => {
    setUploadedFile(fileName);
    setStep(2);
  };

  // Step 2 extraction simulation
  useEffect(() => {
    if (step !== 2) return;

    const timer1 = setTimeout(() => setExtractionSubStep(2), 800);
    const timer2 = setTimeout(() => setExtractionSubStep(3), 1600);
    const timer3 = setTimeout(() => setExtractionSubStep(4), 2400);

    const timerFinish = setTimeout(async () => {
      // Admit patient in service
      try {
        const added = await patientService.admitPatient({
          name: 'Rajinder N. Sharma',
          age: 81,
          gender: 'M',
          bedNumber: '45',
          status: 'ICU',
          statusText: 'Active',
          admissionDate: '24 May 2026, 10:30 AM',
          admissionSource: 'Emergency Room',
          consultant: 'Dr. Deepak Bhasin',
          displayId: 'MHLL.644284',
          ipNumber: '269862',
          diagnoses: ['Chronic Obstructive Pulmonary Disease (COPD) Exacerbation', 'Type II Respiratory Failure'],
          vitals: { hr: 84, bp: '128/80', rr: 18, spo2: 94, temp: '98.4 °F' }
        });
        setNewPatientData(added);
        await refreshPatients();
        setStep(3);
      } catch (err) {
        console.error(err);
      }
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerFinish);
    };
  }, [step]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden transition-all duration-300 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1.5 rounded-full transition-all"
        >
          <X size={18} />
        </button>

        {/* Step 1: Upload Admission Sheet */}
        {step === 1 && (
          <div className="p-6 md:p-8 flex flex-col items-center text-center space-y-6">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Upload size={28} />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-extrabold text-lg text-slate-900">Upload Admission Sheet</h3>
              <p className="text-[11px] text-slate-400 max-w-sm">
                Upload the admission sheet (PDF or Image) of the patient.
              </p>
            </div>

            {/* Drag & Drop Area */}
            <div
              onClick={() => handleFileUpload('admission_sheet.pdf')}
              className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-emerald-500 hover:bg-emerald-50/10 cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center space-y-4"
            >
              <div className="p-3 bg-slate-50 text-slate-400 rounded-full group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                <Upload size={22} />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-xs text-slate-700">Drag & drop file here</p>
                <p className="text-[10px] text-slate-400">or</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 font-semibold">
                  <FolderOpen size={13} />
                  Choose File
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 font-semibold">
                  <Camera size={13} />
                  Take Photo
                </Button>
              </div>

              <p className="text-[9px] text-slate-400 pt-2">
                Supported formats: PDF, JPG, JPEG, PNG
              </p>
            </div>

            {/* Footer shield */}
            <div className="w-full bg-slate-50 rounded-2xl py-3 px-4 flex items-center justify-center gap-2 text-slate-500 text-[10px]">
              <ShieldCheck size={14} className="text-slate-400" />
              <span>Your files are secure and encrypted</span>
            </div>
          </div>
        )}

        {/* Step 2: Extracting Information */}
        {step === 2 && (
          <div className="p-6 md:p-8 flex flex-col items-center text-center space-y-6">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Loader2 size={28} className="animate-spin" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-extrabold text-lg text-slate-900">Extracting Information</h3>
              <p className="text-[11px] text-slate-400 max-w-sm">
                AI is reading the admission sheet and extracting patient details. This may take a few seconds...
              </p>
            </div>

            {/* Pipeline Step Indicators */}
            <div className="w-full border border-slate-100 rounded-2xl p-5 bg-slate-50/30 text-left space-y-4 max-w-md">
              {/* Pipeline Step 1 */}
              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">File uploaded successfully</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{uploadedFile}</p>
                </div>
              </div>

              {/* Pipeline Step 2 */}
              <div className="flex items-start gap-3">
                {extractionSubStep >= 2 ? (
                  <CheckCircle2 size={16} className="text-emerald-600 mt-0.5" />
                ) : (
                  <Loader2 size={16} className="text-emerald-600 animate-spin mt-0.5" />
                )}
                <div className={extractionSubStep < 2 ? 'opacity-80' : ''}>
                  <h4 className="font-bold text-xs text-slate-900">Extracting information</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Reading and analyzing document...</p>
                </div>
              </div>

              {/* Pipeline Step 3 */}
              <div className="flex items-start gap-3">
                {extractionSubStep >= 3 ? (
                  <CheckCircle2 size={16} className="text-emerald-600 mt-0.5" />
                ) : extractionSubStep === 2 ? (
                  <Loader2 size={16} className="text-emerald-600 animate-spin mt-0.5" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-200 block" />
                )}
                <div className={extractionSubStep < 3 ? 'opacity-40' : ''}>
                  <h4 className="font-bold text-xs text-slate-900">Validating data</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Checking extracted information</p>
                </div>
              </div>

              {/* Pipeline Step 4 */}
              <div className="flex items-start gap-3">
                {extractionSubStep >= 4 ? (
                  <CheckCircle2 size={16} className="text-emerald-600 mt-0.5" />
                ) : extractionSubStep === 3 ? (
                  <Loader2 size={16} className="text-emerald-600 animate-spin mt-0.5" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-200 block" />
                )}
                <div className={extractionSubStep < 4 ? 'opacity-40' : ''}>
                  <h4 className="font-bold text-xs text-slate-900">Preparing patient card</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Almost done...</p>
                </div>
              </div>
            </div>

            {/* Footer shield */}
            <div className="w-full bg-emerald-50/50 rounded-2xl py-3 px-4 flex items-center justify-center gap-2 text-emerald-600 text-[10px]">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span className="font-medium">Your files are secure and encrypted</span>
            </div>
          </div>
        )}

        {/* Step 3: Patient Added Successfully */}
        {step === 3 && newPatientData && (
          <div className="p-6 md:p-8 flex flex-col items-center text-center space-y-6">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 ring-4 ring-emerald-50">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-slate-900">Patient Added Successfully!</h3>
              <p className="text-[11px] text-slate-400">
                The patient has been created and added to the system.
              </p>
            </div>

            {/* Structured Card Summary */}
            <div className="w-full border border-slate-100 rounded-2xl bg-slate-50/30 p-5 text-left space-y-4 max-w-md">
              <div className="flex justify-between items-start border-b border-slate-100/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-100/50 text-emerald-700 rounded-xl">
                    <User size={18} />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">New Patient</span>
                    <h4 className="font-extrabold text-sm text-slate-900 leading-tight">{newPatientData.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {newPatientData.age} Y / {newPatientData.gender} • ID: {newPatientData.id}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <StatusBadge status={newPatientData.status} />
                  <StatusBadge status="Active" />
                </div>
              </div>

              {/* Grid details */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="text-slate-400"><Bed size={13} /></div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-semibold">Bed Number</p>
                    <p className="font-bold text-[11px] text-slate-700">ICU-{newPatientData.bedNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-slate-400"><User size={13} /></div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-semibold">Consultant</p>
                    <p className="font-bold text-[11px] text-slate-700">{newPatientData.consultant}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-slate-400"><Calendar size={13} /></div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-semibold">Admission Date</p>
                    <p className="font-bold text-[11px] text-slate-700">{newPatientData.admissionDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-slate-400"><Building size={13} /></div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-semibold">Admit Source</p>
                    <p className="font-bold text-[11px] text-slate-700">{newPatientData.admissionSource}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer check badge banner */}
            <div className="w-full bg-emerald-50/50 rounded-2xl py-3 px-4 flex items-center justify-center gap-2 text-emerald-600 text-[10px]">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span className="font-medium">Patient card created successfully</span>
            </div>

            {/* Modal actions */}
            <div className="flex gap-3 w-full max-w-sm pt-2">
              <Button
                variant="outline"
                className="flex-1 font-semibold"
                onClick={onClose}
              >
                View Patient Card
              </Button>
              <Button
                variant="primary"
                className="flex-1 font-semibold"
                onClick={() => {
                  setActivePatientId(newPatientData.id);
                  setCurrentPage('patient-workspace');
                  onClose();
                }}
              >
                Go to Patient Overview
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
