import React, { useState, useEffect } from 'react';
import { X, Mic, Check, Edit2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface MedicationItem {
  name: string;
  dosage: string;
  frequency: string;
}

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meds: MedicationItem[]) => void;
}

export const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [detectedMeds, setDetectedMeds] = useState<MedicationItem[]>([
    { name: 'Piperacillin + Tazobactam', dosage: '4.5 g IV', frequency: 'Every 8 hours' },
    { name: 'Azithromycin', dosage: '500 mg IV', frequency: 'Once daily' },
    { name: 'Linezolid', dosage: '600 mg IV', frequency: 'Every 12 hours' }
  ]);

  // Audio animation visualizer state
  const [waveformHeights, setWaveformHeights] = useState<number[]>([
    4, 8, 12, 16, 8, 4, 10, 14, 18, 10, 6, 8, 12, 14, 8, 4, 8, 16, 20, 12, 8, 4, 10, 14, 8, 4
  ]);

  useEffect(() => {
    if (!isOpen) return;

    // Simulate animated waveform while "listening"
    const interval = setInterval(() => {
      setWaveformHeights(prev =>
        prev.map(() => Math.floor(Math.random() * 20) + 4)
      );
    }, 150);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleFieldChange = (index: number, field: keyof MedicationItem, value: string) => {
    const updated = [...detectedMeds];
    updated[index] = { ...updated[index], [field]: value };
    setDetectedMeds(updated);
  };

  const handleAddMedication = () => {
    setDetectedMeds([...detectedMeds, { name: '', dosage: '', frequency: '' }]);
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(detectedMeds.filter(m => m.name.trim() !== ''));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden transition-all duration-300 relative flex flex-col">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1.5 rounded-full transition-all z-10"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-2 text-left">
          <h3 className="font-extrabold text-lg text-slate-900 leading-snug">Add Medication (Antibiotics)</h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Use voice to add multiple antibiotics and dosages
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 pt-2 text-left space-y-6">

          {/* Listening Voice Widget */}
          <div className="w-full bg-[#f4faf7] border border-[#d8f0e5] rounded-3xl p-5 flex flex-col items-center justify-center text-center space-y-4">

            <div className="relative flex items-center justify-center">
              {/* Outer rings animation */}
              <div className="absolute inset-0 rounded-full bg-emerald-100/50 animate-ping opacity-75 w-16 h-16 -m-2"></div>
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center relative shadow-md shadow-emerald-250">
                <Mic size={20} />
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-xs text-slate-800">Click the mic and say the medication with dose</p>
              <p className="text-[10px] text-emerald-600 font-bold animate-pulse">Listening...</p>
            </div>

            {/* Simulated audio waveform */}
            <div className="flex gap-[3px] items-center justify-center h-8 w-full max-w-[280px]">
              {waveformHeights.map((h, i) => (
                <div
                  key={i}
                  className="bg-emerald-500 rounded-full w-[3px] transition-all duration-150"
                  style={{ height: `${h * 1.5}px` }}
                />
              ))}
            </div>
          </div>

          {/* Detected Medications Box */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                <span>Detected Medications</span>
                <span className="text-[10px] bg-slate-100 text-slate-650 px-1.5 py-0.2 rounded-full font-bold">
                  {detectedMeds.length}
                </span>
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditToggle}
                className="text-slate-500 hover:text-slate-800 border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1 font-semibold"
              >
                <Edit2 size={11} />
                {isEditing ? 'Done' : 'Edit'}
              </Button>
            </div>

            <div className="border border-slate-100/80 rounded-2xl p-4 bg-slate-50/20 divide-y divide-slate-100 text-xs">
              {detectedMeds.map((med, index) => (
                <div key={index} className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-4">
                  <span className="text-[11px] font-bold text-slate-400 w-4">{index + 1}.</span>

                  {isEditing ? (
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={med.name}
                        onChange={e => handleFieldChange(index, 'name', e.target.value)}
                        placeholder="Medication name"
                        className="p-1 border border-slate-200 rounded text-[10px] outline-none"
                      />
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={e => handleFieldChange(index, 'dosage', e.target.value)}
                        placeholder="Dosage"
                        className="p-1 border border-slate-200 rounded text-[10px] outline-none"
                      />
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={e => handleFieldChange(index, 'frequency', e.target.value)}
                        placeholder="Frequency"
                        className="p-1 border border-slate-200 rounded text-[10px] outline-none"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 flex justify-between items-center font-bold text-slate-800 text-[11px]">
                      <span className="truncate max-w-[200px]">{med.name}</span>
                      <div className="flex items-center gap-4 text-slate-500 text-[10px] font-semibold text-right shrink-0">
                        <span>{med.dosage}</span>
                        <span className="w-24 text-right">{med.frequency}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddMedication}
                className="w-full border-dashed border-slate-200 text-slate-500 text-[10px] font-semibold mt-2"
              >
                + Add Another Medication
              </Button>
            )}
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
              onClick={handleSave}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1"
            >
              <Check size={14} />
              Review & Add
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
