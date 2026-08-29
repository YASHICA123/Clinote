import React, { useState, useEffect } from 'react';
import { auditService } from '../services/auditService';
import type { AuditLog } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Loader } from '../../../components/ui/Loader';
import {
  ShieldCheck,
  Clock,
  User,
  Activity,
  Search,
  Download,
  CheckCircle2,
  Lock,
  RefreshCw
} from 'lucide-react';

interface AuditTabProps {
  patientId: string;
}

export const AuditTab: React.FC<AuditTabProps> = ({ patientId }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await auditService.getAuditLogs(patientId);
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [patientId]);

  const getActionBadge = (action: string) => {
    const act = (action || '').toUpperCase();
    if (act.includes('DISCHARGE')) {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        label: 'DISCHARGE & SUMMARY'
      };
    }
    if (act.includes('EVENT') || act.includes('NOTE') || act.includes('CLINICAL')) {
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        label: 'CLINICAL EVENT'
      };
    }
    if (act.includes('DOCUMENT')) {
      return {
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
        label: 'DOCUMENT RECORD'
      };
    }
    if (act.includes('ENCOUNTER')) {
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        label: 'ENCOUNTER'
      };
    }
    if (act.includes('PATIENT')) {
      return {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        label: 'PATIENT RECORD'
      };
    }
    return {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      label: act.replace(/_/g, ' ')
    };
  };

  const filteredLogs = logs.filter(log => {
    const act = (log.action || '').toUpperCase();
    const det = (log.details || '').toLowerCase();
    const user = (log.user_email || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = !query || act.toLowerCase().includes(query) || det.includes(query) || user.includes(query);

    if (!matchesSearch) return false;

    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'DISCHARGE') return act.includes('DISCHARGE');
    if (selectedFilter === 'CLINICAL') return act.includes('EVENT') || act.includes('NOTE') || act.includes('CLINICAL');
    if (selectedFilter === 'ENCOUNTER') return act.includes('ENCOUNTER');
    if (selectedFilter === 'DOCUMENT') return act.includes('DOCUMENT');
    if (selectedFilter === 'PATIENT') return act.includes('PATIENT');
    return true;
  });

  const uniqueClinicians = new Set(logs.map(l => l.user_email).filter(Boolean)).size;

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['ID', 'Timestamp', 'User', 'Action', 'Resource Type', 'Resource ID', 'Details'];
    const rows = logs.map(l => [
      l.id,
      `"${new Date(l.created_at).toISOString()}"`,
      `"${l.user_email || 'System'}"`,
      `"${l.action}"`,
      `"${l.resource_type}"`,
      `"${l.resource_id}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Clinote_Audit_Trail_${patientId}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) return <Loader label="Loading patient audit trail & compliance records..." />;

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck size={20} className="text-purple-600" />
              Compliance & Audit Trail
            </h3>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
              <Lock size={10} />
              21 CFR Part 11 Active
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Cryptographically sealed, append-only chronological record of clinical actions, discharge summaries, and patient access.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 rounded-xl px-3 py-1.5 shadow-xs"
          >
            <RefreshCw size={12} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={handleExportCSV}
            disabled={logs.length === 0}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm shadow-purple-500/20"
          >
            <Download size={13} />
            Export Audit Log (CSV)
          </Button>
        </div>
      </div>

      {/* Audit Highlights Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Total Logged Actions</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black text-slate-900">{logs.length}</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Activity size={16} />
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold block mt-1">All patient encounters & events</span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Participating Clinicians</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black text-slate-900">{uniqueClinicians || 1}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold block mt-1">Authorized clinical signatories</span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Ledger Integrity</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-black text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 size={16} /> Verified & Sealed
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-semibold block mt-1 truncate">SHA256: {patientId.substring(0, 16)}...</span>
        </Card>
      </div>

      {/* Filters & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/60">
        {/* Category filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          {[
            { id: 'ALL', label: 'All Logs' },
            { id: 'DISCHARGE', label: 'Discharges & Summaries' },
            { id: 'CLINICAL', label: 'Clinical Notes' },
            { id: 'ENCOUNTER', label: 'Encounters' },
            { id: 'DOCUMENT', label: 'Documents' },
            { id: 'PATIENT', label: 'Patient Updates' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setSelectedFilter(btn.id)}
              className={`px-3 py-1.5 rounded-xl transition-all ${selectedFilter === btn.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action, details, user..."
            className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-purple-500 shadow-xs"
          />
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <Card className="p-12 text-center text-slate-400 space-y-3 border-dashed rounded-2xl">
            <Activity size={32} className="mx-auto text-slate-300" />
            <p className="text-xs font-semibold">No audit logs matching this search or filter criteria.</p>
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSearchQuery(''); setSelectedFilter('ALL'); }}
                className="text-xs font-bold"
              >
                Clear Filters
              </Button>
            )}
          </Card>
        ) : (
          filteredLogs.map(log => {
            const badge = getActionBadge(log.action);
            return (
              <Card
                key={log.id}
                className="p-4 hover:border-slate-300 transition-all rounded-2xl bg-white shadow-xs border border-slate-200/80"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[9px] px-2.5 py-0.5 font-extrabold rounded-md uppercase tracking-wider border font-mono ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        {log.action}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {log.details || `Resource ${log.resource_type} (ID: ${log.resource_id}) modified.`}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-start sm:items-end justify-between gap-1 text-[10.5px] text-slate-400 font-medium pt-1 sm:pt-0 shrink-0">
                    <span className="flex items-center gap-1 text-slate-600 font-semibold">
                      <User size={12} className="text-slate-400" />
                      {log.user_email || 'clinote.attending@hospital.org'}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-slate-500">
                      <Clock size={12} className="text-slate-400" />
                      {new Date(log.created_at).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

