
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, User, ExternalLink, Zap, Terminal, Loader2, Download } from 'lucide-react';
import api from '../../services/api.ts';

const CompanySessions: React.FC = () => {
   const [sessions, setSessions] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [accessingId, setAccessingId] = useState<string | null>(null);
   const [accessedData, setAccessedData] = useState<any>(null);

   useEffect(() => {
      const fetchSessions = async () => {
         try {
            const { data } = await api.get('/company/sessions');
            if (data.success) {
               setSessions(data.sessions);
            }
         } catch (error) {
            console.error('Failed to fetch sessions:', error);
         } finally {
            setLoading(false);
         }
      };
      fetchSessions();
   }, []);

   const handleAccessData = async (sessionId: string) => {
      setAccessingId(sessionId);
      try {
         const { data } = await api.get(`/company/access-data/${sessionId}`);
         if (data.success) {
            setAccessedData({ sessionId, ...data.data });
            alert(`Data Retrieved:\\nName: ${data.data.name}\\nEmail: ${data.data.email}\\nRole: ${data.data.role}`);
         }
      } catch (error) {
         console.error('Access failed:', error);
         alert('Failed to access data.');
      } finally {
         setAccessingId(null);
      }
   };

   const handleDownloadDocumentation = async () => {
      try {
         const response = await api.get('/company/documentation', { responseType: 'blob' });
         const url = window.URL.createObjectURL(new Blob([response.data]));
         const link = document.createElement('a');
         link.href = url;
         link.setAttribute('download', 'IDHUB_API_Documentation.txt');
         document.body.appendChild(link);
         link.click();
         link.remove();
         window.URL.revokeObjectURL(url);
      } catch (error) {
         console.error('Download failed:', error);
         alert('Failed to download documentation.');
      }
   };

   if (loading) {
      return (
         <div className="max-w-6xl mx-auto flex items-center justify-center py-32">
            <Loader2 size={48} className="animate-spin text-indigo-500" />
         </div>
      );
   }

   return (
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20 transition-colors">
         <header>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Active Handshakes</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest">Authorized data sessions currently live on your node</p>
         </header>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((session, i) => (
               <div key={session.id || i} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-slate-100 dark:hover:shadow-none transition-all group border-b-4 border-b-slate-900 dark:border-b-indigo-600">
                  <div className="p-8 space-y-8">
                     <div className="flex justify-between items-start">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white transition-colors">
                           <User size={24} />
                        </div>
                        <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-colors ${session.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400'
                           }`}>
                           {session.status}
                        </div>
                     </div>

                     <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 transition-colors">{session.citizen}</h3>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                           <Clock size={12} /> {session.duration}
                        </div>
                     </div>

                     <div className="space-y-3">
                        <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Authorized Attributes</p>
                        <div className="flex flex-wrap gap-2">
                           {session.attributes.map((attr: string) => (
                              <span key={attr} className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded text-[9px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                                 {attr}
                              </span>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 transition-colors">
                     <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase">Last Activity: {session.lastUsed}</span>
                     <button
                        onClick={() => handleAccessData(session.id)}
                        disabled={accessingId === session.id}
                        className="text-[10px] font-black uppercase tracking-widest text-[#ff9f43] dark:text-orange-400 hover:underline flex items-center gap-2 disabled:opacity-50"
                     >
                        {accessingId === session.id ? <Loader2 size={12} className="animate-spin" /> : null}
                        Access Data <Zap size={12} />
                     </button>
                  </div>
               </div>
            ))}
         </div>

         <div className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-10 text-white shadow-2xl dark:shadow-none border dark:border-slate-800 transition-colors">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="space-y-3 text-center md:text-left">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">SDK Integration</h3>
                  <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-lg transition-colors">
                     Authorized sessions are accessible via our REST API using your provider node's unique key. Use the Zero-Knowledge endpoint for privacy-first operations.
                  </p>
               </div>
               <button
                  onClick={handleDownloadDocumentation}
                  className="px-10 py-5 bg-white dark:bg-indigo-600 text-slate-900 dark:text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-white/5 dark:shadow-none hover:bg-slate-100 dark:hover:bg-indigo-700 transition-all flex items-center gap-3"
               >
                  Documentation <Download size={18} />
               </button>
            </div>
         </div>
      </div>
   );
};

export default CompanySessions;
