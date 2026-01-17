
import React from 'react';
import { ShieldAlert, AlertCircle, Activity, Globe, ShieldCheck, Terminal, XCircle, RefreshCcw } from 'lucide-react';

const AdminSecurity: React.FC = () => {
  const anomalies = [
    { id: 'AN-902', type: 'DDoS Pattern', severity: 'Critical', source: 'IP: 104.22.4.1', status: 'Intercepted', time: '12m ago' },
    { id: 'AN-898', type: 'Unusual Handshake', severity: 'Medium', source: 'Node-Beta-1', status: 'Under Review', time: '1h ago' },
    { id: 'AN-892', type: 'Mass Shard Access', severity: 'High', source: 'Provider_ID_99', status: 'Blocked', time: '3h ago' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20 transition-colors">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase transition-colors">Security Shield</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest transition-colors">Global anomaly detection and threat mitigation console</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all flex items-center gap-2 border border-rose-200 dark:border-rose-900/50 shadow-xl shadow-rose-100/20 dark:shadow-none">
              <ShieldAlert size={14} /> Panic Lockdown
           </button>
           <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm">
              <RefreshCcw size={14} /> Rotate Master Keys
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                 <h3 className="text-lg font-black uppercase tracking-widest text-slate-800 dark:text-white transition-colors">Active Anomalies</h3>
                 <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400 px-3 py-1 rounded-full">3 Alerts Detected</span>
              </div>
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                 {anomalies.map((anom) => (
                    <div key={anom.id} className="p-8 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                       <div className="flex items-center gap-6">
                          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-colors ${
                             anom.severity === 'Critical' ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-500' : 'bg-orange-50 dark:bg-orange-950/30 text-orange-500'
                          }`}>
                             <AlertCircle size={28} />
                          </div>
                          <div className="space-y-1">
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{anom.id}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{anom.time}</span>
                             </div>
                             <h4 className="text-xl font-black text-slate-900 dark:text-white transition-colors">{anom.type}</h4>
                             <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors">{anom.source}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg inline-block mb-3 transition-colors ${
                             anom.status === 'Intercepted' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}>
                             {anom.status}
                          </span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="text-[10px] font-black uppercase tracking-widest text-[#0f172a] dark:text-white hover:underline transition-colors">Deep Audit</button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </section>

           <section className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-10 text-white shadow-2xl transition-colors border dark:border-slate-800">
              <div className="flex items-center gap-4 mb-10">
                 <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Globe size={24} />
                 </div>
                 <h3 className="text-xl font-black uppercase tracking-tighter">Global Shield Status</h3>
              </div>
              <div className="grid grid-cols-2 gap-8">
                 <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Encrypted Shards Verified</p>
                    <p className="text-3xl font-black">100%</p>
                    <div className="h-1 w-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                 </div>
                 <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Identity Nodes Synced</p>
                    <p className="text-3xl font-black">12/12</p>
                    <div className="h-1 w-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                 </div>
              </div>
           </section>
        </div>

        <div className="space-y-8">
           <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-100 dark:border-slate-800 shadow-sm text-center transition-colors">
              <div className="h-20 w-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-8 shadow-sm transition-colors">
                 <ShieldCheck size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight transition-colors">Node Integrity</h3>
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-10 leading-relaxed uppercase transition-colors">Current protocol v2.4 in strict enforcement mode. No configuration drift detected.</p>
              <button className="w-full py-5 bg-[#0f172a] dark:bg-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-slate-200 dark:shadow-none hover:bg-black dark:hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95">
                 Validate All Nodes <Activity size={18} />
              </button>
           </div>

           <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                 <Terminal size={18} className="text-slate-400 dark:text-slate-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Quick Actions</span>
              </div>
              <div className="space-y-3">
                 <button className="w-full py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-500 dark:hover:text-rose-400 transition-all flex items-center justify-between px-6 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/50">
                    Revoke Master Cert <XCircle size={14} />
                 </button>
                 <button className="w-full py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all flex items-center justify-between px-6 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50">
                    Broadcast Update <Globe size={14} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSecurity;
