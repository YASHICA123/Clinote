import React, { useState } from 'react';
import { timelineService } from '../services/timelineService';
import { Button } from '../../../components/ui/Button';
import { X, FileEdit, AlertCircle } from 'lucide-react';
import type { Encounter } from '../../../types';

interface NewClinicalEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patientId: string;
  patientName: string;
  patientMrn: string;
  encounters: Encounter[];
}

const EVENT_TYPES = [
  { id: 'DAILY_UPDATE', label: 'Daily Update / Progress Note', icon: '📝' },
  { id: 'INITIAL_ASSESSMENT', label: 'Initial Assessment', icon: '🩺' },
  { id: 'INVESTIGATION', label: 'Investigation / Lab Result', icon: '🔬' },
  { id: 'MEDICATION_UPDATE', label: 'Medication Update', icon: '💊' },
  { id: 'PROCEDURE', label: 'Procedure / Intervention', icon: '⚡' },
  { id: 'DISCHARGE', label: 'Discharge Order / Note', icon: '🏁' }
];

export const NewClinicalEventModal: React.FC<NewClinicalEventModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  patientId,
  patientName,
  patientMrn,
  encounters
}) => {
  const [eventType, setEventType] = useState('DAILY_UPDATE');
  const [selectedEncounterId, setSelectedEncounterId] = useState(
    encounters.find(e => e.status === 'ACTIVE')?.id || (encounters.length > 0 ? encounters[0].id : '')
  );
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Clinical note content is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await timelineService.createClinicalEvent({
        patient_id: patientId,
        encounter_id: selectedEncounterId || undefined,
        event_type: eventType,
        title: title.trim() || undefined,
        content: content.trim()
      });

      onSuccess();
      onClose();
      setContent('');
      setTitle('');
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to save clinical event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 text-blue-400 rounded-xl">
              <FileEdit size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Enter Clinical Event</h3>
              <p className="text-xs text-slate-400">
                {patientName} <span className="text-blue-400">({patientMrn})</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-left">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Encounter & Event Type Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Encounter / Admission</label>
              <select
                value={selectedEncounterId}
                onChange={(e) => setSelectedEncounterId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
              >
                {encounters.map(enc => (
                  <option key={enc.id} value={enc.id}>
                    {enc.department} ({enc.status})
                  </option>
                ))}
                {encounters.length === 0 && (
                  <option value="">Current Visit</option>
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Event Type *</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
              >
                {EVENT_TYPES.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.icon} {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Event Title (Optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Day 3 Morning Rounds - Respiratory Status"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Clinical Note *</label>
              <span className="text-[10px] text-slate-400">Manual entry</span>
            </div>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter comprehensive clinical findings, vitals, subjective reports, objective observations, assessment, and action plan..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-slate-800 leading-relaxed resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md shadow-blue-500/20"
            >
              {loading ? 'Saving...' : 'Save Clinical Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
