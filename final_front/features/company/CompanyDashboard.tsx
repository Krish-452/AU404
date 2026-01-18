
import React, { useState, useEffect } from 'react';
import { Database, Search, ShieldCheck, Activity, User, ChevronRight, Lock, Eye, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RequestStatus } from '../../types.ts';
import api from '../../services/api.ts';

const CompanyDashboard: React.FC = () => {
  const [citizenId, setCitizenId] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedData, setFetchedData] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    // Fetch handshake history on mount
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/company/history');
        if (data.success) {
          setHistory(data.history);
        }
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenId) return;

    setIsFetching(true);
    setFetchedData(null);

    try {
      const { data } = await api.post('/company/retrieve-shard', { citizenId });
      if (data.success) {
        setFetchedData(data.data);
      } else {
        setFetchedData(null);
      }
    } catch (error) {
      console.error('Lookup failed:', error);
      setFetchedData(null);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Identity Shard Retrieval (Database Lookup) */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
            <div className="p-10 md:p-14 space-y-10">
              <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400">
                <Database size={28} />
                <h2 className="text-2xl font-black uppercase tracking-tight">Identity Shard Retrieval</h2>
              </div>

              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                Query the national ledger for identity segments that have already been authorized for your provider node.
              </p>

              <form onSubmit={handleLookup} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={citizenId}
                    onChange={(e) => setCitizenId(e.target.value)}
                    placeholder="Enter Citizen DID or Identifier..."
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-sm font-bold dark:text-white outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isFetching}
                  className="px-8 py-5 bg-[#0f172a] dark:bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                >
                  {isFetching ? 'Fetching Shards...' : 'Retrieve'}
                </button>
              </form>

              {fetchedData ? (
                <div className="animate-in slide-in-from-top-4 duration-500 space-y-6 pt-6 border-t dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black dark:text-white">{fetchedData.name}</h3>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{fetchedData.id}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20">Handshake Active</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fetchedData.shards.map((shard: any, i: number) => (
                      <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl group hover:border-indigo-400 transition-all">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{shard.label}</p>
                        <p className="text-base font-black text-slate-900 dark:text-white flex items-center justify-between">
                          {shard.value}
                          <Lock size={12} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : citizenId && !isFetching && (
                <div className="p-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                  <AlertCircle size={40} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Active Handshake Found for this ID</p>
                  <p className="text-[10px] text-slate-300 mt-2">You may need to issue a new Broadcast Request.</p>
                </div>
              )}
            </div>
          </section>

          {/* Activity Logs */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Handshake History</h3>
              <Activity size={16} className="text-indigo-400" />
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {historyLoading ? (
                <div className="px-8 py-8 flex justify-center">
                  <Loader2 size={24} className="animate-spin text-indigo-400" />
                </div>
              ) : history.map((log, i) => (
                <div key={i} className="px-8 py-5 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-700 dark:text-slate-300">{log.user}</span>
                  <span className="text-indigo-500 uppercase text-[9px] font-black">{log.action}</span>
                  <span className="text-slate-400 uppercase text-[9px] font-black">{log.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-8">
          <div className="bg-[#0f172a] dark:bg-black rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
              <ShieldCheck size={180} />
            </div>
            <h3 className="text-xl font-black mb-8 uppercase tracking-tighter relative z-10">Network Status</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Handshakes</span>
                <span className="text-2xl font-black">1,402</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Latency</span>
                <span className="text-2xl font-black text-emerald-400">12ms</span>
              </div>
            </div>
            <button className="w-full py-5 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mt-10 hover:bg-slate-100 transition-all shadow-xl">
              Node Diagnostic
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 text-center shadow-sm">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Need New Data?</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-8">
              If the citizen hasn't authorized your node yet, issue a new broadcast request.
            </p>
            <Link
              to="/company/new-request"
              className="block w-full py-4 text-[10px] font-black uppercase tracking-widest text-indigo-600 border-2 border-indigo-100 rounded-xl hover:bg-indigo-50 transition-all"
            >
              New Broadcast Request
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
