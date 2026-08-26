import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreatePatientModal } from '../../features/patient/components/CreatePatientModal';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Plus, 
  Search,
  Grid, 
  List, 
  User,
  Users,
  Bed,
  Activity
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { patients, setActivePatientId, setCurrentPage, setActiveTab, currentUser, refreshPatients } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'ALL' | 'ICU' | 'WARD' | 'DISCHARGED'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Dynamic metrics calculation
  const totalCount = patients.length;
  const icuCount = patients.filter(p => p.status === 'ICU').length;
  const wardCount = patients.filter(p => p.status === 'WARD' || p.status === 'ACTIVE').length;
  const dischargedCount = patients.filter(p => p.status === 'DISCHARGED').length;

  const filteredPatients = patients.filter(p => {
    // Status filter
    if (filterTab === 'ICU' && p.status !== 'ICU') return false;
    if (filterTab === 'WARD' && p.status !== 'WARD' && p.status !== 'ACTIVE') return false;
    if (filterTab === 'DISCHARGED' && p.status !== 'DISCHARGED') return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchMrn = (p.hospital_patient_id || '').toLowerCase().includes(q);
      const matchDept = (p.department || '').toLowerCase().includes(q);
      return matchName || matchMrn || matchDept;
    }

    return true;
  });

  const handlePatientClick = (patientId: string) => {
    setActivePatientId(patientId);
    setActiveTab('timeline');
    setCurrentPage('patient-workspace');
  };

  const handlePatientCreated = async (newPatientId: string) => {
    await refreshPatients();
    setActivePatientId(newPatientId);
    setActiveTab('timeline');
    setCurrentPage('patient-workspace');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner & Quick Metrics */}
      <div className="grid md:grid-cols-12 gap-6 items-center">
        {/* Welcome Text */}
        <div className="md:col-span-4 space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Welcome, {currentUser?.name || 'Dr. Deepak Bhasin'} 👋
          </h2>
          <p className="text-xs text-slate-400 font-medium">Clinote Clinical Dashboard • Phase 1 Foundation</p>
        </div>

        {/* Metrics Blocks */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-3.5 flex items-center justify-between border-l-4 border-l-slate-400 bg-white">
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Total Patients</span>
              <p className="text-xl font-black text-slate-800 leading-none">{totalCount}</p>
            </div>
            <div className="p-2 bg-slate-50 text-slate-400 rounded-xl">
              <Users size={16} />
            </div>
          </Card>

          <Card className="p-3.5 flex items-center justify-between border-l-4 border-l-rose-500 bg-white">
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">ICU Active</span>
              <p className="text-xl font-black text-rose-600 leading-none">{icuCount}</p>
            </div>
            <div className="p-2 bg-rose-50 text-rose-500 rounded-xl">
              <Bed size={16} />
            </div>
          </Card>

          <Card className="p-3.5 flex items-center justify-between border-l-4 border-l-purple-500 bg-white">
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Ward Patients</span>
              <p className="text-xl font-black text-purple-600 leading-none">{wardCount}</p>
            </div>
            <div className="p-2 bg-purple-50 text-purple-500 rounded-xl">
              <User size={16} />
            </div>
          </Card>

          <Card className="p-3.5 flex items-center justify-between border-l-4 border-l-emerald-500 bg-white">
            <div className="space-y-0.5">
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Discharged</span>
              <p className="text-xl font-black text-emerald-600 leading-none">{dischargedCount}</p>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
              <Activity size={16} />
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content Area */}
      <Card className="p-6 space-y-5 bg-white border border-slate-200">
        {/* Search Bar & Action Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name, MRN, or department..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-800 transition-all"
            />
          </div>

          {/* Actions & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Tabs */}
            <div className="flex items-center bg-slate-100/90 rounded-xl p-1 text-xs font-bold text-slate-500">
              <button 
                onClick={() => setFilterTab('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${filterTab === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-800'}`}
              >
                All <span className="ml-1 text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full">{totalCount}</span>
              </button>
              <button 
                onClick={() => setFilterTab('ICU')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${filterTab === 'ICU' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-800'}`}
              >
                ICU <span className="ml-1 text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full">{icuCount}</span>
              </button>
              <button 
                onClick={() => setFilterTab('WARD')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${filterTab === 'WARD' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-800'}`}
              >
                Ward <span className="ml-1 text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">{wardCount}</span>
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-slate-400">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-slate-800 shadow-xs' : 'hover:text-slate-600'}`}
              >
                <Grid size={14} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-slate-800 shadow-xs' : 'hover:text-slate-600'}`}
              >
                <List size={14} />
              </button>
            </div>

            {/* Create Patient Button */}
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
            >
              <Plus size={16} />
              Create Patient
            </Button>
          </div>
        </div>

        {/* Patients Display */}
        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3 border-2 border-dashed border-slate-100 rounded-2xl">
            <User size={32} className="mx-auto text-slate-300" />
            <p className="text-xs font-semibold">No patients matching your search criteria.</p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
              Create Patient
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map(patient => {
              const statusColor = patient.status === 'ICU' 
                ? 'bg-rose-50 text-rose-700 border-rose-200' 
                : patient.status === 'WARD'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200';

              return (
                <div
                  key={patient.id}
                  onClick={() => handlePatientClick(patient.id)}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer space-y-4 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs group-hover:from-emerald-600 group-hover:to-teal-600 group-hover:text-white transition-all shadow-xs">
                        {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {patient.name}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">
                          {patient.hospital_patient_id || 'MRN-PENDING'}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-extrabold border uppercase tracking-wider ${statusColor}`}>
                      {patient.status}
                    </span>
                  </div>

                  {/* Demographic & Unit Details */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 bg-slate-50/70 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">Demographics</span>
                      <p className="font-bold text-slate-700">
                        {patient.age ? `${patient.age}y` : ''} • {patient.gender === 'male' || patient.gender === 'M' ? 'Male' : 'Female'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">Department / Bed</span>
                      <p className="font-bold text-slate-700 truncate">
                        {patient.department || 'General'} • {patient.bed_number || patient.bedNumber || 'TBD'}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Attending: <strong className="text-slate-600">{patient.consultant || 'Dr. Deepak Bhasin'}</strong></span>
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Open Profile →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List / Table View */
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-extrabold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">MRN</th>
                  <th className="py-3 px-4">Age / Gender</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Bed</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map(patient => (
                  <tr 
                    key={patient.id}
                    onClick={() => handlePatientClick(patient.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-slate-900">{patient.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 font-semibold">{patient.hospital_patient_id}</td>
                    <td className="py-3 px-4 text-slate-600">{patient.age ? `${patient.age}y` : ''} • {patient.gender}</td>
                    <td className="py-3 px-4 text-slate-700">{patient.department || 'General Medicine'}</td>
                    <td className="py-3 px-4 text-slate-700">{patient.bed_number || patient.bedNumber || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        patient.status === 'ICU' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-blue-600 font-bold hover:underline">
                      Open Profile →
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal */}
      <CreatePatientModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handlePatientCreated}
      />
    </div>
  );
};
