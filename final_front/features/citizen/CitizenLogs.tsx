
import React, { useState } from 'react';
import { History, ShieldCheck, AlertCircle, Info, Download, Globe, Terminal, Loader2 } from 'lucide-react';
import api from '../../services/api.ts';

const CitizenLogs: React.FC = () => {
   const [exporting, setExporting] = useState(false);

   const logs = [
      { entity: 'Node-Sync', action: 'Identity Update', details: 'Full Name shard mirrored', time: '5m ago', status: 'success' },
      { entity: 'MedLink Health', action: 'Decryption Handshake', details: 'Authorized Medical Records access', time: '1h ago', status: 'success' },
      { entity: 'MFA Cluster', action: 'Login Verification', details: 'Biometric Handshake Successful', time: '2h ago', status: 'success' },
      { entity: 'System_Audit', action: 'Public Key Rotation', details: 'Automatic Security Maintenance', time: 'Yesterday', status: 'info' },
      { entity: 'Unknown Entity', action: 'Access Denied', details: 'Failed Handshake Attempt [IP: 192.168.1.1]', time: '2 days ago', status: 'error' },
   ];

   const handleExportLogs = async () => {
      setExporting(true);
      try {
         const response = await api.get('/citizen/export-logs', { responseType: 'blob' });
         const url = window.URL.createObjectURL(new Blob([response.data]));
         const link = document.createElement('a');
         link.href = url;
         link.setAttribute('download', 'audit_logs.csv');
         document.body.appendChild(link);
         link.click();
         link.remove();
         window.URL.revokeObjectURL(url);
      } catch (error) {
         console.error('Export failed:', error);
         alert('Export failed. Please try again.');
      } finally {
         setExporting(false);
      }
   };

   return (
      <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20 transition-colors">
         <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
               <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Transparency Ledger</h1>
               <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest">Immutable audit trail of all identity shard interactions</p>
            </div>
            <button
               onClick={handleExportLogs}
               disabled={exporting}
               className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
               {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Export Logs
            </button>
         </header>

         <div className="bg-[#0f172a] dark:bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl dark:shadow-none overflow-hidden relative border dark:border-slate-800 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Terminal size={150} />
            </div>
            <div className="flex items-center gap-4 mb-10">
               <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Globe size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Global Audit Stream</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">Active nodes synchronized</p>
               </div>
            </div>

            <div className="space-y-4">
               {logs.map((log, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                     <div className="flex items-start gap-5">
                        <div className={`h-10 w-10 min-w-[40px] rounded-xl flex items-center justify-center ${log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                           log.status === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'
                           }`}>
                           {log.status === 'success' ? <ShieldCheck size={20} /> :
                              log.status === 'error' ? <AlertCircle size={20} /> : <Info size={20} />}
                        </div>
                        <div className="space-y-1">
                           <div className="flex items-center gap-3">
                              <span className="text-sm font-black text-white">{log.entity}</span>
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{log.time}</span>
                           </div>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">{log.action}</p>
                           <p className="text-xs text-slate-400 font-medium">{log.details}</p>
                        </div>
                     </div>
                     <div className="mt-4 md:mt-0 text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors cursor-pointer">
                        Full Proof Hash &gt;
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default CitizenLogs;
