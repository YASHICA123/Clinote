import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { 
  Download, 
  MoreHorizontal, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw, 
  Maximize2, 
  Info, 
  ChevronDown, 
  Calendar,
  Image as ImageIcon
} from 'lucide-react';

import { mockInvestigationReports as investigations } from '../../../mock/investigations';

interface InvestigationTabProps {
  patientId?: string;
}

export const InvestigationTab: React.FC<InvestigationTabProps> = () => {
  const [selectedId, setSelectedId] = useState('inv-1');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);

  const selectedInv = investigations.find(i => i.id === selectedId) || investigations[0];

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));
  const handleRotateLeft = () => setRotation(prev => (prev - 90) % 360);
  const handleRotateRight = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setZoomLevel(100);
    setRotation(0);
  };

  return (
    <div className="space-y-5 text-left">
      
      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Scrollable List (Col span 4) */}
        <div className="lg:col-span-4 space-y-3.5">
          <div className="space-y-1">
            <h4 className="font-extrabold text-xs text-slate-900 leading-none">Investigations (Radiology)</h4>
            <p className="text-[10px] text-slate-400 font-medium">All radiology reports and images are stored securely.</p>
          </div>

          {/* List Controls */}
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-650 hover:bg-slate-50 shadow-sm cursor-pointer select-none">
              <span>All Types</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-650 hover:bg-slate-50 shadow-sm cursor-pointer select-none">
              <Calendar size={12} className="text-slate-400" />
              <span>Latest First</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>
          </div>

          {/* List items */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {investigations.map((inv) => (
              <div
                key={inv.id}
                onClick={() => setSelectedId(inv.id)}
                className={`p-4 border rounded-2xl cursor-pointer transition-all flex items-center justify-between shadow-sm select-none ${
                  selectedId === inv.id 
                    ? 'border-purple-300 bg-purple-50/20 ring-1 ring-purple-100' 
                    : 'border-slate-100 bg-white hover:border-slate-250'
                }`}
              >
                <div className="flex gap-3 items-center">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    selectedId === inv.id ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <ImageIcon size={14} />
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-extrabold text-[11px] text-slate-900 leading-tight truncate max-w-[170px]">{inv.testName}</h5>
                    <p className="text-[9px] text-slate-400 font-bold">{inv.date}</p>
                    <p className="text-[9px] text-slate-400 font-semibold">{inv.reportedBy}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  {inv.status === 'Normal' ? (
                    <Badge className="bg-[#e6fbf3] text-[#10b981] font-bold text-[8.5px] border-transparent px-2 py-0.2 rounded-lg">Normal</Badge>
                  ) : (
                    <Badge className="bg-[#fff3eb] text-[#f97316] font-bold text-[8.5px] border-transparent px-2 py-0.2 rounded-lg">Abnormal</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <button className="w-full text-center py-2 border border-slate-150 rounded-2xl text-[10px] font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-sm">
            Load More <ChevronDown size={11} className="inline ml-1" />
          </button>
        </div>

        {/* Right Column: Detailed Viewer (Col span 8) */}
        <div className="lg:col-span-8">
          <Card className="border border-slate-100 p-5 rounded-3xl space-y-4">
            
            {/* Viewer Header */}
            <div className="flex justify-between items-start border-b border-slate-50 pb-3.5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-slate-900 tracking-tight">{selectedInv.testName}</h4>
                  {selectedInv.status === 'Normal' ? (
                    <Badge className="bg-[#e6fbf3] text-[#10b981] font-bold text-[9px] border-transparent px-2 py-0.5 rounded-lg">Normal</Badge>
                  ) : (
                    <Badge className="bg-[#fff3eb] text-[#f97316] font-bold text-[9px] border-transparent px-2 py-0.5 rounded-lg">Abnormal</Badge>
                  )}
                </div>
                <p className="text-[9px] text-slate-400 font-bold">
                  {selectedInv.date} <span className="text-slate-200 px-1">|</span> Reported by: {selectedInv.reportedBy}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-slate-600 border-slate-200 bg-white hover:bg-slate-50 font-bold flex items-center gap-1 text-[10px] rounded-xl px-3.5"
                >
                  <Download size={12} />
                  Download Report
                </Button>
                <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer shadow-sm transition-all">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>

            {/* Viewer Body Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Left Part: Interactive X-ray Image (Col span 7) */}
              <div className="md:col-span-7 flex flex-col items-center gap-4 bg-slate-950 p-4 rounded-3xl border border-slate-800 shadow-inner relative overflow-hidden">
                <div className="w-full aspect-[4/3] flex items-center justify-center overflow-hidden bg-slate-900 rounded-2xl relative select-none">
                  {/* Styled High Quality Radiology Image */}
                  <img 
                    src={selectedInv.imageUrl} 
                    alt={selectedInv.testName} 
                    className="w-full h-full object-cover transition-all duration-200"
                    style={{
                      transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                      filter: 'contrast(1.4) brightness(0.8) grayscale(1)'
                    }}
                  />
                  
                  {/* Anatomical Marker Overlay */}
                  <div className="absolute top-3 right-4 font-black text-sm text-white/55 font-mono select-none">
                    R
                  </div>
                </div>

                {/* Toolbar Controls */}
                <div className="flex items-center justify-between w-full text-[9px] font-bold text-slate-450 border-t border-slate-800/80 pt-3 select-none">
                  <div className="flex items-center gap-1">
                    <span>Zoom</span>
                    <button onClick={handleZoomOut} className="p-1 border border-slate-800 rounded bg-slate-900 hover:bg-slate-850 hover:text-white cursor-pointer"><ZoomOut size={11} /></button>
                    <span className="w-10 text-center font-extrabold text-white">{zoomLevel}%</span>
                    <button onClick={handleZoomIn} className="p-1 border border-slate-800 rounded bg-slate-900 hover:bg-slate-850 hover:text-white cursor-pointer"><ZoomIn size={11} /></button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span>Rotate</span>
                    <button onClick={handleRotateLeft} className="p-1 border border-slate-800 rounded bg-slate-900 hover:bg-slate-850 hover:text-white cursor-pointer"><RotateCcw size={11} /></button>
                    <button onClick={handleRotateRight} className="p-1 border border-slate-800 rounded bg-slate-900 hover:bg-slate-850 hover:text-white cursor-pointer"><RotateCw size={11} /></button>
                  </div>

                  <button 
                    onClick={handleReset} 
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded hover:bg-slate-850 hover:text-white cursor-pointer"
                  >
                    <Maximize2 size={10} />
                    Open Full Screen
                  </button>
                </div>
              </div>

              {/* Right Part: Findings and AI Summary (Col span 5) */}
              <div className="md:col-span-5 space-y-4">
                
                {/* Findings Section */}
                <div className="space-y-1.5">
                  <h5 className="font-extrabold text-xs text-slate-850">Findings</h5>
                  <ul className="list-disc pl-4 space-y-1 text-[10px] text-slate-600 font-medium">
                    {selectedInv.findings.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                {/* Impression Section */}
                <div className="space-y-1.5 pt-1">
                  <h5 className="font-extrabold text-xs text-slate-850">Impression</h5>
                  <ul className="list-disc pl-4 space-y-1 text-[10px] text-slate-600 font-medium">
                    <li>{selectedInv.impression}</li>
                  </ul>
                </div>

                {/* AI Summary Banner */}
                <div className="bg-[#f0f6ff] border border-[#d6e4ff] text-blue-750 p-3 rounded-2xl text-[9px] font-semibold leading-normal">
                  This is an AI-assisted summary. Please refer to the official report for complete details.
                </div>

              </div>

            </div>

          </Card>
        </div>

      </div>

      {/* Footer Info Banner */}
      <div className="w-full bg-[#f0f6ff] border border-[#d6e4ff] text-blue-750 p-4 rounded-3xl flex items-center gap-3">
        <Info size={16} className="text-blue-600 shrink-0" />
        <p className="text-[10px] font-semibold">
          All radiology reports are AI-indexed for quick insights and comparison.
        </p>
      </div>

    </div>
  );
};
