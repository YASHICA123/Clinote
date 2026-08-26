import React, { useState, useEffect } from 'react';
import { auditService } from '../services/auditService';
import type { AuditLog } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Loader } from '../../../components/ui/Loader';
import { ShieldCheck, Clock, User, Activity } from 'lucide-react';

interface AuditTabProps {
  patientId: string;
}

export const AuditTab: React.FC<AuditTabProps> = ({ patientId }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchLogs();
  }, [patientId]);

  if (loading) return <Loader label="Loading patient audit trail..." />;

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-600" />
            Compliance & Audit Trail
          </h3>
          <p className="text-xs text-slate-400">Immutable chronological record of patient access and modifications</p>
        </div>
      </div>

      <div className="space-y-3">
        {logs.length === 0 ? (
          <Card className="p-8 text-center text-slate-400 space-y-2 border-dashed">
            <Activity size={28} className="mx-auto text-slate-300" />
            <p className="text-xs font-semibold">No audit logs recorded yet.</p>
          </Card>
        ) : (
          logs.map(log => (
            <Card key={log.id} className="p-4 hover:border-slate-300 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] px-2.5 py-1 bg-slate-100 font-bold text-slate-700 rounded-lg font-mono uppercase">
                    {log.action}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {log.details || `Resource ${log.resource_type} modified`}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-slate-400">
                  {log.user_email && (
                    <span className="flex items-center gap-1">
                      <User size={11} />
                      {log.user_email}
                    </span>
                  )}
                  <span className="flex items-center gap-1 font-mono">
                    <Clock size={11} />
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
