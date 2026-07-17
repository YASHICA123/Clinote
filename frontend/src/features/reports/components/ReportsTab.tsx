import React, { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import type { Report } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Loader } from '../../../components/ui/Loader';
import { Button } from '../../../components/ui/Button';
import { FileText, Eye, Download, Calendar, ArrowRight } from 'lucide-react';

interface ReportsTabProps {
  patientId: string;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ patientId }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await reportService.getReports(patientId);
        setReports(data);
        if (data.length > 0) {
          setSelectedReport(data[0]); // Default first report
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [patientId]);

  if (loading) return <Loader label="Loading medical documents..." />;

  return (
    <div className="grid md:grid-cols-5 gap-6 text-left">
      
      {/* Reports List Column */}
      <div className="md:col-span-2 space-y-3">
        <h4 className="text-xs font-extrabold text-slate-800 tracking-wide uppercase">Reports Index</h4>
        <div className="space-y-2.5">
          {reports.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">No reports found.</div>
          ) : (
            reports.map(rep => {
              const isSelected = selectedReport?.id === rep.id;
              
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReport(rep)}
                  className={`p-3.5 border rounded-2xl cursor-pointer transition-all duration-200 flex gap-3 items-start relative overflow-hidden ${
                    isSelected 
                      ? 'border-emerald-500 bg-emerald-50/5 shadow-sm shadow-emerald-500/5' 
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    isSelected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-50 text-slate-400'
                  }`}>
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0 space-y-0.5 flex-1 pr-4">
                    <h5 className="font-extrabold text-xs text-slate-900 leading-tight truncate">{rep.title}</h5>
                    <p className="text-[9px] text-slate-400 font-semibold">{rep.category} • {rep.date}</p>
                  </div>
                  {isSelected && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-600">
                      <ArrowRight size={14} />
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Interactive PDF/Report Document Reader Column */}
      <div className="md:col-span-3">
        {selectedReport ? (
          <Card className="border border-slate-100 h-full flex flex-col justify-between overflow-hidden">
            <div>
              {/* Header */}
              <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[8px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedReport.status} Report
                  </span>
                  <h4 className="font-extrabold text-xs text-slate-900 leading-tight">{selectedReport.title}</h4>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" title="View Attachment" className="h-8 w-8 rounded-lg">
                    <Eye size={13} />
                  </Button>
                  <Button variant="outline" size="icon" title="Download Document" className="h-8 w-8 rounded-lg">
                    <Download size={13} />
                  </Button>
                </div>
              </div>

              {/* Document Text Body */}
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                  <Calendar size={11} />
                  <span>Reported Date: {selectedReport.date}</span>
                  <span className="mx-1">•</span>
                  <span>Category: {selectedReport.category}</span>
                </div>

                <div className="space-y-2">
                  <h5 className="font-extrabold text-[10px] text-slate-500 uppercase tracking-wider">Clinical Transcription Summary</h5>
                  <div className="p-4 bg-slate-50/40 rounded-2xl border border-slate-100/50 text-[11px] text-slate-700 leading-relaxed font-sans min-h-[160px] whitespace-pre-wrap">
                    {selectedReport.summary}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer stamp */}
            <div className="p-4 bg-slate-50/20 border-t border-slate-50 flex items-center justify-between text-[9px] text-slate-400 font-medium">
              <span>Digitally verified by CLINOTE NLP</span>
              <span>Ref ID: {selectedReport.id}</span>
            </div>
          </Card>
        ) : (
          <div className="h-full border border-dashed border-slate-200 rounded-3xl flex items-center justify-center p-8 text-slate-400 text-xs">
            Select a document from the index to read the clinical transcription.
          </div>
        )}
      </div>

    </div>
  );
};
