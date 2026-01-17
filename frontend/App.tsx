import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserRole } from './types';
import { useBehavioralBiometrics } from './hooks/useBehavioralBiometrics';
import { useSecurityEnforcement } from './hooks/useSecurityEnforcement';
import { useSessionTimeout } from './hooks/useSessionTimeout';

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
import { Shield, Lock, Key, ShieldAlert, AlertTriangle, Clock, RefreshCw } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sessionEntropy } = useBehavioralBiometrics();

  // Security Enforcement Hook
  const { violationActive, countdown: violationCountdown } = useSecurityEnforcement();

  // Session Timeout Hook
  const { showWarning, remainingSeconds, resetTimer } = useSessionTimeout();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfcfc] dark:bg-slate-950 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f172a] dark:border-white mb-4"></div>
        <p className="text-[#0f172a] dark:text-white text-[10px] font-black uppercase tracking-widest animate-pulse">Establishing Secure Tunnel...</p>
      </div>
    );
  }

  // Security Verification Overlay
  if (violationActive) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="relative inline-block">
            <ShieldAlert size={120} className="text-rose-600 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertTriangle size={40} className="text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Security Violation</h2>
            <div className="bg-rose-600/10 border border-rose-600/20 p-4 rounded-xl">
              <p className="text-rose-500 font-black uppercase text-xs tracking-widest leading-relaxed">
                Unauthorized environment inspection detected. Your access has been revoked for security reasons.
              </p>
            </div>
            <p className="text-white/40 font-black uppercase text-[10px] tracking-[0.3em]">
              Redirecting to gateway in {violationCountdown}s...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#fcfcfc] dark:bg-slate-950 overflow-hidden transition-colors duration-300 select-none">

      {/* Session Timeout Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-[9998] bg-slate-900/60 dark:bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-2xl space-y-8 text-center">
            <div className="h-20 w-20 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center mx-auto mb-6">
              <Clock size={40} className="animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Session Expiring</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                Your secure handshake is about to expire due to inactivity.
              </p>
            </div>
            <div className="text-5xl font-black text-orange-500 font-mono tracking-tighter">
              00:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
            </div>
            <button
              onClick={resetTimer}
              className="w-full flex items-center justify-center gap-3 py-5 px-6 rounded-2xl text-white bg-[#0f172a] dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all active:scale-95"
            >
              <RefreshCw size={18} /> Extend Session
            </button>
          </div>
        </div>
      )}

      {user && (
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} role={user.role} />
      )}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {user && <Navbar setSidebarOpen={setSidebarOpen} />}

        {/* Global Security Status Bar */}
        {user && (
          <div className="bg-slate-900 dark:bg-black border-b border-white/5 transition-colors z-30 shrink-0">
            <div className="max-w-full overflow-x-auto custom-scrollbar-hide px-4 py-2 flex items-center justify-start md:justify-center">
              <div className="flex items-center gap-4 md:gap-24 text-[6.5px] xs:text-[7px] md:text-[8px] font-black text-white/40 uppercase tracking-[0.1em] md:tracking-[0.25em]">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Shield size={10} className="text-emerald-400" />
                  <span className="whitespace-nowrap">WAF PROTECT: ACTIVE</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Lock size={10} className="text-blue-400" />
                  <span className="whitespace-nowrap">ENCRYPT: AES-256</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Key size={10} className="text-orange-400" />
                  <span className="font-mono whitespace-nowrap">KEY:{sessionEntropy.substring(0, 10)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 md:p-10 overflow-y-auto custom-scrollbar">
          <Routes>
            <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
            <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/dashboard" replace />} />

            <Route path="/portals/*" element={<ExamplePortals />} />

            <Route element={<ProtectedRoute allowedRoles={[UserRole.CITIZEN]} />}>
              <Route path="/citizen" element={<CitizenDashboard />} />
              <Route path="/citizen/requests" element={<CitizenRequests />} />
              <Route path="/citizen/assets" element={<CitizenAssets />} />
              <Route path="/citizen/logs" element={<CitizenLogs />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={[UserRole.COMPANY]} />}>
              <Route path="/company" element={<CompanyDashboard />} />
              <Route path="/company/request" element={<CompanyRequestForm />} />
              <Route path="/company/sessions" element={<CompanySessions />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/security" element={<AdminSecurity />} />
            </Route>

            {/* Smart Dashboard Redirect */}
            <Route path="/dashboard" element={<DashboardRedirect user={user} />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const DashboardRedirect: React.FC<{ user: any }> = ({ user }) => {
  if (!user) return <Navigate to="/login" replace />;
  switch (user.role) {
    case UserRole.CITIZEN: return <Navigate to="/citizen" replace />;
    case UserRole.COMPANY: return <Navigate to="/company" replace />;
    case UserRole.ADMIN: return <Navigate to="/admin" replace />;
    default: return <Navigate to="/login" replace />;
  }
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