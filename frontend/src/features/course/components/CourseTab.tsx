import React, { useState, useEffect } from 'react';
import { courseService } from '../services/courseService';
import type { CourseEntry } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Loader } from '../../../components/ui/Loader';
import {
  Heart,
  Activity,
  Wind,
  Thermometer,
  ChevronDown,
  Info
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';

import { mockStaticCourseEvents as staticEvents } from '../../../mock/course';

interface CourseTabProps {
  patientId: string;
}

export const CourseTab: React.FC<CourseTabProps> = ({ patientId }) => {
  const [entries, setEntries] = useState<CourseEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const data = await courseService.getCourseEntries(patientId);
      // Sort reverse chronological
      setEntries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [patientId]);

  // Helper to get styling for event nodes
  const getEventStyle = (type: string) => {
    switch (type) {
      case 'admission':
        return {
          iconBg: 'bg-emerald-50 text-emerald-600',
          borderColor: 'border-emerald-200'
        };
      case 'oxygen':
        return {
          iconBg: 'bg-blue-50 text-blue-600',
          borderColor: 'border-blue-200'
        };
      case 'antibiotics':
        return {
          iconBg: 'bg-amber-50 text-amber-600',
          borderColor: 'border-amber-200'
        };
      case 'investigations':
        return {
          iconBg: 'bg-purple-50 text-purple-600',
          borderColor: 'border-purple-200'
        };
      case 'update':
      default:
        return {
          iconBg: 'bg-emerald-50 text-emerald-600',
          borderColor: 'border-emerald-250'
        };
    }
  };

  if (loading) return <Loader label="Retrieving course records..." />;

  // Combine dynamic entries and static events
  // Dynamic entries from progress note modal will be placed at the very top of the list!
  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Timeline list of events (col span 8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-1">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">Course in Hospital</h4>
            <p className="text-[10px] text-slate-400 font-medium">Timeline of clinical updates, interventions, and assessments.</p>
          </div>

          {/* Timeline Nodes */}
          <div className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 space-y-5 pt-3">

            {/* Dynamic SOAP entries added via AddProgressNoteModal */}
            {entries.map((entry) => {
              const styles = getEventStyle('update');
              return (
                <div key={entry.id} className="relative flex gap-4 items-start group">
                  {/* Timeline circle node */}
                  <div className={`absolute -left-[30px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${styles.iconBg}`}>
                    <Activity size={13} />
                  </div>

                  {/* Timestamp column */}
                  <div className="w-28 shrink-0 space-y-0.5 pt-1">
                    <p className="font-extrabold text-[10px] text-slate-800 leading-none">
                      {entry.date.split(',')[0]}
                    </p>
                    <p className="text-[9px] text-slate-400 font-semibold">
                      {entry.date.split(',')[1]?.trim() || ''}
                    </p>
                  </div>

                  {/* Card Content */}
                  <Card className="flex-1 p-4 border border-emerald-100 bg-[#f4faf7]/10 hover:border-emerald-300 transition-all shadow-sm rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <h5 className="font-black text-xs text-emerald-800 tracking-tight flex items-center gap-1.5">
                          Daily Progress Note
                        </h5>
                        <p className="text-[9px] text-slate-400 font-bold">
                          by {entry.doctorName || 'Dr. Deepak Bhasin'}
                        </p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 font-extrabold text-[8.5px] border-transparent px-2 py-0.2 rounded-lg">
                        Daily Note
                      </Badge>
                    </div>

                    {/* Vitals row in SOAP entry */}
                    {entry.vitals && (
                      <div className="flex flex-wrap gap-2 text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-100/50 p-2 rounded-xl">
                        <span className="flex items-center gap-1 text-red-650">
                          <Heart size={10} />
                          HR {entry.vitals.hr}
                        </span>
                        <span className="text-slate-350">|</span>
                        <span className="flex items-center gap-1 text-blue-600">
                          <Activity size={10} />
                          BP {entry.vitals.bp}
                        </span>
                        <span className="text-slate-350">|</span>
                        <span className="flex items-center gap-1 text-emerald-700">
                          <Wind size={10} />
                          RR {entry.vitals.rr}
                        </span>
                        <span className="text-slate-350">|</span>
                        <span className="flex items-center gap-1 text-purple-700">
                          <Wind size={10} className="rotate-90" />
                          SpO₂ {entry.vitals.spo2}%
                        </span>
                        <span className="text-slate-350">|</span>
                        <span className="flex items-center gap-1 text-amber-700">
                          <Thermometer size={10} />
                          T {entry.vitals.temp}
                        </span>
                      </div>
                    )}

                    <div className="text-[10px] text-slate-650 leading-relaxed font-sans whitespace-pre-wrap">
                      {entry.note}
                    </div>
                  </Card>
                </div>
              );
            })}

            {/* Static Events from Mockup */}
            {staticEvents.map((evt) => {
              const styles = getEventStyle(evt.type);
              const datePart = evt.time.split(',')[0];
              const timePart = evt.time.split(',')[1]?.trim() || '';

              return (
                <div key={evt.id} className="relative flex gap-4 items-start group">
                  {/* Timeline circle node */}
                  <div className={`absolute -left-[30px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${styles.iconBg}`}>
                    <Activity size={12} />
                  </div>

                  {/* Timestamp column */}
                  <div className="w-28 shrink-0 space-y-0.5 pt-1">
                    <p className="font-extrabold text-[10px] text-slate-800 leading-none">{datePart}</p>
                    <p className="text-[9px] text-slate-400 font-semibold">{timePart}</p>
                  </div>

                  {/* Card Content */}
                  <Card className="flex-1 p-4 border border-slate-100 hover:border-slate-200 transition-all shadow-sm rounded-2xl space-y-1">
                    <div className="flex justify-between items-start">
                      <h5 className="font-black text-xs text-slate-900 tracking-tight">{evt.title}</h5>
                      <span className="text-[9px] text-slate-400 font-bold">by {evt.actor}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{evt.description}</p>
                  </Card>
                </div>
              );
            })}

          </div>

          {/* Load More Button */}
          <div className="flex justify-center pt-2">
            <button className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-xl px-4 py-2 hover:bg-slate-50 shadow-sm cursor-pointer transition-all">
              Load More <ChevronDown size={12} />
            </button>
          </div>

        </div>

        {/* Right Column: Summaries & KPI Panels (col span 4) */}
        <div className="lg:col-span-4 space-y-4">

          {/* Course Summary Card */}
          <Card className="p-5 border border-slate-100 rounded-3xl shadow-sm text-left">
            <h4 className="font-extrabold text-xs text-slate-900 border-b border-slate-50 pb-3 mb-3.5">
              Course Summary
            </h4>
            <div className="space-y-3.5 font-semibold text-[10px] text-slate-500">
              <div className="flex justify-between items-center">
                <span>Length of Stay</span>
                <span className="font-black text-slate-800 text-[11px]">2 Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span>ICU Stay</span>
                <span className="font-black text-slate-800 text-[11px]">2 Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Events</span>
                <span className="font-black text-slate-800 text-[11px]">{5 + entries.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Updated</span>
                <span className="font-black text-slate-800 text-[11px]">
                  {entries.length > 0 ? entries[0].date : '25 May 2026, 09:00 AM'}
                </span>
              </div>
            </div>
          </Card>

          {/* Key Metrics Card */}
          <Card className="p-5 border border-slate-100 rounded-3xl shadow-sm text-left">
            <h4 className="font-extrabold text-xs text-slate-900 border-b border-slate-50 pb-3 mb-3.5">
              Key Metrics
            </h4>
            <div className="space-y-3.5 font-semibold text-[10px] text-slate-500">
              <div className="flex justify-between items-center">
                <span>Max Oxygen Support</span>
                <span className="font-black text-slate-800 text-[11px]">4 L/min</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Lowest SpO₂</span>
                <span className="font-black text-slate-800 text-[11px]">90%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Max Temperature</span>
                <span className="font-black text-slate-800 text-[11px]">37.8 °C</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Antibiotics</span>
                <span className="font-black text-slate-800 text-[11px]">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Investigations</span>
                <span className="font-black text-slate-800 text-[11px]">5</span>
              </div>
            </div>
          </Card>

          {/* Auto-Sync Message Card */}
          <Card className="p-4 border border-slate-100 bg-[#f0f6ff]/50 rounded-2xl flex items-center gap-3">
            <Info size={18} className="text-blue-650 shrink-0" />
            <p className="text-[9.5px] font-bold text-blue-750 text-left leading-snug">
              All events are auto-synced and used for discharge summary generation.
            </p>
          </Card>

        </div>

      </div>
    </div>
  );
};
