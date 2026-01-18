
import React from 'react';
// @ts-ignore
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.tsx';
import { Landmark, User, Building2, ShieldCheck, ChevronRight, UserPlus, Sun, Moon } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-slate-950 flex flex-col transition-colors duration-500">
      {/* Top Banner Stripe */}
      <div className="h-10 bg-[#0f172a] dark:bg-black w-full flex items-center justify-between px-6 shrink-0 border-b dark:border-slate-800 transition-colors">
        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">National Identity Gateway</span>
        <div className="flex items-center gap-6">
           <button onClick={toggleTheme} className="text-white hover:text-orange-400 transition-colors">
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
           </button>
           <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-orange-400"></span>
              <span className="h-3 w-3 rounded-full bg-white"></span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 py-20">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex justify-center mb-10 text-indigo-600 dark:text-indigo-400">
            <Landmark size={80} strokeWidth={1} />
          </div>
          <h1 className="text-7xl md:text-8xl font-black text-[#0f172a] dark:text-white tracking-tighter mb-4 uppercase">TRUSTID</h1>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.6em] ml-2">Identity Sovereignty Hub</p>
        </div>

        <div className="w-full max-w-xl bg-white dark:bg-slate-900 p-2 rounded-[2.5rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all duration-500">
          <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portal Entrance</h2>
            <Link to="/signup" className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline flex items-center gap-2 group transition-all">
              <UserPlus size={14} className="group-hover:scale-110 transition-transform" />
              Enrollment
            </Link>
          </div>
          
          <div className="p-4 space-y-3">
            <LandingLink to="/login" icon={User} label="Citizen Portal" color="indigo" />
            <LandingLink to="/login" icon={Building2} label="Departmental Hub" color="emerald" />
            <LandingLink to="/login" icon={ShieldCheck} label="Infrastructure" color="rose" />
          </div>
        </div>
      </div>

      <footer className="p-10 text-center text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em] transition-colors">
        Secured by Sovereign Node-Alpha-X Cluster
      </footer>
    </div>
  );
};

const LandingLink = ({ to, icon: Icon, label, color }: { to: string; icon: any; label: string; color: string }) => (
  <Link to={to} className="flex items-center justify-between p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all group">
    <div className="flex items-center gap-8">
      <div className={`p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 group-hover:bg-${color}-50 dark:group-hover:bg-${color}-900/20 group-hover:text-${color}-600 dark:group-hover:text-${color}-400 transition-all duration-300 shadow-inner`}>
        <Icon size={28} />
      </div>
      <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em]">{label}</span>
    </div>
    <ChevronRight size={24} className="text-slate-200 dark:text-slate-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-2 transition-all duration-300" />
  </Link>
);

export default LandingPage;
