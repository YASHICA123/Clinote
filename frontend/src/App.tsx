import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { PatientWorkspace } from './pages/Patient/PatientWorkspace';
import { Settings } from './pages/Settings/Settings';
import { DashboardLayout } from './layouts/DashboardLayout';

const AppContent: React.FC = () => {
  const { currentPage, currentUser } = useApp();

  // If not logged in or on the login page, render login screen
  if (!currentUser || currentPage === 'login') {
    return <Login />;
  }

  return (
    <DashboardLayout>
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'patient-workspace' && <PatientWorkspace />}
      {currentPage === 'settings' && <Settings />}
    </DashboardLayout>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
