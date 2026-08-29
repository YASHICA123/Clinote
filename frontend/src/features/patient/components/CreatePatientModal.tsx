import React, { useState, useRef } from 'react';
import { patientService, type ConfirmPatientResponse, type PatientAdmissionData } from '../services/patientService';
import { Button } from '../../../components/ui/Button';
import {
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  User,
  Building2,
  AlertTriangle,
  Loader2,
  FileCheck,
  Edit3
} from 'lucide-react';

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (patientId: string) => void;
}

type ModalStep = 'upload' | 'processing' | 'review' | 'manual';

const OCR_STEPS = [
  'Uploading admission report...',
  'Reading document with OCR...',
  'Extracting patient information...',
  'Preparing patient profile...'
];

export const CreatePatientModal: React.FC<CreatePatientModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<ModalStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [ocrStepIndex, setOcrStepIndex] = useState(0);
  const [uploadId, setUploadId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  // Duplicate state
  const [duplicateInfo, setDuplicateInfo] = useState<ConfirmPatientResponse['existing_patient'] | null>(null);

  // Form Fields (Editable Extracted Data)
  const [fullName, setFullName] = useState('');
  const [uhid, setUhid] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('male');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');
  const [admissionTime, setAdmissionTime] = useState('');
  const [department, setDepartment] = useState('General Medicine');
  const [ward, setWard] = useState('General Ward');
  const [consultant, setConsultant] = useState('Dr. Deepak Bhasin');
  const [hospital, setHospital] = useState('Clinote Hospital & Medical Centre');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const resetState = () => {
    setStep('upload');
    setSelectedFile(null);
    setUploadId(undefined);
    setError(null);
    setDuplicateInfo(null);
    setFullName('');
    setUhid('');
    setDob('');
    setAge('');
    setGender('male');
    setPhone('');
    setAddress('');
    setAdmissionDate('');
    setAdmissionTime('');
    setDepartment('General Medicine');
    setWard('General Ward');
    setConsultant('Dr. Deepak Bhasin');
    setHospital('Clinote Hospital & Medical Centre');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = async (file: File) => {
    // Validate file size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setError('File is too large. Maximum allowed size is 15MB.');
      return;
    }

    const validExtensions = ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png', '.webp', '.txt'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));
    if (!isValid) {
      setError('Unsupported file type. Please upload a PDF, DOCX, DOC, JPG, JPEG, PNG, or WEBP file.');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setStep('processing');
    setOcrStepIndex(0);

    // Step progression timer simulation while backend executes
    const stepInterval = setInterval(() => {
      setOcrStepIndex(prev => {
        if (prev < OCR_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    try {
      const res = await patientService.processAdmissionReport(file);
      clearInterval(stepInterval);

      if (res && res.status === 'processed') {
        setUploadId(res.upload_id);
        const p: PatientAdmissionData = res.patient_data || {};

        setFullName(p.full_name || '');
        setUhid(p.uhid || '');
        setDob(p.date_of_birth || '');
        setAge(p.age !== undefined && p.age !== null ? p.age : '');
        setGender(p.gender || 'male');
        setPhone(p.phone_number || '');
        setAddress(p.address || '');
        setAdmissionDate(p.admission_date || '');
        setAdmissionTime(p.admission_time || '');
        setDepartment(p.department || 'General Medicine');
        setWard(p.ward || 'General Ward');
        setConsultant(p.consultant || 'Dr. Deepak Bhasin');
        setHospital(p.hospital || 'Clinote Hospital & Medical Centre');

        setStep('review');
      } else {
        setError('Failed to process the document. You can still enter the details manually.');
        setStep('review');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('OCR processing error:', err);
      setError(err?.message || 'Error communicating with OCR service. You can enter details manually.');
      setStep('review');
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Patient Full Name is required.');
      return;
    }

    setConfirming(true);
    setError(null);
    setDuplicateInfo(null);

    const payload = {
      full_name: fullName.trim(),
      uhid: uhid.trim() || undefined,
      date_of_birth: dob || undefined,
      age: typeof age === 'number' ? age : undefined,
      gender: gender as 'male' | 'female' | 'other',
      phone_number: phone.trim() || undefined,
      address: address.trim() || undefined,
      admission_date: admissionDate || undefined,
      admission_time: admissionTime || undefined,
      department: department.trim() || 'General Medicine',
      ward: ward.trim() || 'General Ward',
      consultant: consultant.trim() || 'Dr. Deepak Bhasin',
      hospital: hospital.trim() || 'Clinote Hospital & Medical Centre'
    };

    try {
      const res = await patientService.confirmPatient(uploadId, payload);

      if (res.status === 'duplicate' && res.existing_patient) {
        setDuplicateInfo(res.existing_patient);
        setConfirming(false);
        return;
      }

      if (res.success && res.patient_id) {
        onSuccess(res.patient_id);
        handleClose();
      } else {
        setError(res.message || 'Failed to save patient record.');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred while confirming patient creation.');
    } finally {
      setConfirming(false);
    }
  };

  const handleOpenExistingPatient = () => {
    if (duplicateInfo?.id) {
      onSuccess(duplicateInfo.id);
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] text-left">

        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold">
              {step === 'upload' ? <Upload size={20} /> : <FileCheck size={20} />}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Create New Patient</h3>
              <p className="text-xs text-slate-400">
                {step === 'upload' && 'Upload the patient’s admission report to automatically extract patient information.'}
                {step === 'processing' && 'Processing Admission Report with Clinical OCR...'}
                {step === 'review' && 'Review & edit extracted patient & admission information.'}
                {step === 'manual' && 'Manual Patient Admission Entry'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-xl hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* STEP 1: UPLOAD ADMISSION REPORT */}
          {/* ------------------------------------------------------------- */}
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Dropzone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${dragActive
                    ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-emerald-400'
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.webp,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="w-16 h-16 rounded-2xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
                  <Upload size={28} />
                </div>

                <h4 className="text-sm font-extrabold text-slate-800">
                  Drag and drop admission report here
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Upload PDF scan, Word document (.docx), intake sheet, or photo of hospital admission form.
                </p>

                <div className="mt-4">
                  <Button
                    type="button"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm shadow-emerald-600/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Browse Document File
                  </Button>
                </div>

                {/* Formats */}
                <div className="flex items-center gap-2 mt-6 text-[10px] font-bold text-slate-400">
                  <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs">PDF</span>
                  <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs">DOCX</span>
                  <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs">JPG</span>
                  <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs">PNG</span>
                  <span>• Max 15MB</span>
                </div>
              </div>

              {/* Manual Entry Fallback Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 mx-auto"
                >
                  <Edit3 size={14} />
                  Or skip upload and enter patient details manually →
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* STEP 2: PROCESSING / OCR STATE */}
          {/* ------------------------------------------------------------- */}
          {step === 'processing' && (
            <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin flex items-center justify-center" />
                <div className="absolute inset-0 flex items-center justify-center text-emerald-600 font-bold text-xs">
                  OCR
                </div>
              </div>

              <div className="space-y-2 max-w-sm">
                <h4 className="text-base font-extrabold text-slate-900">
                  Extracting Patient Information
                </h4>
                <p className="text-xs text-slate-400 font-medium">
                  {selectedFile ? selectedFile.name : 'Admission Report'}
                </p>
              </div>

              {/* Sequential OCR Step List */}
              <div className="w-full max-w-sm bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 text-left">
                {OCR_STEPS.map((stepText, idx) => {
                  const isDone = idx < ocrStepIndex;
                  const isCurrent = idx === ocrStepIndex;

                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 size={16} className="text-emerald-600 animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                      )}
                      <span className={`font-semibold ${isCurrent ? 'text-emerald-600 font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'}`}>
                        {stepText}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* STEP 3: REVIEW AND EDIT FORM */}
          {/* ------------------------------------------------------------- */}
          {step === 'review' && (
            <form onSubmit={handleConfirm} className="space-y-6">

              {/* Duplicate Alert Card (if detected) */}
              {duplicateInfo && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs">
                      <h5 className="font-extrabold text-amber-900">
                        A patient with this UHID/MRN already exists.
                      </h5>
                      <p className="text-amber-800">
                        Found existing record: <strong>{duplicateInfo.name}</strong> ({duplicateInfo.hospital_patient_id}) in {duplicateInfo.department || 'General Medicine'}.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      type="button"
                      onClick={handleOpenExistingPatient}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
                    >
                      Open Existing Patient Profile →
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDuplicateInfo(null)}
                      className="border-amber-200 text-amber-800 hover:bg-amber-100 text-xs px-3 py-2 rounded-xl"
                    >
                      Edit UHID / Back
                    </Button>
                  </div>
                </div>
              )}

              {/* Patient Information Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
                  <User size={14} className="text-emerald-600" />
                  Patient Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar Verma"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-semibold text-slate-800 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">UHID / MRN</label>
                    <input
                      type="text"
                      value={uhid}
                      onChange={(e) => setUhid(e.target.value)}
                      placeholder="e.g. MRN-1004"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-semibold text-slate-800 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Gender *</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-semibold text-slate-800 transition-all"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Age (Years)</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value))}
                      placeholder="e.g. 52"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-semibold text-slate-800 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-semibold text-slate-800 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 9811234567"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-semibold text-slate-800 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Residential Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Flat 402, Green Valley Apartments, New Delhi"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-semibold text-slate-800 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Admission Information Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
                  <Building2 size={14} className="text-emerald-600" />
                  Admission Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Admission Date</label>
                    <input
                      type="date"
                      value={admissionDate}
                      onChange={(e) => setAdmissionDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-semibold text-slate-800 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Admission Time</label>
                    <input
                      type="text"
                      value={admissionTime}
                      onChange={(e) => setAdmissionTime(e.target.value)}
                      placeholder="e.g. 11:15 AM"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-semibold text-slate-800 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. General Medicine"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-semibold text-slate-800 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Ward / Room / Bed</label>
                    <input
                      type="text"
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      placeholder="e.g. General Ward / Bed 12"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-semibold text-slate-800 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Consultant / Attending Doctor</label>
                    <input
                      type="text"
                      value={consultant}
                      onChange={(e) => setConsultant(e.target.value)}
                      placeholder="e.g. Dr. Deepak Bhasin"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-semibold text-slate-800 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Hospital / Facility</label>
                    <input
                      type="text"
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      placeholder="e.g. Clinote Hospital & Medical Centre"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none font-semibold text-slate-800 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('upload')}
                  className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft size={14} />
                  Upload Different File
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClose}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm shadow-emerald-600/20"
                    loading={confirming}
                  >
                    Confirm & Create Patient Profile →
                  </Button>
                </div>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
