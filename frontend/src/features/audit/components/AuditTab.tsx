import React from 'react';
import { Card } from '../../../components/ui/Card';
import { User, ShieldCheck, Download, ChevronDown, CheckCircle, Upload, Plus, FileText, ArrowRightLeft } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

interface AuditTabProps {
  patientId: string;
}

interface AuditLogEntry {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  actor: string;
  actionType: 'Create' | 'Upload' | 'Update' | 'Add';
}

export const AuditTab: React.FC<AuditTabProps> = () => {
  const actionFilter = 'All Actions';
  const timeFilter = 'All Time';

  const auditLogs: AuditLogEntry[] = [
    {
      id: 'audit-1',
      date: '25 May 2026',
      time: '10:45 AM',
      title: 'Event updated',
      description: 'Oxygen rate changed from 4 L/min to 3 L/min',
      actor: 'Dr. Deepak Bhasin',
      actionType: 'Update'
    },
    {
      id: 'audit-2',
      date: '25 May 2026',
      time: '10:10 AM',
      title: 'Daily progress note added',
      description: 'Daily progress note for 25 May 2026',
      actor: 'Dr. Deepak Bhasin',
      actionType: 'Add'
    },
    {
      id: 'audit-3',
      date: '25 May 2026',
      time: '09:15 AM',
      title: 'Investigation added',
      description: 'Chest X-Ray (PA View) added',
      actor: 'Dr. Neha Kapoor',
      actionType: 'Add'
    },
    {
      id: 'audit-4',
      date: '25 May 2026',
      time: '09:12 AM',
      title: 'Medication added',
      description: 'Added Piperacillin + Tazobactam (4.5 g IV)',
      actor: 'Dr. Deepak Bhasin',
      actionType: 'Update'
    },
    {
      id: 'audit-5',
      date: '25 May 2026',
      time: '09:05 AM',
      title: 'Initial assessment uploaded',
      description: 'Initial assessment document uploaded',
      actor: 'Dr. Deepak Bhasin',
      actionType: 'Upload'
    },
    {
      id: 'audit-6',
      date: '25 May 2026',
      time: '09:00 AM',
      title: 'Patient created',
      description: 'Patient record created',
      actor: 'Dr. Deepak Bhasin',
      actionType: 'Create'
    }
  ];

  // Helper to get action type colors
  const getActionBadge = (type: AuditLogEntry['actionType']) => {
    switch (type) {
      case 'Create':
        return <Badge className="bg-[#e6fbf3] text-[#10b981] hover:bg-[#e6fbf3] font-bold text-[9px] border-transparent px-2.5 py-0.5 rounded-lg">Create</Badge>;
      case 'Upload':
        return <Badge className="bg-[#eff6ff] text-[#3b82f6] hover:bg-[#eff6ff] font-bold text-[9px] border-transparent px-2.5 py-0.5 rounded-lg">Upload</Badge>;
      case 'Update':
        return <Badge className="bg-[#fcf5ff] text-[#a855f7] hover:bg-[#fcf5ff] font-bold text-[9px] border-transparent px-2.5 py-0.5 rounded-lg">Update</Badge>;
      case 'Add':
        return <Badge className="bg-[#fffbeb] text-[#f59e0b] hover:bg-[#fffbeb] font-bold text-[9px] border-transparent px-2.5 py-0.5 rounded-lg">Add</Badge>;
    }
  };

  // Helper to get icon based on action type
  const getActionIcon = (type: AuditLogEntry['actionType']) => {
    switch (type) {
      case 'Create': return <CheckCircle size={13} className="text-emerald-600" />;
      case 'Upload': return <Upload size={13} className="text-blue-600" />;
      case 'Update': return <ArrowRightLeft size={13} className="text-purple-600" />;
      case 'Add': return <Plus size={13} className="text-amber-600" />;
    }
  };

  const getActionIconBg = (type: AuditLogEntry['actionType']) => {
    switch (type) {
      case 'Create': return 'bg-emerald-50';
      case 'Upload': return 'bg-blue-50';
      case 'Update': return 'bg-purple-50';
      case 'Add': return 'bg-amber-50';
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Timeline Actions */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-1">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">Audit Trail</h4>
            <p className="text-[10px] text-slate-400 font-medium">Track all major actions and updates made in the patient record.</p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex gap-2">
              {/* All Actions Filter */}
              <div className="relative">
                <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer shadow-sm">
                  <span>{actionFilter}</span>
                  <ChevronDown size={12} className="text-slate-400" />
                </button>
              </div>

              {/* All Time Filter */}
              <div className="relative">
                <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer shadow-sm">
                  <span>{timeFilter}</span>
                  <ChevronDown size={12} className="text-slate-400" />
                </button>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm"
              className="text-slate-600 border-slate-200 hover:bg-slate-50 font-bold flex items-center gap-1.5 text-[10px] shadow-sm rounded-xl py-2 px-3.5"
            >
              <Download size={12} />
              Export Log
            </Button>
          </div>

          {/* Vertical Timeline container */}
          <div className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100/80 space-y-5 pt-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="relative flex gap-4 items-start group">
                
                {/* Timeline node */}
                <div className={`absolute -left-[30px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${getActionIconBg(log.actionType)}`}>
                  {getActionIcon(log.actionType)}
                </div>

                {/* Date & Time Column on Left */}
                <div className="w-28 shrink-0 space-y-0.5 pt-1">
                  <p className="font-extrabold text-[10px] text-slate-800 leading-none">{log.date}</p>
                  <p className="text-[9px] text-slate-400 font-semibold">{log.time}</p>
                </div>

                {/* Details Card on Right */}
                <Card className="flex-1 p-3.5 border border-slate-100 hover:border-slate-200 transition-all shadow-sm rounded-2xl flex justify-between items-center">
                  <div className="space-y-1">
                    <h5 className="font-black text-xs text-slate-900 tracking-tight leading-snug">{log.title}</h5>
                    <p className="text-[10px] text-slate-500 font-medium">{log.description}</p>
                    <div className="flex items-center gap-1 text-[9px] text-slate-400 font-semibold pt-0.5">
                      <User size={10} className="text-slate-350" />
                      by {log.actor}
                    </div>
                  </div>
                  <div className="shrink-0 pl-4">
                    {getActionBadge(log.actionType)}
                  </div>
                </Card>

              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center pt-2">
            <button className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-xl px-4 py-2 hover:bg-slate-50 shadow-sm cursor-pointer transition-all">
              Load More <ChevronDown size={12} />
            </button>
          </div>
        </div>

        {/* Right Column: Statistics & Summary */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Audit Summary Card */}
          <Card className="p-5 border border-slate-100 rounded-3xl shadow-sm text-left">
            <h4 className="font-extrabold text-xs text-slate-900 border-b border-slate-50 pb-3 mb-3.5 flex justify-between items-center">
              <span>Audit Summary</span>
              <FileText size={13} className="text-slate-400" />
            </h4>
            <div className="space-y-3.5 font-semibold text-[10px] text-slate-500">
              <div className="flex justify-between items-center">
                <span>Total Actions</span>
                <span className="font-black text-slate-800 text-[11px]">25</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Created By</span>
                <span className="font-black text-slate-800 text-[11px]">2 Users</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Action</span>
                <span className="font-black text-slate-800 text-[11px]">25 May 2026, 10:45 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Time Range</span>
                <span className="font-black text-slate-800 text-[11px]">All Time</span>
              </div>
            </div>
          </Card>

          {/* Action Types Donut Chart */}
          <Card className="p-5 border border-slate-100 rounded-3xl shadow-sm text-left">
            <h4 className="font-extrabold text-xs text-slate-900 border-b border-slate-50 pb-3 mb-3.5">
              Action Types
            </h4>
            
            <div className="flex flex-col items-center py-4 relative">
              {/* Premium SVG Donut Chart */}
              <svg width="120" height="120" viewBox="0 0 42 42" className="transform -rotate-90">
                {/* Background circle */}
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="4.5" />
                
                {/* 1. Update: 36% (dasharray 36 64) */}
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#a855f7" strokeWidth="4.5" strokeDasharray="36 64" strokeDashoffset="0" />
                
                {/* 2. Add: 28% (dasharray 28 72, offset -36) */}
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray="28 72" strokeDashoffset="-36" />
                
                {/* 3. Create: 24% (dasharray 24 76, offset -64) */}
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" strokeDasharray="24 76" strokeDashoffset="-64" />
                
                {/* 4. Upload: 12% (dasharray 12 88, offset -88) */}
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.5" strokeDasharray="12 88" strokeDashoffset="-88" />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                <span className="text-[12px] font-black text-slate-800">25</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
              </div>
            </div>

            {/* Chart Legend */}
            <div className="space-y-2 mt-4 pt-3 border-t border-slate-50 text-[10px] font-semibold text-slate-500">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span>Create</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-800">6</span>
                  <span className="text-slate-400 w-8 text-right font-medium">(24%)</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                  <span>Update</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-800">9</span>
                  <span className="text-slate-400 w-8 text-right font-medium">(36%)</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                  <span>Add</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-800">7</span>
                  <span className="text-slate-400 w-8 text-right font-medium">(28%)</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                  <span>Upload</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-800">3</span>
                  <span className="text-slate-400 w-8 text-right font-medium">(12%)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Tamper proof security badge */}
          <Card className="p-4 border border-slate-100 bg-[#f0f6ff]/50 rounded-2xl flex items-center gap-3">
            <ShieldCheck size={18} className="text-blue-650 shrink-0" />
            <p className="text-[9.5px] font-bold text-blue-750 text-left leading-snug">
              Audit logs are tamper-proof and HIPAA compliant.
            </p>
          </Card>

        </div>

      </div>
    </div>
  );
};
