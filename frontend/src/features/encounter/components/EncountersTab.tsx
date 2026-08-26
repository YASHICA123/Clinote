import React, { useState } from 'react';
import { encounterService } from '../services/encounterService';
import type { Encounter } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Calendar, Plus, Clock, User, CheckCircle2 } from 'lucide-react';
import { NewEncounterModal } from './NewEncounterModal';

interface EncountersTabProps {
  patientId: string;
  patientName: string;
  encounters: Encounter[];
  onRefresh: () => void;
}

export const EncountersTab: React.FC<EncountersTabProps> = ({
  patientId,
  patientName,
  encounters,
  onRefresh
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (encounterId: string, newStatus: string) => {
    setUpdatingId(encounterId);
    try {
      await encounterService.updateEncounter(encounterId, { status: newStatus });
      onRefresh();
    } catch (err) {
      console.error('Failed to update encounter status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">Encounters & Admissions</h3>
          <p className="text-xs text-slate-400">Track hospital admissions, visits, and clinical episodes</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={16} />
          New Encounter
        </Button>
      </div>

      <div className="space-y-4">
        {encounters.length === 0 ? (
          <Card className="p-8 text-center text-slate-400 space-y-2 border-dashed">
            <Calendar size={28} className="mx-auto text-slate-300" />
            <p className="text-xs font-semibold">No encounters recorded for this patient</p>
          </Card>
        ) : (
          encounters.map(enc => {
            const isActive = enc.status === 'ACTIVE';

            return (
              <Card
                key={enc.id}
                className={`p-5 transition-all space-y-4 ${
                  isActive ? 'border-blue-300 ring-2 ring-blue-500/10 shadow-sm bg-gradient-to-r from-blue-50/20 to-white' : ''
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-slate-900">{enc.department}</h4>
                      <span
                        className={`text-[9px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
                          isActive
                            ? 'bg-blue-100 text-blue-700'
                            : enc.status === 'DISCHARGED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {enc.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <User size={12} className="text-slate-400" />
                      Attending: <span className="font-semibold text-slate-700">{enc.doctor_name || 'Dr. Deepak Bhasin'}</span>
                    </p>
                  </div>

                  {/* Status update controls */}
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-bold text-slate-400">Change Status:</label>
                    <select
                      value={enc.status}
                      disabled={updatingId === enc.id}
                      onChange={(e) => handleStatusChange(enc.id, e.target.value)}
                      className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="DISCHARGED">DISCHARGED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                </div>

                {enc.admission_notes && (
                  <p className="text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {enc.admission_notes}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    Admitted: {new Date(enc.admission_date).toLocaleString()}
                  </span>
                  {enc.discharge_date && (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 size={11} />
                      Discharged: {new Date(enc.discharge_date).toLocaleString()}
                    </span>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      <NewEncounterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          onRefresh();
          setIsModalOpen(false);
        }}
        patientId={patientId}
        patientName={patientName}
      />
    </div>
  );
};
