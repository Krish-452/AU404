
import React from 'react';
import { ShieldCheck, AlertCircle, Users, Activity, Terminal, ShieldAlert, Globe, Search, Cpu, Zap, Fingerprint, Lock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const data = [
    { name: '00:00', requests: 400, load: 45, threats: 2 },
    { name: '04:00', requests: 300, load: 38, threats: 5 },
    { name: '08:00', requests: 900, load: 82, threats: 14 },
    { name: '12:00', requests: 1200, load: 95, threats: 8 },
    { name: '16:00', requests: 800, load: 70, threats: 3 },
    { name: '20:00', requests: 500, load: 55, threats: 1 },
    { name: '23:59', requests: 350, load: 40, threats: 0 },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase transition-colors">National Surveillance</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest transition-colors">Zero-Trust Infrastructure & Identity Governance</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
              <Lock size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">FIPS 140-2 HSM: ACTIVE</span>
           </div>
           <button className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all active:scale-95 shadow-xl shadow-rose-200 dark:shadow-none flex items-center gap-3">
             <ShieldAlert size={18} /> Global Lockdown
           </button>
        </div>
      </header>

      {/* Real-time Tier 1 Prevention Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-[#0f172a] dark:bg-black rounded-2xl p-8 border dark:border-slate-800 flex items-center justify-between text-white relative overflow-hidden group">
            <div className="relative z-10 flex items-center gap-4">
               <Fingerprint className="text-indigo-400 group-hover:scale-110 transition-transform" size={24} />
               <span className="text-[10px] font-black uppercase tracking-widest">Behavioral Biometrics</span>
            </div>
            <span className="text-2xl font-black text-emerald-400 font-mono relative z-10">SYNCHED</span>
            <div className="absolute inset-0 bg-indigo-600/5 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
         </div>
         <div className="bg-[#0f172a] dark:bg-black rounded-2xl p-8 border dark:border-slate-800 flex items-center justify-between text-white relative overflow-hidden group">
            <div className="relative z-10 flex items-center gap-4">
               <Zap className="text-orange-400 group-hover:scale-110 transition-transform" size={24} />
               <span className="text-[10px] font-black uppercase tracking-widest">Bot/Automation Guard</span>
            </div>
            <span className="text-2xl font-black text-emerald-400 font-mono relative z-10">100% BLOCKED</span>
            <div className="absolute inset-0 bg-orange-600/5 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
         </div>
         <div className="bg-[#0f172a] dark:bg-black rounded-2xl p-8 border dark:border-slate-800 flex items-center justify-between text-white relative overflow-hidden group">
            <div className="relative z-10 flex items-center gap-4">
               <Globe className="text-blue-400 group-hover:scale-110 transition-transform" size={24} />
               <span className="text-[10px] font-black uppercase tracking-widest">API Layer WAF</span>
            </div>
            <span className="text-2xl font-black text-white font-mono relative z-10">0 INCIDENTS</span>
            <div className="absolute inset-0 bg-blue-600/5 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Sovereign Sessions', value: '1.4M', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
          { label: 'Trusted Partners', value: '4.2K', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'DDoS Mitigation', value: 'ACTIVE', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { label: 'Secret Rotation', value: 'DAILY', icon: Cpu, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className={`p-4 rounded-2xl w-fit mb-8 ${stat.bg} ${stat.color} dark:text-white transition-colors`}>
              <stat.icon size={28} />
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 p-10 md:p-14 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4 uppercase tracking-tight">
            <Activity className="text-indigo-600 dark:text-indigo-400" size={32} />
            National Identity Traffic
          </h3>
          <div className="flex gap-2">
             <span className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-xl border border-indigo-100 dark:border-indigo-900/50 tracking-widest">ZERO-KNOWLEDGE AUTH</span>
          </div>
        </div>
        <div className="w-full h-[400px] min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', padding: '20px', backgroundColor: '#0f172a', color: '#fff' }}
                labelStyle={{ fontWeight: 900, marginBottom: '10px', fontSize: '11px', textTransform: 'uppercase' }}
                itemStyle={{ fontSize: '11px', fontWeight: 700, color: '#a5b4fc' }}
              />
              <Area type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={6} fillOpacity={1} fill="url(#colorReq)" />
              <Area type="monotone" dataKey="load" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
