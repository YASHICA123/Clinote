import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClinoteLogo } from '../components/ui/ClinoteLogo';
import { 
  Bell, 
  Search, 
  ChevronDown, 
  LogOut, 
  Settings, 
  ShieldAlert,
  CheckCircle,
  Info
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { 
    setCurrentPage, 
    setActivePatientId, 
    currentUser, 
    logout,
    notifications,
    setNotifications
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNavClick = (page: 'dashboard' | 'settings') => {
    setCurrentPage(page);
    setActivePatientId(null); // Clear active patient to go back to dashboard
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Bar Header */}
      <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between z-20 shrink-0">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-6 flex-1">
          {/* Rebranded Styled Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none shrink-0" 
            onClick={() => handleNavClick('dashboard')}
          >
            <ClinoteLogo size={32} />
            <div>
              <h1 className="font-extrabold text-base leading-none tracking-tight">
                <span className="text-slate-900">CLI</span>
                <span className="text-emerald-600">NOTE</span>
              </h1>
              <span className="text-[9px] text-emerald-600 font-bold tracking-wide block pt-0.5">Clinical Intelligence</span>
            </div>
          </div>

          <span className="h-6 w-[1px] bg-slate-200 hidden md:block"></span>

          {/* Search Bar */}
          <div className="relative w-full max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by Name, Bed, or Patient ID...  (⌘ K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-100 rounded-xl text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all duration-200"
            />
          </div>
        </div>

            {/* Right: Notifications & User Profile */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors duration-200"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-30">
                    <div className="px-4 py-2 border-b border-slate-50 flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900">Recent Alerts</span>
                      <button 
                        onClick={() => {
                          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                          setShowNotifications(false);
                        }}
                        className="text-[10px] text-emerald-600 hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">No new alerts</div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              markNotificationRead(notif.id);
                              if (notif.message.includes('Rajinder N. Sharma')) {
                                setActivePatientId('150612771');
                                setCurrentPage('patient-workspace');
                              }
                              setShowNotifications(false);
                            }}
                            className={`p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                              !notif.isRead ? 'bg-slate-50/50' : ''
                            }`}
                          >
                            <div className="mt-0.5">
                              {notif.type === 'warning' && <ShieldAlert size={14} className="text-red-500" />}
                              {notif.type === 'success' && <CheckCircle size={14} className="text-emerald-500" />}
                              {notif.type === 'info' && <Info size={14} className="text-blue-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs ${!notif.isRead ? 'font-semibold text-slate-950' : 'text-slate-700'}`}>
                                {notif.title}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                              <span className="text-[9px] text-slate-400 block mt-1">{notif.time}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Info */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 p-1 hover:bg-slate-50 rounded-xl transition-all duration-200"
                >
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'}
                    alt={currentUser?.name || 'Doctor'}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="font-semibold text-xs text-slate-950 leading-tight">
                      {currentUser?.name || 'Dr. Deepak Bhasin'}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-none">
                      {currentUser?.department || 'Pulmonology Team'}
                    </p>
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 text-xs">
                    <button
                      onClick={() => {
                        setCurrentPage('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Settings size={14} />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-50"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
            {children}
          </main>

          {/* HIPAA & Security Footer */}
          <footer className="h-10 bg-white border-t border-slate-100 flex items-center justify-center text-[10px] text-slate-400 gap-1.5 shrink-0">
            <span>CLINOTE Clinical Intelligence</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">Secure</span>
            <span>•</span>
            <span className="text-slate-600 font-semibold">HIPAA Compliant</span>
          </footer>
    </div>
  );
};
