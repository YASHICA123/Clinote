import React, { useState } from 'react';
import { encounterService } from '../services/encounterService';
import { Button } from '../../../components/ui/Button';
import { X, CalendarPlus, AlertCircle } from 'lucide-react';

interface NewEncounterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patientId: string;
  patientName: string;
}

export const NewEncounterModal: React.FC<NewEncounterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  patientId,
  patientName
}) => {
  const [department, setDepartment] = useState('General Medicine');
  const [doctorName, setDoctorName] = useState('');
  const [admissionNotes, setAdmissionNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await encounterService.createEncounter(patientId, {
        department,
        doctor_name: doctorName.trim() || undefined,
        admission_notes: admissionNotes.trim() || undefined,
        status: 'ACTIVE'
      });

      onSuccess();
      onClose();
      setAdmissionNotes('');
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to create encounter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 text-blue-400 rounded-xl">
              <CalendarPlus size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create New Encounter</h3>
              <p className="text-xs text-slate-400">New admission or visit for {patientName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Department / Unit *</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-800"
            >
              <option value="General Medicine">General Medicine</option>
              <option value="Pulmonology">Pulmonology</option>
              <option value="Critical Care / ICU">Critical Care / ICU</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Emergency Medicine">Emergency Medicine</option>
              <option value="Surgery">Surgery</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Attending Physician</label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="e.g. Dr. Deepak Bhasin"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Admission / Visit Notes</label>
            <textarea
              rows={3}
              value={admissionNotes}
              onChange={(e) => setAdmissionNotes(e.target.value)}
              placeholder="Reason for encounter, initial clinical assessment..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-800 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-xl"
            >
              {loading ? 'Creating...' : 'Start Encounter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
