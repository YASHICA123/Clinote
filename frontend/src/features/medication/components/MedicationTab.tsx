import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Info } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '../../../components/ui/Table';

import { mockMedicationTabItems as medications } from '../../../mock/medications';
import type { MedicationTabItem as MedicationItem } from '../../../mock/medications';

interface MedicationTabProps {
  patientId?: string;
}

export const MedicationTab: React.FC<MedicationTabProps> = () => {

  // Render visual timeline blocks
  const renderTimelineBlocks = (med: MedicationItem) => {
    const blocks = [];
    for (let d = 1; d <= med.totalDays; d++) {
      let bgStyle = 'bg-slate-100 border-slate-200 text-slate-400';
      if (med.status === 'Active') {
        if (d === med.currentDay) {
          bgStyle = 'bg-orange-500 border-orange-500 text-white font-extrabold ring-2 ring-orange-200';
        } else if (d < med.currentDay) {
          bgStyle = 'bg-emerald-600 border-emerald-600 text-white';
        }
      } else {
        // Discontinued/completed
        bgStyle = 'bg-slate-300 border-slate-350 text-white line-through';
      }

      blocks.push(
        <div
          key={d}
          className={`w-6 h-6 rounded-lg border text-[9px] flex items-center justify-center font-bold tracking-tighter ${bgStyle}`}
          title={`${med.name} - Day ${d}`}
        >
          {d}
        </div>
      );
    }
    return (
      <div className="flex flex-wrap gap-1.5 pt-1.5">
        {blocks}
      </div>
    );
  };

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Medications Table (col span 8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-1">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">Antibiotic Medication</h4>
            <p className="text-[10px] text-slate-400 font-medium">Antibiotic therapy tracking and scheduling.</p>
          </div>

          <Card className="overflow-hidden border border-slate-100 rounded-3xl shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-extrabold text-[10px] text-slate-400 uppercase">Medication</TableHead>
                  <TableHead className="font-extrabold text-[10px] text-slate-400 uppercase">Dosage</TableHead>
                  <TableHead className="font-extrabold text-[10px] text-slate-400 uppercase">Frequency</TableHead>
                  <TableHead className="font-extrabold text-[10px] text-slate-400 uppercase">Route</TableHead>
                  <TableHead className="font-extrabold text-[10px] text-slate-400 uppercase">Duration</TableHead>
                  <TableHead className="font-extrabold text-[10px] text-slate-400 uppercase">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medications.map(med => (
                  <TableRow key={med.id} className={med.status === 'Discontinued' ? 'opacity-60' : ''}>
                    <TableCell className="font-extrabold text-slate-900 text-[11px] py-3.5">
                      {med.name}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <Badge variant="outline" className="text-slate-600 border-slate-200 bg-slate-50 font-extrabold text-[9px] px-2 py-0.5 rounded-lg">
                        {med.dosage}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-extrabold text-slate-800 text-[10px] py-3.5">
                      {med.frequency}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-500 text-[10px] py-3.5">
                      {med.route}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span className="text-[10px] font-extrabold text-slate-800 block">{med.duration}</span>
                      <span className="text-[8px] text-slate-400 font-bold">{med.dayText}</span>
                    </TableCell>
                    <TableCell className="py-3.5">
                      {med.status === 'Active' ? (
                        <Badge className="bg-[#e6fbf3] text-[#10b981] font-bold text-[9px] border-transparent px-2.5 py-0.5 rounded-lg">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-500 font-bold text-[9px] border-transparent px-2.5 py-0.5 rounded-lg">
                          Discontinued
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Right Column: Timeline & Summary Widgets (col span 4) */}
        <div className="lg:col-span-4 space-y-4">

          {/* Antibiotic Timeline Card */}
          <Card className="p-5 border border-slate-100 rounded-3xl shadow-sm text-left space-y-4">
            <h4 className="font-extrabold text-xs text-slate-900 border-b border-slate-50 pb-3">
              Antibiotic Timeline
            </h4>

            <div className="space-y-4">
              {medications.map(med => (
                <div key={med.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-extrabold">
                    <span className="text-slate-800 truncate max-w-[170px]">{med.name}</span>
                    <span className="text-slate-400 text-[9px]">{med.dayText}</span>
                  </div>
                  {renderTimelineBlocks(med)}
                </div>
              ))}
            </div>
          </Card>

          {/* Medication Summary Card */}
          <Card className="p-5 border border-slate-100 rounded-3xl shadow-sm text-left">
            <h4 className="font-extrabold text-xs text-slate-900 border-b border-slate-50 pb-3 mb-3.5">
              Medication Summary
            </h4>
            <div className="space-y-3.5 font-semibold text-[10px] text-slate-500">
              <div className="flex justify-between items-center">
                <span>Active Antibiotics</span>
                <span className="font-black text-slate-800 text-[11px]">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Discontinued</span>
                <span className="font-black text-slate-800 text-[11px]">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Course Days</span>
                <span className="font-black text-slate-800 text-[11px]">17 Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Administered</span>
                <span className="font-black text-slate-800 text-[11px]">25 May 2026, 06:00 AM</span>
              </div>
            </div>
          </Card>

          {/* Stewardship Policy Banner */}
          <Card className="p-4 border border-slate-100 bg-[#f0f6ff]/50 rounded-2xl flex items-center gap-3">
            <Info size={18} className="text-blue-650 shrink-0" />
            <p className="text-[9.5px] font-bold text-blue-750 text-left leading-snug">
              Antibiotic stewardship guidelines are monitored for all prescriptions.
            </p>
          </Card>

        </div>

      </div>
    </div>
  );
};
