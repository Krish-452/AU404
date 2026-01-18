
import React, { useState } from 'react';
import { 
  ShieldCheck, LayoutDashboard, Database, Activity, 
  Users, Lock, Zap, Cpu, Fingerprint, Heart, 
  Sprout, Building, ChevronRight, Key, Smartphone, Plus,
  AlertCircle, ShieldAlert, Globe, History, Send, FileText, CheckCircle
} from 'lucide-react';
import { UserRole } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import CitizenDashboard from './citizen/CitizenDashboard.tsx';
import CompanyDashboard from './company/CompanyDashboard.tsx';
import AdminDashboard from './admin/AdminDashboard.tsx';

const UnifiedDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div>
          <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-colors">
             <span>Home</span>
             <ChevronRight size={14} />
             <span className="text-slate-900 dark:text-indigo-400">{user.role} Shard Hub</span>
          </div>
          <h1 className="text-5xl font-black text-[#0f172a] dark:text-white tracking-tighter uppercase leading-none">
            {user.role === UserRole.CITIZEN ? 'National Identity' : 
             user.role === UserRole.COMPANY ? 'Provider Console' : 
             'Surveillance Hub'}
          </h1>
        </div>
        
        <div className="flex gap-4">
           <div className="px-5 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center gap-3 shadow-sm transition-colors">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Identity Active: Node-Sovereign
              </span>
           </div>
        </div>
      </header>

      {/* Adaptive Dashboard Content */}
      {user.role === UserRole.CITIZEN && <CitizenDashboard />}
      {user.role === UserRole.COMPANY && <CompanyDashboard />}
      {user.role === UserRole.ADMIN && <AdminDashboard />}

      {/* Global Bottom Security Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none p-4 flex justify-center">
         <div className="bg-slate-900/90 dark:bg-black/90 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10 shadow-2xl flex items-center gap-12 pointer-events-auto">
            <div className="flex items-center gap-3">
               <div className="h-2 w-2 bg-emerald-400 rounded-full animate-ping" />
               <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">Hardware HSM Linked</span>
            </div>
            <div className="flex items-center gap-3">
               <Lock size={12} className="text-indigo-400" />
               <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">AES-256 Envelope</span>
            </div>
            <div className="flex items-center gap-3">
               <Cpu size={12} className="text-orange-400" />
               <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">Node Alpha Active</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
