
import React from 'react';
import { ShieldCheck, AlertCircle, Users, Activity, Terminal, ShieldAlert, Globe, MapPin, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const AdminDashboard: React.FC = () => {
  const data = [
    { name: 'Mon', requests: 400, threats: 24, load: 45 },
    { name: 'Tue', requests: 300, threats: 13, load: 38 },
    { name: 'Wed', requests: 500, threats: 35, load: 62 },
    { name: 'Thu', requests: 280, threats: 10, load: 40 },
    { name: 'Fri', requests: 390, threats: 20, load: 55 },
    { name: 'Sat', requests: 150, threats: 5, load: 20 },
    { name: 'Sun', requests: 120, threats: 2, load: 15 },
  ];

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700 pb-20 transition-colors duration-300">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Governance Hub</h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest">Real-time surveillance of decentralized trust network.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative group hidden sm:block">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Audit Entity ID..." className="pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold w-72 shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/5 dark:focus:ring-indigo-400/10 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all dark:text-white" />
           </div>
           <button className="px-8 py-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-rose-100 dark:border-rose-900/50 flex items-center gap-3 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all active:scale-95 shadow-xl shadow-rose-100/50 dark:shadow-none">
             <ShieldAlert size={18} />
             Panic Lock
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Identities', value: '1.24M', icon: Users, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
          { label: 'Data Flows', value: '45.2K', icon: Activity, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'Anomalies', value: '03', icon: AlertCircle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
          { label: 'Verifiers', value: '894', icon: ShieldCheck, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group transition-all duration-300">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
               <stat.icon size={80} className="dark:text-white" />
            </div>
            <div className={`p-4 rounded-2xl w-fit mb-8 ${stat.bg} ${stat.color} shadow-sm transition-colors`}>
              <stat.icon size={28} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Network Metrics */}
        <div className="xl:col-span-8 space-y-10">
          <div className="bg-white dark:bg-slate-900 p-10 md:p-14 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4 uppercase tracking-tight">
                <Activity className="text-indigo-600 dark:text-indigo-400" size={32} />
                Verification Traffic
              </h3>
              <div className="flex gap-2">
                 <span className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-xl border border-indigo-100 dark:border-indigo-900/50">LIVE STREAM</span>
                 <span className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-black rounded-xl uppercase tracking-widest">Protocol v2.4</span>
              </div>
            </div>
            <div className="h-96 w-full">
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
                    labelStyle={{ fontWeight: 900, marginBottom: '10px', fontSize: '13px', textTransform: 'uppercase' }}
                    itemStyle={{ fontSize: '11px', fontWeight: 700, color: '#a5b4fc' }}
                  />
                  <Area type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={6} fillOpacity={1} fill="url(#colorReq)" />
                  <Area type="monotone" dataKey="load" stroke="#10b981" strokeWidth={3} strokeDasharray="6 6" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="bg-indigo-900 dark:bg-black rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden transition-colors">
                <Globe className="text-indigo-400 mb-8 opacity-40" size={48} />
                <h4 className="text-3xl font-black mb-6 uppercase tracking-tight">Active Threat Map</h4>
                <div className="space-y-4">
                   {[
                     { loc: 'San Francisco, USA', risk: 'Low', time: 'Active' },
                     { loc: 'Bangalore, India', risk: 'Medium', time: 'Active' },
                     { loc: 'Berlin, Germany', risk: 'Low', time: 'Active' },
                   ].map((t, i) => (
                     <div key={i} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/10 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                           <MapPin size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                           <span className="text-xs font-black uppercase tracking-widest">{t.loc}</span>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${t.risk === 'Medium' ? 'bg-orange-400/20 text-orange-400' : 'bg-emerald-400/20 text-emerald-400'}`}>{t.risk}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <ShieldCheck className="text-emerald-600 dark:text-emerald-400 mb-8" size={48} />
                <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">Node Integrity</h4>
                <div className="space-y-8">
                   <div>
                      <div className="flex justify-between mb-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compute Load</span>
                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">42%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 w-[42%] shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between mb-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Propogation</span>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">99.9%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 w-[99%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Real-time Console */}
        <div className="xl:col-span-4 h-full">
           <div className="bg-slate-900 dark:bg-black rounded-[3.5rem] p-12 text-white shadow-2xl h-full flex flex-col relative overflow-hidden transition-colors border dark:border-slate-800">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                 <Terminal size={180} />
              </div>
              <h3 className="text-2xl font-black mb-12 flex items-center gap-4 relative z-10 uppercase tracking-tight">
                <Terminal className="text-indigo-400" size={32} />
                Audit Ledger
              </h3>
              <div className="flex-1 space-y-8 font-mono text-[11px] relative z-10 overflow-y-auto pr-2 custom-scrollbar">
                 {[
                   { time: '14:22:01', msg: 'Handshake: Hospital_A <=> Citizen_X99 [SUCCESS]', status: 'text-emerald-400' },
                   { time: '14:21:45', msg: 'Alert: Unusual request volume IP:10.0.1.4', status: 'text-orange-400' },
                   { time: '14:20:12', msg: 'Block: Unauthorized data toggle attempt USER_0012', status: 'text-rose-400' },
                   { time: '14:18:59', msg: 'Export: System Audit Snapshot v0.4', status: 'text-indigo-400' },
                   { time: '14:15:33', msg: 'Protocol: Rotating decryption sub-keys...', status: 'text-slate-500' },
                   { time: '14:12:01', msg: 'Handshake: Agri_Hub <=> Citizen_Y42 [SUCCESS]', status: 'text-emerald-400' },
                   { time: '14:10:55', msg: 'Auth: Admin session initiated via hardware key', status: 'text-indigo-400' },
                   { time: '14:05:22', msg: 'Sync: Identity shards verified on 12 nodes', status: 'text-emerald-400' },
                 ].map((log, i) => (
                   <div key={i} className="flex gap-5 border-l-2 border-white/5 pl-6 py-2 hover:border-indigo-500 transition-colors group">
                      <span className="text-slate-600 font-black whitespace-nowrap group-hover:text-slate-400 transition-colors">{log.time}</span>
                      <span className={`${log.status} leading-relaxed`}>{log.msg}</span>
                   </div>
                 ))}
              </div>
              
              <div className="mt-12 pt-10 border-t border-white/10 relative z-10">
                 <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
                    <div className="flex items-center gap-4 mb-4">
                       <ShieldCheck size={24} className="text-indigo-400" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Shield Active</span>
                    </div>
                    <p className="text-lg font-black tracking-tight uppercase">Sovereign Zone 1-B</p>
                    <p className="text-[10px] text-slate-500 font-black mt-1 uppercase tracking-widest">Protocol strictly enforced</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
