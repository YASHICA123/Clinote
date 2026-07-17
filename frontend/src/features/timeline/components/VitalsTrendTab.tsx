import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Thermometer, Heart, Activity, Wind, Calendar, Info } from 'lucide-react';

interface VitalsTrendTabProps {
  patientId: string;
}

import { mockLatestVitals as latestVitals, mockVitalsDataPoints as dataPoints } from '../../../mock/vitals';
import type { VitalsDataPoint } from '../../../mock/vitals';

export const VitalsTrendTab: React.FC<VitalsTrendTabProps> = () => {
  const [activeRange, setActiveRange] = useState<'6h' | '24h' | '7d' | 'custom'>('24h');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // SVG dimensions for chart drawing
  const width = 650;
  const height = 280;
  const paddingLeft = 40;
  const paddingRight = 40;
  const paddingTop = 20;
  const paddingBottom = 45;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Helper to map values to Y-coordinates
  const getX = (index: number) => {
    return paddingLeft + (index / (dataPoints.length - 1)) * chartWidth;
  };

  // Vitals scaling helpers:
  // We want to map vitals ranges to Y coordinates to fit nicely on the chart (0 to 140 range)
  const getY = (val: number, minVal: number = 0, maxVal: number = 150) => {
    const ratio = (val - minVal) / (maxVal - minVal);
    return paddingTop + chartHeight - ratio * chartHeight;
  };



  // Map temperature to fit nicely in 0-150 range: e.g. temp * 3 (e.g. 37 * 3.2 = 118)
  const getTempPlotted = (temp: number) => temp * 3.2;

  // Generate SVG path for a line
  const generatePath = (key: keyof VitalsDataPoint | ((dp: VitalsDataPoint) => number)) => {
    return dataPoints.map((dp, i) => {
      const x = getX(i);
      const val = typeof key === 'function' ? key(dp) : (dp[key] as number);
      const y = getY(val, 0, 150);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Vitals Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Vitals Parameters Panel */}
        <div className="lg:col-span-4 space-y-3.5">
          
          {/* Temperature */}
          <div className="flex justify-between items-center bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
            <div className="flex items-center gap-3 pl-1.5">
              <div className="p-2 bg-red-50 text-red-650 rounded-xl">
                <Thermometer size={16} />
              </div>
              <div className="space-y-0.5">
                <p className="font-extrabold text-[11px] text-slate-800">Temperature (°C)</p>
                <p className="text-[9px] text-slate-400 font-semibold">Ref: 36.0 – 37.5</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-red-650">{latestVitals.temp}</span>
            </div>
          </div>

          {/* Heart Rate */}
          <div className="flex justify-between items-center bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-pink-500"></div>
            <div className="flex items-center gap-3 pl-1.5">
              <div className="p-2 bg-pink-50 text-pink-650 rounded-xl">
                <Heart size={16} />
              </div>
              <div className="space-y-0.5">
                <p className="font-extrabold text-[11px] text-slate-800">Heart Rate (bpm)</p>
                <p className="text-[9px] text-slate-400 font-semibold">Ref: 60 – 100</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-pink-600">{latestVitals.hr}</span>
            </div>
          </div>

          {/* Blood Pressure */}
          <div className="flex justify-between items-center bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
            <div className="flex items-center gap-3 pl-1.5">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Activity size={16} />
              </div>
              <div className="space-y-0.5">
                <p className="font-extrabold text-[11px] text-slate-800">Blood Pressure (mmHg)</p>
                <p className="text-[9px] text-slate-400 font-semibold">Ref: &lt;120/80</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-blue-600">{latestVitals.bp}</span>
            </div>
          </div>

          {/* SpO2 */}
          <div className="flex justify-between items-center bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-500"></div>
            <div className="flex items-center gap-3 pl-1.5">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <Wind size={16} className="rotate-90" />
              </div>
              <div className="space-y-0.5">
                <p className="font-extrabold text-[11px] text-slate-800">SpO₂ (%)</p>
                <p className="text-[9px] text-slate-400 font-semibold">Ref: ≥ 94</p>
              </div>
            </div>
            <div className="text-right flex items-center gap-1.5">
              <span className="text-lg font-black text-purple-700">{latestVitals.spo2}%</span>
            </div>
          </div>

          {/* Respiratory Rate */}
          <div className="flex justify-between items-center bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
            <div className="flex items-center gap-3 pl-1.5">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <Wind size={16} />
              </div>
              <div className="space-y-0.5">
                <p className="font-extrabold text-[11px] text-slate-800">Respiratory Rate (/min)</p>
                <p className="text-[9px] text-slate-400 font-semibold">Ref: 12 – 20</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-emerald-700">{latestVitals.rr}</span>
            </div>
          </div>

          <p className="text-[9px] text-slate-400 font-semibold pl-2 pt-1">
            Latest values from {latestVitals.time}
          </p>
        </div>

        {/* Right Side: Vitals Chart Visualization */}
        <div className="lg:col-span-8">
          <Card className="p-5 border border-slate-100 flex flex-col h-full justify-between">
            
            {/* Header controls for range selection */}
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-xs text-slate-900">Vitals Trend</h4>
                <p className="text-[10px] text-slate-400 font-medium">Track vital signs over time</p>
              </div>
              <div className="flex items-center bg-slate-50 border border-slate-100 p-0.5 rounded-xl text-[9px] font-extrabold text-slate-500 select-none">
                <button 
                  onClick={() => setActiveRange('6h')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeRange === '6h' ? 'bg-white text-emerald-700 shadow-sm border border-slate-100/50' : 'hover:text-slate-850'}`}
                >
                  6 Hours
                </button>
                <button 
                  onClick={() => setActiveRange('24h')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeRange === '24h' ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100' : 'hover:text-slate-850'}`}
                >
                  24 Hours
                </button>
                <button 
                  onClick={() => setActiveRange('7d')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeRange === '7d' ? 'bg-white text-emerald-700 shadow-sm border border-slate-100/50' : 'hover:text-slate-850'}`}
                >
                  7 Days
                </button>
                <button 
                  onClick={() => setActiveRange('custom')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${activeRange === 'custom' ? 'bg-white text-emerald-700 shadow-sm border border-slate-100/50' : 'hover:text-slate-850'}`}
                >
                  Custom <Calendar size={10} />
                </button>
              </div>
            </div>

            {/* SVG Chart Container */}
            <div className="relative w-full overflow-x-auto select-none pt-2">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                {/* Horizontal grid lines */}
                {[0, 20, 40, 60, 80, 100, 120, 140].map((val) => {
                  const y = getY(val, 0, 150);
                  return (
                    <g key={val}>
                      <line 
                        x1={paddingLeft} 
                        y1={y} 
                        x2={width - paddingRight} 
                        y2={y} 
                        stroke="#f1f5f9" 
                        strokeWidth="1" 
                      />
                      <text 
                        x={paddingLeft - 10} 
                        y={y + 3} 
                        textAnchor="end" 
                        className="text-[9px] fill-slate-400 font-bold font-sans"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* X-Axis and labels */}
                {dataPoints.map((dp, i) => {
                  const x = getX(i);
                  const linesText = dp.time.split('\n');
                  return (
                    <g key={i}>
                      <line 
                        x1={x} 
                        y1={paddingTop} 
                        x2={x} 
                        y2={paddingTop + chartHeight} 
                        stroke="#f8fafc" 
                        strokeWidth="1"
                      />
                      <text 
                        x={x} 
                        y={paddingTop + chartHeight + 15} 
                        textAnchor="middle" 
                        className="text-[9px] fill-slate-500 font-bold font-sans"
                      >
                        {linesText[0]}
                      </text>
                      <text 
                        x={x} 
                        y={paddingTop + chartHeight + 25} 
                        textAnchor="middle" 
                        className="text-[8px] fill-slate-400 font-medium font-sans"
                      >
                        {linesText[1]}
                      </text>
                    </g>
                  );
                })}

                {/* Draw Vitals lines */}
                {/* 1. Blood Pressure (Blue) */}
                <path d={generatePath('bpSystolic')} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* 2. Heart Rate (Pink) */}
                <path d={generatePath('hr')} fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* 3. SpO2 (Purple) */}
                <path d={generatePath('spo2')} fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* 4. Respiratory Rate (Green) */}
                <path d={generatePath('rr')} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* 5. Temperature (Red) */}
                <path d={generatePath(dp => getTempPlotted(dp.temp))} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Nodes drawing with Hover State Interaction */}
                {dataPoints.map((dp, i) => {
                  const x = getX(i);
                  return (
                    <g key={i}>
                      {/* BP point */}
                      <circle cx={x} cy={getY(dp.bpSystolic, 0, 150)} r={hoveredPointIndex === i ? 5 : 3.5} fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" className="cursor-pointer transition-all" onMouseEnter={() => setHoveredPointIndex(i)} onMouseLeave={() => setHoveredPointIndex(null)} />
                      {/* HR point */}
                      <circle cx={x} cy={getY(dp.hr, 0, 150)} r={hoveredPointIndex === i ? 5 : 3.5} fill="#ec4899" stroke="#ffffff" strokeWidth="1.5" className="cursor-pointer transition-all" onMouseEnter={() => setHoveredPointIndex(i)} onMouseLeave={() => setHoveredPointIndex(null)} />
                      {/* SpO2 point */}
                      <circle cx={x} cy={getY(dp.spo2, 0, 150)} r={hoveredPointIndex === i ? 5 : 3.5} fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" className="cursor-pointer transition-all" onMouseEnter={() => setHoveredPointIndex(i)} onMouseLeave={() => setHoveredPointIndex(null)} />
                      {/* RR point */}
                      <circle cx={x} cy={getY(dp.rr, 0, 150)} r={hoveredPointIndex === i ? 5 : 3.5} fill="#10b981" stroke="#ffffff" strokeWidth="1.5" className="cursor-pointer transition-all" onMouseEnter={() => setHoveredPointIndex(i)} onMouseLeave={() => setHoveredPointIndex(null)} />
                      {/* Temp point */}
                      <circle cx={x} cy={getY(getTempPlotted(dp.temp), 0, 150)} r={hoveredPointIndex === i ? 5 : 3.5} fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" className="cursor-pointer transition-all" onMouseEnter={() => setHoveredPointIndex(i)} onMouseLeave={() => setHoveredPointIndex(null)} />
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip Overlay */}
              {hoveredPointIndex !== null && (
                <div 
                  className="absolute bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-xl border border-slate-800 text-[10px] pointer-events-none space-y-1.5 transition-all z-20"
                  style={{
                    left: `${Math.min(getX(hoveredPointIndex) - 60, width - 160)}px`,
                    top: '20px'
                  }}
                >
                  <p className="font-extrabold text-slate-300 border-b border-slate-800 pb-1.5">
                    {dataPoints[hoveredPointIndex].time.replace('\n', ' ')}
                  </p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-semibold">
                    <span className="text-red-400">Temp:</span>
                    <span className="text-right">{dataPoints[hoveredPointIndex].temp} °C</span>
                    
                    <span className="text-pink-400">HR:</span>
                    <span className="text-right">{dataPoints[hoveredPointIndex].hr} bpm</span>
                    
                    <span className="text-blue-400">BP:</span>
                    <span className="text-right">{dataPoints[hoveredPointIndex].bpSystolic}/{dataPoints[hoveredPointIndex].bpDiastolic}</span>
                    
                    <span className="text-purple-400">SpO₂:</span>
                    <span className="text-right">{dataPoints[hoveredPointIndex].spo2}%</span>
                    
                    <span className="text-emerald-400">RR:</span>
                    <span className="text-right">{dataPoints[hoveredPointIndex].rr}/min</span>
                  </div>
                </div>
              )}
            </div>

            {/* Custom chart legend */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 pt-3 border-t border-slate-50 text-[10px] font-bold text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shrink-0" />
                Temperature (°C)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899] shrink-0" />
                Heart Rate (bpm)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6] shrink-0" />
                Blood Pressure (mmHg)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7] shrink-0" />
                SpO₂ (%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shrink-0" />
                Respiratory Rate (/min)
              </span>
            </div>

          </Card>
        </div>

      </div>

      {/* Vitals Footer Banner matching visual specs */}
      <div className="w-full bg-[#f0f6ff] border border-[#d6e4ff] text-blue-750 p-4 rounded-3xl flex items-start sm:items-center gap-3">
        <Info size={16} className="text-blue-600 shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-[10px] font-semibold leading-normal">
          All updates including Course in Hospital, Antibiotic Timeline & Discharge Summary memory will be updated automatically.
        </p>
      </div>

    </div>
  );
};
