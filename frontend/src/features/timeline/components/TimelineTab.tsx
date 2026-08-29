import React, { useState, useEffect } from 'react';
import { timelineService } from '../services/timelineService';
import type { TimelineEvent, Encounter } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Loader } from '../../../components/ui/Loader';
import {
  Stethoscope,
  Pill,
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Plus,
  User,
  FlaskConical,
  FileText
} from 'lucide-react';
import { NewClinicalEventModal } from './NewClinicalEventModal';

interface TimelineTabProps {
  patientId: string;
  patientName?: string;
  patientMrn?: string;
  encounters: Encounter[];
}

export const TimelineTab: React.FC<TimelineTabProps> = ({
  patientId,
  patientName = 'Patient',
  patientMrn = '',
  encounters
}) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedEncounterFilter, setSelectedEncounterFilter] = useState<string>('ALL');

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const encounterParam = selectedEncounterFilter !== 'ALL' ? selectedEncounterFilter : undefined;
      const data = await timelineService.getTimeline(patientId, encounterParam, 'desc');
      setEvents(data);
      if (data.length > 0) {
        const initExpanded: Record<string, boolean> = {};
        data.slice(0, 2).forEach(e => { initExpanded[e.id] = true; });
        setExpandedEvents(initExpanded);
      }
    } catch (err) {
      console.error('Failed to load timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [patientId, selectedEncounterFilter]);

  const toggleExpand = (id: string) => {
    setExpandedEvents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getEventIcon = (type?: string) => {
    const norm = (type || '').toLowerCase();
    if (norm.includes('admission') || norm.includes('initial')) {
      return <Stethoscope className="text-blue-600" size={16} />;
    }
    if (norm.includes('medication')) {
      return <Pill className="text-emerald-600" size={16} />;
    }
    if (norm.includes('investigation') || norm.includes('lab')) {
      return <FlaskConical className="text-purple-600" size={16} />;
    }
    if (norm.includes('procedure')) {
      return <Activity className="text-indigo-600" size={16} />;
    }
    if (norm.includes('discharge')) {
      return <CheckCircle2 className="text-rose-600" size={16} />;
    }
    return <FileText className="text-amber-600" size={16} />;
  };

  const getEventBadge = (type?: string) => {
    const norm = (type || '').toLowerCase();
    if (norm.includes('admission') || norm.includes('initial')) {
      return { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'INITIAL ASSESSMENT' };
    }
    if (norm.includes('medication')) {
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'MEDICATION UPDATE' };
    }
    if (norm.includes('investigation') || norm.includes('lab')) {
      return { bg: 'bg-purple-50 text-purple-700 border-purple-200', label: 'INVESTIGATION' };
    }
    if (norm.includes('procedure')) {
      return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', label: 'PROCEDURE' };
    }
    if (norm.includes('discharge')) {
      return { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'DISCHARGE' };
    }
    return { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'DAILY UPDATE' };
  };

  const filteredEvents = events.filter(e => {
    if (filterType === 'ALL') return true;
    const norm = (e.type || e.event_type || '').toUpperCase();
    return norm.includes(filterType);
  });

  if (loading) return <Loader label="Loading clinical timeline..." />;

  return (
    <div className="space-y-6 text-left">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">Chronological Patient Timeline</h3>
          <p className="text-xs text-slate-400">Continuous record of clinical events and notes</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Encounter filter dropdown */}
          {encounters.length > 1 && (
            <select
              value={selectedEncounterFilter}
              onChange={(e) => setSelectedEncounterFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Encounters</option>
              {encounters.map(enc => (
                <option key={enc.id} value={enc.id}>
                  {enc.department} ({new Date(enc.admission_date).toLocaleDateString()})
                </option>
              ))}
            </select>
          )}

          {/* Event type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Event Types</option>
            <option value="INITIAL">Initial Assessment</option>
            <option value="DAILY">Daily Updates</option>
            <option value="INVESTIGATION">Investigations</option>
            <option value="MEDICATION">Medications</option>
            <option value="PROCEDURE">Procedures</option>
            <option value="DISCHARGE">Discharge</option>
          </select>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
          >
            <Plus size={16} />
            Add Clinical Event
          </Button>
        </div>
      </div>

      {/* Timeline nodes */}
      {filteredEvents.length === 0 ? (
        <Card className="p-12 text-center text-slate-400 space-y-3 border-dashed">
          <Clock size={32} className="mx-auto text-slate-300" />
          <p className="text-xs font-semibold">No clinical events recorded yet for this filter</p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl"
          >
            Enter First Clinical Note
          </Button>
        </Card>
      ) : (
        <div className="space-y-6 relative pl-8 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-slate-200">
          {filteredEvents.map((event) => {
            const isExpanded = !!expandedEvents[event.id];
            const badgeInfo = getEventBadge(event.type || event.event_type);
            const author = event.created_by || 'Dr. Deepak Bhasin';
            const noteContent = event.details || event.content || '';

            return (
              <div key={event.id} className="relative group">
                {/* Node icon circle */}
                <div className="absolute -left-[35px] top-1 w-7 h-7 rounded-full bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:border-blue-400 transition-all">
                  {getEventIcon(event.type || event.event_type)}
                </div>

                {/* Event Card */}
                <Card className="hover:border-slate-300 transition-all duration-150 overflow-hidden shadow-xs">
                  <div
                    onClick={() => toggleExpand(event.id)}
                    className="p-4 flex items-start justify-between cursor-pointer select-none"
                  >
                    <div className="space-y-1.5 pr-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[9px] px-2 py-0.5 rounded-md font-extrabold border uppercase tracking-wider ${badgeInfo.bg}`}>
                          {badgeInfo.label}
                        </span>
                        <h4 className="font-extrabold text-xs text-slate-900">{event.title}</h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-slate-400" />
                          {event.timestamp || (event.created_at ? new Date(event.created_at).toLocaleString() : '')}
                        </span>
                        <span className="flex items-center gap-1 text-slate-600 font-semibold">
                          <User size={11} className="text-slate-400" />
                          {author}
                        </span>
                      </div>
                    </div>

                    <button className="text-slate-400 hover:text-slate-600 transition-colors pt-1">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {isExpanded && noteContent && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                      {noteContent}
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      )}

      <NewClinicalEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchTimeline();
          setIsModalOpen(false);
        }}
        patientId={patientId}
        patientName={patientName}
        patientMrn={patientMrn}
        encounters={encounters}
      />
    </div>
  );
};
