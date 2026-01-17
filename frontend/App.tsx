
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserRole } from './types';

// Layouts & Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import LandingPage from './features/landing/LandingPage';
import Login from './features/auth/Login';
import SignUp from './features/auth/SignUp';
import CitizenDashboard from './features/citizen/CitizenDashboard';
import CitizenRequests from './features/citizen/CitizenRequests';
import CitizenAssets from './features/citizen/CitizenAssets';
import CitizenLogs from './features/citizen/CitizenLogs';
import CompanyDashboard from './features/company/CompanyDashboard';
import CompanyRequestForm from './features/company/CompanyRequestForm';
import CompanySessions from './features/company/CompanySessions';
import AdminDashboard from './features/admin/AdminDashboard';
import AdminSecurity from './features/admin/AdminSecurity';
import ExamplePortals from './features/examples/ExamplePortals';
import ProtectedRoute from './routes/ProtectedRoute';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  // Initialize as true so the dashboard is functional on first login for desktop
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfcfc] dark:bg-slate-950 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f172a] dark:border-white mb-4"></div>
        <p className="text-[#0f172a] dark:text-white text-xs font-black uppercase tracking-widest animate-pulse">Initializing IDTrust Secure Protocols...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#fcfcfc] dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      {user && (
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} role={user.role} />
      )}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {user && <Navbar setSidebarOpen={setSidebarOpen} />}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <Routes>
            <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/dashboard" />} />
            
            <Route path="/portals/*" element={<ExamplePortals />} />

            {/* Citizen Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.CITIZEN]} />}>
              <Route path="/citizen" element={<CitizenDashboard />} />
              <Route path="/citizen/requests" element={<CitizenRequests />} />
              <Route path="/citizen/assets" element={<CitizenAssets />} />
              <Route path="/citizen/logs" element={<CitizenLogs />} />
            </Route>

            {/* Company Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.COMPANY]} />}>
              <Route path="/company" element={<CompanyDashboard />} />
              <Route path="/company/request" element={<CompanyRequestForm />} />
              <Route path="/company/sessions" element={<CompanySessions />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/security" element={<AdminSecurity />} />
            </Route>

            <Route path="/dashboard" element={
              user ? (
                user.role === UserRole.CITIZEN ? <Navigate to="/citizen" /> :
                user.role === UserRole.COMPANY ? <Navigate to="/company" /> :
                <Navigate to="/admin" />
              ) : <Navigate to="/login" />
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
