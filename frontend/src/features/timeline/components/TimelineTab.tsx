import React, { useState, useEffect } from 'react';
import { timelineService } from '../services/timelineService';
import type { TimelineEvent } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Loader } from '../../../components/ui/Loader';
import { 
  PlusCircle, 
  Stethoscope, 
  Pill, 
  FileImage, 
  Activity, 
  ArrowRightLeft, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Clock 
} from 'lucide-react';

interface TimelineTabProps {
  patientId: string;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({ patientId }) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchTimeline = async () => {
      setLoading(true);
      try {
        const data = await timelineService.getTimeline(patientId);
        setEvents(data);
        // Expand the first event by default
        if (data.length > 0) {
          setExpandedEvents({ [data[0].id]: true });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [patientId]);

  const toggleExpand = (id: string) => {
    setExpandedEvents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'admission':
        return <PlusCircle className="text-blue-600" size={16} />;
      case 'diagnosis':
        return <Stethoscope className="text-amber-600" size={16} />;
      case 'medication':
        return <Pill className="text-emerald-600" size={16} />;
      case 'investigation':
        return <FileImage className="text-purple-600" size={16} />;
      case 'procedure':
        return <Activity className="text-indigo-600" size={16} />;
      case 'transfer':
        return <ArrowRightLeft className="text-teal-600" size={16} />;
      case 'discharge':
        return <CheckCircle2 className="text-rose-600" size={16} />;
      default:
        return <Clock className="text-slate-500" size={16} />;
    }
  };

  const getEventBg = (type: string) => {
    switch (type) {
      case 'admission': return 'bg-blue-50';
      case 'diagnosis': return 'bg-amber-50';
      case 'medication': return 'bg-emerald-50';
      case 'investigation': return 'bg-purple-50';
      case 'procedure': return 'bg-indigo-50';
      case 'transfer': return 'bg-teal-50';
      case 'discharge': return 'bg-rose-50';
      default: return 'bg-slate-50';
    }
  };

  if (loading) return <Loader label="Loading clinical timeline..." />;

  return (
    <div className="space-y-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 text-left">
      {events.map((event) => {
        const isExpanded = !!expandedEvents[event.id];
        
        return (
          <div key={event.id} className="relative group">
            {/* Timeline node circle */}
            <div className={`absolute -left-[30px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${getEventBg(event.type)}`}>
              {getEventIcon(event.type)}
            </div>

            {/* Event Card */}
            <Card className="hover:border-slate-200 transition-all duration-150 overflow-hidden">
              <div 
                onClick={() => toggleExpand(event.id)}
                className="p-4 flex items-start justify-between cursor-pointer select-none"
              >
                <div className="space-y-1 pr-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-extrabold text-xs text-slate-800">{event.title}</h4>
                    <span className="text-[9px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock size={10} />
                      {event.timestamp}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">{event.subtitle}</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors pt-0.5">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {isExpanded && event.details && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-50 text-[10px] text-slate-600 leading-relaxed bg-slate-50/20">
                  {event.details}
                </div>
              )}
            </Card>
          </div>
        );
      })}
    </div>
  );
};
