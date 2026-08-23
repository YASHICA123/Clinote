import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  Check, 
  Download, 
  Plus, 
  FileText,
  AlertCircle,
  Eye,
  Activity,
  Heart,
  Thermometer
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { Patient } from '../../../types';

interface UploadAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSave: (data: {
    vitals: {
      hr: number;
      bp: string;
      rr: number;
      spo2: number;
      temp: string;
    };
    diagnoses: string[];
    suspectedCause: string;
    pastHistory: string[];
  }) => void;
}

export const UploadAssessmentModal: React.FC<UploadAssessmentModalProps> = ({ 
  isOpen, 
  onClose, 
  patient, 
  onSave 
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form edit states (pre-populated with mock AI extracted data matching Image 2)
  const [name, setName] = useState(patient.name || 'Rajinder N. Sharma');
  const [age, setAge] = useState(patient.age?.toString() || '81');
  const [gender, setGender] = useState<'M' | 'F' | 'Other'>(patient.gender || 'M');
  const [consultant, setConsultant] = useState(patient.consultant || 'Dr. Deepak Bhasin');
  
  const [pastHistory, setPastHistory] = useState<string[]>([
    'Hypertension',
    'Type 2 Diabetes Mellitus',
    'COPD (Known)'
  ]);
  const [newCondition, setNewCondition] = useState('');
  const [showAddCondition, setShowAddCondition] = useState(false);

  const [diagnosis, setDiagnosis] = useState('Diffuse Alveolar Hemorrhage (DAH)');
  const [suspectedCause, setSuspectedCause] = useState('Severe lower respiratory tract infection');

  const [vitalTemp, setVitalTemp] = useState('37.2');
  const [vitalHR, setVitalHR] = useState('102');
  const [vitalBP, setVitalBP] = useState('128/76');
  const [vitalSpO2, setVitalSpO2] = useState('92');
  const [vitalRR, setVitalRR] = useState('24');

  if (!isOpen) return null;

  const handleUploadAndProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
    }, 1500);
  };

  const handleSave = () => {
    onSave({
      vitals: {
        hr: parseInt(vitalHR) || 102,
        bp: vitalBP,
        rr: parseInt(vitalRR) || 24,
        spo2: parseInt(vitalSpO2) || 92,
        temp: `${vitalTemp} °C`
      },
      diagnoses: [diagnosis],
      suspectedCause: suspectedCause,
      pastHistory: pastHistory
    });
    setStep(1);
    onClose();
  };

  const toggleHistoryItem = (item: string) => {
    if (pastHistory.includes(item)) {
      setPastHistory(pastHistory.filter(h => h !== item));
    } else {
      setPastHistory([...pastHistory, item]);
    }
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setPastHistory([...pastHistory, newCondition.trim()]);
      setNewCondition('');
      setShowAddCondition(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-3xl shadow-2xl border border-slate-100 w-full overflow-hidden transition-all duration-300 relative flex flex-col ${
        step === 1 ? 'max-w-xl' : 'max-w-[90vw] md:max-w-6xl h-[90vh]'
      }`}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1.5 rounded-full transition-all z-10"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-2 text-left">
          <h3 className="font-extrabold text-lg text-slate-900 leading-snug">Upload Initial Assessment</h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            {step === 1 
              ? 'Upload the initial assessment document scanned from admission.' 
              : 'Upload admission document to extract key clinical information.'}
          </p>
        </div>

        {/* Modal Body */}
        {step === 1 ? (
          /* Step 1: Upload UI */
          <div className="p-6 pt-2 text-left space-y-5">
            {/* Green Alert Box */}
            <div className="w-full bg-[#f4faf7] border border-[#d8f0e5] rounded-2xl p-4 flex gap-3 items-start">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <FileText size={16} />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-emerald-800">What should be included?</h4>
                <p className="text-[10px] text-emerald-600 font-medium">
                  Patient info, past history, current diagnosis, and initial vitals.
                </p>
              </div>
            </div>

            {/* Drag & Drop Area */}
            <div className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-emerald-500 hover:bg-emerald-50/10 cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center space-y-4">
              <div className="p-3 bg-slate-50 text-slate-400 rounded-full group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                <Upload size={22} className="group-hover:scale-105 transition-transform" />
              </div>
              <div className="space-y-1 text-center">
                <p className="font-bold text-xs text-slate-700">Drag and drop file here</p>
                <p className="text-[10px] text-slate-400 font-medium">or</p>
              </div>
              
              <Button variant="outline" size="sm" className="font-semibold text-emerald-700 border-emerald-200 hover:bg-emerald-50 bg-white">
                Choose File
              </Button>

              <div className="text-[9px] text-slate-400 text-center font-medium space-y-0.5">
                <p>Supported formats: PDF, JPG, PNG</p>
                <p>Max file size: 10 MB</p>
              </div>
            </div>

            {/* Tips Card */}
            <div className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5 flex gap-2 items-start text-slate-500 text-[10px] font-medium leading-relaxed">
              <AlertCircle size={14} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-700">Tips:</span> Ensure the document is clear and all sections are visible for accurate data extraction.
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button 
                variant="outline" 
                size="sm"
                className="font-semibold text-slate-500" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleUploadAndProcess}
                loading={isProcessing}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5"
              >
                <Sparkles size={13} />
                Upload & Process
              </Button>
            </div>
          </div>
        ) : (
          /* Step 2: Edit & Verify UI (Image 2 style stepper) */
          <div className="flex-1 flex flex-col min-h-0 text-left">
            {/* Stepper progress bar */}
            <div className="px-6 py-4 bg-slate-50/50 border-y border-slate-100 flex items-center justify-between text-xs select-none">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                  <Check size={10} />
                </span>
                <div>
                  <p className="font-bold text-[10px] text-slate-500 leading-none">Upload</p>
                  <p className="text-[8px] text-slate-400 mt-0.5">Upload Document</p>
                </div>
              </div>

              <div className="h-px bg-slate-200 flex-1 mx-4" />

              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                  <Check size={10} />
                </span>
                <div>
                  <p className="font-bold text-[10px] text-slate-500 leading-none">AI Processing</p>
                  <p className="text-[8px] text-slate-400 mt-0.5">Extracting Information</p>
                </div>
              </div>

              <div className="h-px bg-slate-200 flex-1 mx-4" />

              <div className="flex items-center gap-2 text-emerald-700">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                  3
                </span>
                <div>
                  <p className="font-bold text-[10px] leading-none">Review</p>
                  <p className="text-[8px] text-emerald-600 mt-0.5 font-bold">Verify Details</p>
                </div>
              </div>

              <div className="h-px bg-slate-200 flex-1 mx-4" />

              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center font-bold text-[10px]">
                  4
                </span>
                <div>
                  <p className="font-bold text-[10px] leading-none">Save</p>
                  <p className="text-[8px] text-slate-450 mt-0.5">Store in Record</p>
                </div>
              </div>
            </div>

            {/* Scrollable contents grid */}
            <div className="flex-1 overflow-y-auto p-6 grid lg:grid-cols-10 gap-6 min-h-0 bg-slate-50/20">
              
              {/* Left Column (Colspan 4): Document viewer mock */}
              <div className="lg:col-span-4 flex flex-col space-y-3 min-h-0">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-xs text-slate-800">Uploaded Document</h4>
                  <Button variant="outline" size="sm" className="text-emerald-700 bg-white border-emerald-200 hover:bg-emerald-50 flex items-center gap-1 font-semibold">
                    <Plus size={11} />
                    Replace
                  </Button>
                </div>

                <div className="flex-1 bg-[#edf2f7] border border-slate-200 rounded-2xl flex flex-col min-h-[450px]">
                  {/* Mock PDF Toolbar */}
                  <div className="bg-slate-700 text-white px-4 py-2 text-xs flex justify-between items-center rounded-t-2xl font-mono select-none">
                    <div className="flex items-center gap-2.5">
                      <FileText size={14} className="text-slate-300" />
                      <span className="font-bold text-[10px] truncate max-w-[150px]">Initial_Assessment_Rajinder.pdf</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-slate-350 hover:text-white"><Download size={13} /></button>
                      <button className="text-slate-350 hover:text-white"><Eye size={13} /></button>
                    </div>
                  </div>

                  {/* Mock PDF Content Area */}
                  <div className="flex-1 bg-white p-6 m-4 border border-slate-200 shadow-inner rounded overflow-y-auto text-[9px] text-slate-800 font-mono space-y-4 leading-normal select-text">
                    
                    {/* Header */}
                    <div className="text-center border-b border-slate-300 pb-3">
                      <h5 className="font-black text-sm text-slate-900 tracking-wide uppercase">Initial Assessment</h5>
                      <div className="grid grid-cols-2 gap-2 text-left pt-2 font-bold text-slate-600">
                        <span>Patient Name: <strong className="text-slate-850">Rajinder N. Sharma</strong></span>
                        <span className="text-right">Age / Gender: <strong className="text-slate-850">81 / Male</strong></span>
                        <span>IP No.: <strong className="text-slate-850">269862</strong></span>
                        <span className="text-right">Date: 24/05/2026 10:20 AM</span>
                      </div>
                    </div>

                    {/* Past History */}
                    <div className="space-y-1">
                      <h6 className="font-black text-[10px] text-slate-900 border-b border-slate-100 pb-0.5">PAST HISTORY</h6>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                        <li>Hypertension</li>
                        <li>Type 2 Diabetes Mellitus</li>
                        <li>COPD (Known)</li>
                      </ul>
                    </div>

                    {/* Current Diagnosis */}
                    <div className="space-y-1">
                      <h6 className="font-black text-[10px] text-slate-900 border-b border-slate-100 pb-0.5">CURRENT DIAGNOSIS</h6>
                      <p className="font-bold text-slate-800">Diffuse Alveolar Hemorrhage (DAH)</p>
                      <p className="text-[8px] text-slate-500 font-medium">Suspected cause: Severe lower respiratory tract infection</p>
                    </div>

                    {/* Vitals */}
                    <div className="space-y-2">
                      <h6 className="font-black text-[10px] text-slate-900 border-b border-slate-100 pb-0.5">INITIAL VITALS</h6>
                      <div className="grid grid-cols-5 gap-2 text-center text-[8px] font-bold">
                        <div className="bg-slate-50 p-1.5 border border-slate-100 rounded">
                          <p className="text-slate-400">Temp</p>
                          <p className="text-slate-800 text-[9px] mt-0.5">37.2 °C</p>
                        </div>
                        <div className="bg-slate-50 p-1.5 border border-slate-100 rounded">
                          <p className="text-slate-400">HR</p>
                          <p className="text-slate-800 text-[9px] mt-0.5">102 bpm</p>
                        </div>
                        <div className="bg-slate-50 p-1.5 border border-slate-100 rounded">
                          <p className="text-slate-400">BP</p>
                          <p className="text-slate-800 text-[9px] mt-0.5">128/76 mmHg</p>
                        </div>
                        <div className="bg-slate-50 p-1.5 border border-slate-100 rounded">
                          <p className="text-slate-400">SpO2</p>
                          <p className="text-slate-800 text-[9px] mt-0.5">92%</p>
                          <p className="text-[6px] text-slate-450">(FiO2 40%)</p>
                        </div>
                        <div className="bg-slate-50 p-1.5 border border-slate-100 rounded">
                          <p className="text-slate-400">RR</p>
                          <p className="text-slate-800 text-[9px] mt-0.5">24 /min</p>
                        </div>
                      </div>
                    </div>

                    {/* Disclaimer signature mock */}
                    <div className="pt-6 text-right border-t border-slate-100 text-[7px] text-slate-400">
                      <span>Digitally scanned and stored by secure clinical portal.</span>
                    </div>

                  </div>
                </div>
              </div>

              {/* Right Column (Colspan 6): Verification Form Editor */}
              <div className="lg:col-span-6 flex flex-col space-y-4 min-h-0 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-xs text-slate-800">Extracted Information (Edit & Verify)</h4>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-bold border border-emerald-150 flex items-center gap-1 shrink-0 select-none">
                    <span className="w-1 h-1 rounded-full bg-emerald-600 block animate-pulse"></span>
                    AI Extracted
                  </span>
                </div>

                <div className="space-y-4 overflow-y-auto pr-1 flex-1">
                  
                  {/* Patient Details */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3.5">
                    <h5 className="font-bold text-xs text-slate-900 border-b border-slate-50 pb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      Patient Details
                    </h5>
                    
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <Input 
                          label="Name" 
                          value={name} 
                          onChange={e => setName(e.target.value)} 
                          className="font-bold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Age</label>
                        <select 
                          value={age} 
                          onChange={e => setAge(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-xl font-bold bg-white text-slate-800 h-9"
                        >
                          <option value="81">81</option>
                          <option value="82">82</option>
                          <option value="83">83</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Gender</label>
                        <select 
                          value={gender} 
                          onChange={e => setGender(e.target.value as any)}
                          className="w-full p-2 border border-slate-200 rounded-xl font-bold bg-white text-slate-800 h-9"
                        >
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Input 
                          label="Consultant" 
                          value={consultant} 
                          onChange={e => setConsultant(e.target.value)} 
                          className="font-bold text-slate-800"
                        />
                        <span className="text-[9px] text-slate-400 mt-1 block">Bed ICU 45</span>
                      </div>
                    </div>
                  </div>

                  {/* Past History */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3.5">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                      <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        Past History
                      </h5>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowAddCondition(true)}
                        className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/50 p-1 flex items-center gap-1 font-bold"
                      >
                        <Plus size={11} />
                        Add Condition
                      </Button>
                    </div>

                    {showAddCondition && (
                      <div className="flex gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-150 items-center">
                        <input 
                          type="text" 
                          placeholder="e.g. Asthma" 
                          value={newCondition}
                          onChange={e => setNewCondition(e.target.value)}
                          className="flex-1 p-1.5 border border-slate-200 rounded-lg text-xs outline-none bg-white"
                          onKeyDown={e => { if (e.key === 'Enter') handleAddCondition(); }}
                        />
                         <Button size="sm" onClick={handleAddCondition} className="bg-emerald-700 text-white font-bold">Add</Button>
                        <Button size="sm" variant="outline" onClick={() => setShowAddCondition(false)}>Cancel</Button>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-3 gap-2.5">
                      {['Hypertension', 'Type 2 Diabetes Mellitus', 'COPD (Known)', 'Dyslipidemia', 'Chronic Kidney Disease'].map((item) => {
                        const isChecked = pastHistory.includes(item);
                        return (
                          <div 
                            key={item}
                            onClick={() => toggleHistoryItem(item)}
                            className={`p-2.5 border rounded-xl flex items-center gap-2 cursor-pointer select-none transition-all ${
                              isChecked 
                                ? 'bg-emerald-50/40 border-emerald-200 text-emerald-800 font-semibold' 
                                : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                              isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                            }`}>
                              {isChecked && <Check size={10} strokeWidth={3} />}
                            </span>
                            <span className="text-[10px] truncate">{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Current Diagnosis */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3.5">
                    <h5 className="font-bold text-xs text-slate-900 border-b border-slate-50 pb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      Current Diagnosis
                    </h5>

                    <div className="space-y-3.5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Diagnosis</label>
                        <select 
                          value={diagnosis} 
                          onChange={e => setDiagnosis(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-xl font-bold bg-white text-slate-800 h-9"
                        >
                          <option value="Diffuse Alveolar Hemorrhage (DAH)">Diffuse Alveolar Hemorrhage (DAH)</option>
                          <option value="Severe Acute Exacerbation of COPD">Severe Acute Exacerbation of COPD</option>
                          <option value="Severe Community Acquired Pneumonia">Severe Community Acquired Pneumonia</option>
                        </select>
                      </div>

                      <Input 
                        label="Suspected Cause" 
                        value={suspectedCause} 
                        onChange={e => setSuspectedCause(e.target.value)}
                        className="font-semibold text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Initial Vitals */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3.5">
                    <h5 className="font-bold text-xs text-slate-900 border-b border-slate-50 pb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      Initial Vitals
                    </h5>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Temp (°C)</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={vitalTemp} 
                            onChange={e => setVitalTemp(e.target.value)}
                            className="w-full p-2 pr-6 border border-slate-200 rounded-xl font-bold text-slate-700 h-9 outline-none focus:border-emerald-500 text-xs"
                          />
                          <Thermometer size={12} className="absolute right-2 top-2.5 text-slate-400" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">HR (bpm)</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={vitalHR} 
                            onChange={e => setVitalHR(e.target.value)}
                            className="w-full p-2 pr-6 border border-slate-200 rounded-xl font-bold text-slate-700 h-9 outline-none focus:border-emerald-500 text-xs"
                          />
                          <Heart size={12} className="absolute right-2 top-2.5 text-slate-400" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">BP (mmHg)</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={vitalBP} 
                            onChange={e => setVitalBP(e.target.value)}
                            className="w-full p-2 pr-6 border border-slate-200 rounded-xl font-bold text-slate-700 h-9 outline-none focus:border-emerald-500 text-xs"
                          />
                          <Activity size={12} className="absolute right-2 top-2.5 text-slate-400" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">SpO₂ (%)</label>
                        <select 
                          value={vitalSpO2} 
                          onChange={e => setVitalSpO2(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-xl font-bold text-slate-700 h-9 outline-none bg-white text-xs"
                        >
                          <option value="92">92% (FiO₂ 40%)</option>
                          <option value="94">94% (FiO₂ 30%)</option>
                          <option value="96">96% (FiO₂ 21%)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">RR (/min)</label>
                        <select 
                          value={vitalRR} 
                          onChange={e => setVitalRR(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-xl font-bold text-slate-700 h-9 outline-none bg-white text-xs"
                        >
                          <option value="24">24/min</option>
                          <option value="22">22/min</option>
                          <option value="20">20/min</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Please review footnote */}
                  <div className="w-full bg-blue-50/40 border border-blue-100 rounded-xl p-3 flex gap-2 items-center text-blue-700 text-[10px] font-medium leading-none">
                    <AlertCircle size={13} className="text-blue-500 shrink-0" />
                    <span>Please review all extracted information and make necessary corrections before saving.</span>
                  </div>

                </div>
              </div>

            </div>

            {/* Bottom Footer Actions for Step 2 */}
            <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onClose}
                className="text-slate-500 font-semibold"
              >
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setStep(1)}
                  className="font-semibold text-slate-650"
                >
                  Back
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={handleSave}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6"
                >
                  Save to Record
                </Button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
