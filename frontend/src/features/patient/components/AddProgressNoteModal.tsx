import React, { useState, useEffect } from 'react';
import { X, Mic, Edit2, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface AddProgressNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  }) => void;
}

export const AddProgressNoteModal: React.FC<AddProgressNoteModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isListening, setIsListening] = useState(true);

  // SOAP fields
  const [subjective, setSubjective] = useState('Patient feels better, mild shortness of breath, no chest pain.');
  const [objective, setObjective] = useState('Alert, SpO₂ 92% on FiO₂ 40%, bilateral crackles present.');
  const [assessment, setAssessment] = useState('DAH improving, hemodynamically stable.');
  const [plan, setPlan] = useState('Continue antibiotics, taper oxygen as tolerated, monitor vitals.');

  // Waveform animation
  const [waveformHeights, setWaveformHeights] = useState<number[]>([
    4, 8, 12, 16, 8, 4, 10, 14, 18, 10, 6, 8, 12, 14, 8, 4, 8, 16, 20, 12, 8, 4, 10, 14, 8, 4, 10, 12, 6, 8
  ]);

  useEffect(() => {
    if (!isOpen) return;

    // Simulate animated waveform while listening
    const interval = setInterval(() => {
      if (isListening) {
        setWaveformHeights(prev =>
          prev.map(() => Math.floor(Math.random() * 20) + 4)
        );
      }
    }, 150);

    return () => clearInterval(interval);
  }, [isOpen, isListening]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      subjective,
      objective,
      assessment,
      plan
    });
    onClose();
  };

  const handleMicClick = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden transition-all duration-300 relative flex flex-col max-h-[90vh]">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1.5 rounded-full transition-all z-10"
        >
          <X size={18} />
        </button>

        {/* Modal Title / Subtitle */}
        <div className="p-6 pb-2 text-left">
          <h3 className="font-extrabold text-lg text-slate-900 leading-snug">Add Daily Progress Note</h3>
          <p className="text-[11px] text-slate-400 mt-1 font-semibold leading-normal">
            Click the microphone and speak the patient update. We'll auto-complete the note for you.
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 pt-2 text-left space-y-5 overflow-y-auto flex-1">

          {/* Listening State Widget */}
          <div className="w-full bg-[#f4faf7] border border-[#d8f0e5] rounded-3xl p-5 flex flex-col md:flex-row items-center gap-5">

            {/* Pulsing Mic Button */}
            <button
              onClick={handleMicClick}
              className="relative flex items-center justify-center focus:outline-none shrink-0"
            >
              {isListening && (
                <div className="absolute inset-0 rounded-full bg-emerald-100/60 animate-ping opacity-75 w-16 h-16 -m-2"></div>
              )}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center relative shadow-md transition-all ${isListening ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                }`}>
                <Mic size={20} />
              </div>
            </button>

            {/* Listening Waveform and Info */}
            <div className="flex-1 space-y-3 w-full">
              <div className="space-y-0.5 text-center md:text-left">
                <p className={`font-bold text-xs ${isListening ? 'text-emerald-700 animate-pulse' : 'text-slate-500'}`}>
                  {isListening ? 'Listening...' : 'Paused'}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  Speak now (e.g. patient is stable, on oxygen 2L, improving...)
                </p>
              </div>

              {/* simulated waveform */}
              <div className="flex gap-[3px] items-center justify-center md:justify-start h-6 w-full overflow-hidden">
                {waveformHeights.map((h, i) => (
                  <div
                    key={i}
                    className={`rounded-full w-[3px] transition-all duration-150 ${isListening ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    style={{ height: `${isListening ? h : 4}px` }}
                  />
                ))}
              </div>

              {isListening && (
                <div className="text-[9px] text-emerald-650 font-bold flex items-center gap-1 justify-center md:justify-start">
                  <RefreshCw size={10} className="animate-spin" />
                  Auto assessing and generating note...
                </div>
              )}
            </div>
          </div>

          {/* Generated Preview Box */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-xs text-slate-900 tracking-tight">
              Automatically generated (Preview)
            </h4>

            <div className="border border-slate-100 bg-slate-50/20 rounded-3xl p-5 space-y-4 text-xs">

              {isEditing ? (
                // Editable Fields
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Subjective</label>
                    <textarea
                      rows={2}
                      value={subjective}
                      onChange={e => setSubjective(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Objective</label>
                    <textarea
                      rows={2}
                      value={objective}
                      onChange={e => setObjective(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Assessment</label>
                    <textarea
                      rows={2}
                      value={assessment}
                      onChange={e => setAssessment(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Plan</label>
                    <textarea
                      rows={2}
                      value={plan}
                      onChange={e => setPlan(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>
                </div>
              ) : (
                // Readonly SOAP Preview
                <div className="space-y-3.5 leading-relaxed text-slate-700">
                  <div className="space-y-0.5">
                    <p className="font-extrabold text-[11px] text-slate-900">Subjective</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-slate-650 font-medium">
                      {subjective.split('. ').filter(Boolean).map((s, idx) => (
                        <li key={idx}>{s.endsWith('.') ? s : `${s}.`}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-0.5">
                    <p className="font-extrabold text-[11px] text-slate-900">Objective</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-slate-650 font-medium">
                      {objective.split('. ').filter(Boolean).map((o, idx) => (
                        <li key={idx}>{o.endsWith('.') ? o : `${o}.`}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-0.5">
                    <p className="font-extrabold text-[11px] text-slate-900">Assessment</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-slate-650 font-medium">
                      {assessment.split('. ').filter(Boolean).map((a, idx) => (
                        <li key={idx}>{a.endsWith('.') ? a : `${a}.`}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-0.5">
                    <p className="font-extrabold text-[11px] text-slate-900">Plan</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-slate-650 font-medium">
                      {plan.split('. ').filter(Boolean).map((p, idx) => (
                        <li key={idx}>{p.endsWith('.') ? p : `${p}.`}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Footer Info / Edit Toggle */}
          <div className="flex justify-between items-center text-[10px] pt-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1 leading-normal">
              <Sparkles size={12} className="text-emerald-600 shrink-0" />
              Generated from voice input. Please review and edit if needed.
            </span>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 shrink-0"
            >
              <Edit2 size={11} />
              {isEditing ? 'Done Editing' : 'Edit Manually'}
            </button>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="font-bold text-slate-500 px-4 py-2 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2"
          >
            Save Note
          </Button>
        </div>

      </div>
    </div>
  );
};
