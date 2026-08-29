import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Patient, Doctor, Notification } from '../types';
import { patientService } from '../features/patient/services/patientService';
import { notificationService } from '../features/notifications/services/notificationService';
import { http } from '../services/http';
import { config } from '../services/config';

export type PageType = 'login' | 'dashboard' | 'patient-workspace' | 'settings';
export type PatientTabType = 'overview' | 'timeline' | 'documents' | 'encounters' | 'audit' | 'discharge' | 'medications' | 'investigations' | 'reports' | 'course';

interface AppContextType {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  activePatientId: string | null;
  setActivePatientId: (id: string | null) => void;
  activeTab: PatientTabType;
  setActiveTab: (tab: PatientTabType) => void;
  currentUser: Doctor | null;
  setCurrentUser: (user: Doctor | null) => void;
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  refreshPatients: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  loading: boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PatientTabType>('timeline');
  const [currentUser, setCurrentUser] = useState<Doctor | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore session from token on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userRes = await http.get<any>(`${config.apiUrl}/auth/me`);
        if (userRes) {
          const doctor: Doctor = {
            id: userRes.id,
            name: userRes.name,
            email: userRes.email,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userRes.name)}`,
            specialty: userRes.specialty || 'General Practitioner',
            department: userRes.specialty || 'Internal Medicine'
          };
          setCurrentUser(doctor);
          setCurrentPage('dashboard');
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        localStorage.removeItem('token');
        setCurrentPage('login');
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  // Fetch data whenever user is logged in
  useEffect(() => {
    if (!currentUser) {
      setPatients([]);
      setNotifications([]);
      return;
    }

    const loadData = async () => {
      try {
        const pList = await patientService.getPatients();
        const nList = await notificationService.getNotifications();
        setPatients(pList);
        setNotifications(nList);
      } catch (err) {
        console.error('Failed to load data after auth change:', err);
      }
    };
    loadData();
  }, [currentUser]);

  const refreshPatients = async () => {
    if (!currentUser) return;
    const pList = await patientService.getPatients();
    setPatients(pList);
  };

  const refreshNotifications = async () => {
    if (!currentUser) return;
    const nList = await notificationService.getNotifications();
    setNotifications(nList);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setCurrentPage('login');
    setActivePatientId(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        activePatientId,
        setActivePatientId,
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUser,
        patients,
        setPatients,
        notifications,
        setNotifications,
        refreshPatients,
        refreshNotifications,
        loading,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
