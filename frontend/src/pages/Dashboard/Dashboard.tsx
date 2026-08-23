import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdmitPatientModal } from '../../features/patient/components/AdmitPatientModal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { mockDischargedPatients } from '../../mock/patients';
import { 
  Plus, 
  Grid, 
  List, 
  SlidersHorizontal,
  ChevronRight,
  User,
  Users,
  Bed
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { patients, setActivePatientId, setCurrentPage, setActiveTab } = useApp();
  const [filterTab, setFilterTab] = useState<'ALL' | 'ICU' | 'WARD'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);

  // Dynamic metrics calculation
  const totalCount = patients.length;
  const icuCount = patients.filter(p => p.status === 'ICU').length;
  const wardCount = patients.filter(p => p.status === 'WARD').length;

  const filteredPatients = patients.filter(p => {
    if (filterTab === 'ICU') return p.status === 'ICU';
    if (filterTab === 'WARD') return p.status === 'WARD';
    return true;
  });

  const handlePatientClick = (patientId: string) => {
    setActivePatientId(patientId);
    setActiveTab('timeline');
    setCurrentPage('patient-workspace');
  };

  return (
    <div className="space-y-6">
      
      {/* Metrics Row & Banner */}
      <div className="grid md:grid-cols-4 gap-6 items-center">
        {/* Welcome Text */}
        <div className="md:col-span-1 space-y-1">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            Welcome, Dr. Deepak 👋
          </h2>
          <p className="text-[11px] text-slate-400 font-medium">Here's your patient overview</p>
        </div>

        {/* Metrics Blocks */}
        <div className="md:col-span-3 grid grid-cols-3 gap-4">
          <Card className="p-4 flex items-center justify-between border-l-4 border-l-slate-400">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Patients</span>
              <p className="text-xl font-black text-slate-800 leading-none">{totalCount}</p>
            </div>
            <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl">
              <User size={18} />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between border-l-4 border-l-blue-500">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">ICU Patients</span>
              <p className="text-xl font-black text-blue-600 leading-none">{icuCount}</p>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl">
              <Bed size={18} />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between border-l-4 border-l-purple-500">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Ward Patients</span>
              <p className="text-xl font-black text-purple-600 leading-none">{wardCount}</p>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-500 rounded-xl">
              <Users size={18} />
            </div>
          </Card>
        </div>
      </div>

      {/* Main Grid: Left is Patients List, Right is Sidebar */}
      <div className="grid lg:grid-cols-4 gap-6">
        
        {/* Left Side: Patient Overview Section */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-5 space-y-5">
            {/* Table Header Filter controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center border-b border-slate-50 pb-4">
              <div className="space-y-0.5 text-left">
                <h3 className="font-extrabold text-sm text-slate-900">Patient Overview</h3>
              </div>

              {/* Filters & Actions */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Tabs */}
                <div className="flex items-center bg-slate-100/80 rounded-xl p-0.5 text-[10px] font-semibold text-slate-500">
                  <button 
                    onClick={() => setFilterTab('ALL')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${filterTab === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-800'}`}
                  >
                    All <span className="ml-1 text-[8px] bg-slate-200 text-slate-600 px-1 py-0.2 rounded-full">{totalCount}</span>
                  </button>
                  <button 
                    onClick={() => setFilterTab('ICU')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${filterTab === 'ICU' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-800'}`}
                  >
                    ICU <span className="ml-1 text-[8px] bg-blue-100 text-blue-700 px-1 py-0.2 rounded-full">{icuCount}</span>
                  </button>
                  <button 
                    onClick={() => setFilterTab('WARD')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${filterTab === 'WARD' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-800'}`}
                  >
                    Ward <span className="ml-1 text-[8px] bg-purple-100 text-purple-700 px-1 py-0.2 rounded-full">{wardCount}</span>
                  </button>
                </div>

                {/* Admit button */}
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="flex items-center gap-1.5 font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-sm"
                  onClick={() => setIsAdmitModalOpen(true)}
                >
                  <Plus size={14} />
                  Admit Patient
                </Button>

                {/* Grid/List View switcher */}
                <div className="border border-slate-150 rounded-xl p-0.5 flex bg-white">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-50 text-slate-800' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    <Grid size={14} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-slate-50 text-slate-800' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    <List size={14} />
                  </button>
                </div>

                <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-slate-500 font-semibold">
                  <SlidersHorizontal size={13} />
                  Filter
                </Button>
              </div>
            </div>

            {/* Patients Display (Grid or List) */}
            {filteredPatients.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 font-medium">No patients found.</div>
            ) : viewMode === 'grid' ? (
              <div className="space-y-6 text-left">
                {/* ICU Patients subgrid */}
                {(filterTab === 'ALL' || filterTab === 'ICU') && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-blue-700 flex items-center gap-1.5 tracking-wide">
                      <Bed size={13} />
                      ICU Patients ({filteredPatients.filter(p => p.status === 'ICU').length})
                    </h4>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredPatients
                        .filter(p => p.status === 'ICU')
                        .map(patient => (
                          <div
                            key={patient.id}
                            onClick={() => handlePatientClick(patient.id)}
                            className="bg-white border border-slate-100 hover:border-blue-200 p-4 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 relative group flex gap-3.5"
                          >
                            {/* Bed graphic square */}
                            <div className="w-10 h-10 bg-blue-50/70 border border-blue-100/50 rounded-xl flex flex-col items-center justify-center shrink-0">
                              <span className="text-[11px] font-black text-blue-700 leading-none">{patient.bedNumber}</span>
                              <Bed size={10} className="text-blue-500 mt-0.5" />
                            </div>
                            
                            <div className="flex-1 min-w-0 space-y-1">
                              {patient.isNew && (
                                <span className="absolute top-2.5 right-2.5 px-1.5 py-0.2 bg-emerald-500 text-white rounded text-[8px] font-black uppercase tracking-wider">
                                  NEW
                                </span>
                              )}
                              <h5 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                                {patient.name}
                              </h5>
                              <p className="text-[9px] text-slate-400 font-medium">
                                {patient.age} Y / {patient.gender} • ID: {patient.id}
                              </p>
                              <div className="pt-1.5 flex gap-1">
                                <StatusBadge status="ICU" />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* WARD Patients subgrid */}
                {(filterTab === 'ALL' || filterTab === 'WARD') && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-extrabold text-purple-700 flex items-center gap-1.5 tracking-wide">
                      <Users size={13} />
                      Ward Patients ({filteredPatients.filter(p => p.status === 'WARD').length})
                    </h4>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredPatients
                        .filter(p => p.status === 'WARD')
                        .map(patient => (
                          <div
                            key={patient.id}
                            onClick={() => handlePatientClick(patient.id)}
                            className="bg-white border border-slate-100 hover:border-purple-200 p-4 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 relative group flex gap-3.5"
                          >
                            <div className="w-10 h-10 bg-purple-50/70 border border-purple-100/50 rounded-xl flex flex-col items-center justify-center shrink-0">
                              <span className="text-[11px] font-black text-purple-700 leading-none">{patient.bedNumber}</span>
                              <Users size={10} className="text-purple-500 mt-0.5" />
                            </div>

                            <div className="flex-1 min-w-0 space-y-1">
                              <h5 className="font-extrabold text-xs text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                                {patient.name}
                              </h5>
                              <p className="text-[9px] text-slate-400 font-medium">
                                {patient.age} Y / {patient.gender} • ID: {patient.id}
                              </p>
                              <div className="pt-1.5 flex gap-1">
                                <StatusBadge status="WARD" />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // List view implementation
              <div className="border border-slate-100 rounded-2xl overflow-hidden text-left">
                <div className="grid grid-cols-4 bg-slate-50 px-4 py-2.5 text-[9px] font-bold text-slate-400 tracking-wider border-b border-slate-100">
                  <span>PATIENT NAME & ID</span>
                  <span>STATUS & BED</span>
                  <span>ADMISSION DATE</span>
                  <span className="text-right">ACTIONS</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {filteredPatients.map(patient => (
                    <div 
                      key={patient.id} 
                      onClick={() => handlePatientClick(patient.id)}
                      className="grid grid-cols-4 px-4 py-3.5 hover:bg-slate-50 cursor-pointer items-center transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-950 truncate">{patient.name}</p>
                        <p className="text-[9px] text-slate-400">{patient.age} Y / {patient.gender} • ID: {patient.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={patient.status} />
                        <span className="font-bold text-[10px] text-slate-500">Bed {patient.bedNumber}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {patient.admissionDate}
                      </div>
                      <div className="flex justify-end">
                        <button className="p-1 text-slate-400 hover:text-emerald-600 rounded">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Side: Discharged Today */}
        <div className="space-y-6 text-left">
          {/* Discharged Today Card */}
          <Card className="p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Discharged Today</h3>
            
            <div className="space-y-3.5">
              {mockDischargedPatients.map(patient => (
                <div 
                  key={patient.id}
                  onClick={() => {
                    // Navigate to discharge tab of patient Rajinder N. Sharma or show clinical info
                    handlePatientClick(patient.id);
                    setActiveTab('discharge');
                  }}
                  className="flex justify-between items-center p-3 border border-slate-100 rounded-xl hover:border-emerald-200 cursor-pointer transition-all duration-200 group"
                >
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-extrabold text-xs text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
                      {patient.name}
                    </h4>
                    <p className="text-[9px] text-slate-400 font-medium">
                      {patient.age} Y / {patient.gender} • ID: {patient.id}
                    </p>
                    <span className="text-[9px] text-slate-400 font-bold block pt-0.5">{patient.dischargeTime}</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {/* Admit Patient Wizard Modal */}
      <AdmitPatientModal 
        isOpen={isAdmitModalOpen} 
        onClose={() => setIsAdmitModalOpen(false)} 
      />

    </div>
  );
};
