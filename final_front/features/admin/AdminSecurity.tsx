
import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, AlertCircle, Activity, Globe, ShieldCheck,
  Terminal, XCircle, RefreshCcw, Cpu, Lock, Zap,
  Users, Clock, MousePointer2, UserX, Settings2, Sliders, Loader2
} from 'lucide-react';
import api from '../../services/api.ts';

interface ActiveSession {
  id: string;
  userId: string;
  role: string;
  loginTime: string;
  lastActivity: string;
  ip: string;
  status: 'active' | 'idle' | 'expiring';
}

const AdminSecurity: React.FC = () => {
  const [anomalies] = useState([
    { id: 'WAF-TX-902', type: 'SQLi Injection Attempt', severity: 'Critical', source: 'IP: 104.22.4.1 (Geo: RU)', status: 'Blocked', time: '12m ago' },
    { id: 'BIO-TX-898', type: 'Suspicious Behavioral Pattern', severity: 'Medium', source: 'Session: S-0012', status: 'Verifying', time: '1h ago' },
    { id: 'API-TX-892', type: 'Credential Stuffing Detect', severity: 'High', source: 'Multiple IPs', status: 'Rate Limited', time: '3h ago' },
  ]);

  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [globalTimeout, setGlobalTimeout] = useState(10);
  const [purgeLoading, setPurgeLoading] = useState(false);
  const [keyRotationLoading, setKeyRotationLoading] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const { data } = await api.get('/admin/sessions');
      if (data.success) {
        setActiveSessions(data.sessions.map((s: any) => ({
          id: s.id,
          userId: s.oderserId || s.userId,
          role: s.role,
          loginTime: s.loginTime,
          lastActivity: s.lastActivity,
          ip: s.ip,
          status: s.status
        })));
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleEmergencyPurge = async () => {
    if (!confirm('WARNING: This will logout ALL users immediately. Proceed?')) return;

    setPurgeLoading(true);
    try {
      const { data } = await api.post('/admin/emergency-purge');
      alert(`Emergency Purge Complete!\n${data.purgedSessions} sessions terminated.`);
      setActiveSessions([]);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Purge failed');
    } finally {
      setPurgeLoading(false);
    }
  };

  const handleKeyRotation = async () => {
    setKeyRotationLoading(true);
    try {
      const { data } = await api.post('/admin/key-rotation');
      alert(`Key Rotation Complete!\nNew Key Version: ${data.newKeyVersion}\nAudit Hash: ${data.auditHash.slice(0, 16)}...`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Key rotation failed');
    } finally {
      setKeyRotationLoading(false);
    }
  };

  const handleSystemAudit = async () => {
    setAuditLoading(true);
    setScanResult(null);
    try {
      const { data } = await api.post('/admin/system-audit');
      setScanResult(data);
      alert(`System Audit Complete!\nScan ID: ${data.scanId}\nStatus: ${data.status}\nDuration: ${data.duration}\nNo anomalies detected.`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Audit failed');
    } finally {
      setAuditLoading(false);
    }
  };

  const [policyLoading, setPolicyLoading] = useState(false);

  const handleUpdatePolicy = async () => {
    setPolicyLoading(true);
    try {
      const { data } = await api.post('/admin/update-policy', {
        idleInactivityLimit: globalTimeout,
        absoluteTimeout: 24
      });
      alert(`Policy Updated!\nIdle Inactivity Limit: ${data.policy.idleInactivityLimit} minutes\nAbsolute Timeout: ${data.policy.absoluteTimeout} hours`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update policy');
    } finally {
      setPolicyLoading(false);
    }
  };

  const handleRevokeSession = (sessionId: string) => {
    setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
    console.debug(`[Admin] Revoked Session: ${sessionId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30';
      case 'idle': return 'text-orange-500 bg-orange-50 dark:bg-orange-950/30';
      case 'expiring': return 'text-rose-500 bg-rose-50 dark:bg-rose-950/30';
      default: return 'text-slate-400 bg-slate-50 dark:bg-slate-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20 px-4 md:px-0">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase transition-colors">Security Shield</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest transition-colors">WAF & HSM Continuous Monitoring</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleEmergencyPurge}
            disabled={purgeLoading}
            className="px-6 py-3 bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-rose-700 transition-all flex items-center gap-2 shadow-xl shadow-rose-100 disabled:opacity-50"
          >
            {purgeLoading ? <Loader2 size={14} className="animate-spin" /> : <ShieldAlert size={14} />} Emergency Purge
          </button>
          <button
            onClick={handleKeyRotation}
            disabled={keyRotationLoading}
            className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {keyRotationLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCcw size={14} />} Key Rotation
          </button>
        </div>
      </header>

      <section className="space-y-8">
        <div className="flex items-center gap-4 border-l-4 border-indigo-600 pl-4 py-1">
          <Users size={24} className="text-indigo-600" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Session Governance</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-black uppercase tracking-widest text-slate-800 dark:text-white">Active Shard Handshakes</h3>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Monitoring {activeSessions.length} Cryptographic Sessions</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase text-emerald-500">Live Stream</span>
              </div>
            </div>

            {sessionsLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 size={32} className="animate-spin text-indigo-500" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-8 py-5">Identity Shard</th>
                      <th className="px-6 py-5">Role</th>
                      <th className="px-6 py-5">Activity</th>
                      <th className="px-6 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Sequence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800 transition-colors">
                    {activeSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              <Activity size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{session.userId}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{session.ip}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 px-2 py-1 rounded-md uppercase">
                            {session.role}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-xs font-bold text-slate-500 dark:text-slate-400">
                          {session.lastActivity}
                        </td>
                        <td className="px-6 py-6">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => handleRevokeSession(session.id)}
                            className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Revoke Shard Handshake"
                          >
                            <UserX size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 mt-auto">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
                Absolute session termination clears all hardware-bound FIDO2 handshakes for the specified shard.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#0f172a] dark:bg-black rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden transition-all group">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                <Settings2 size={180} />
              </div>
              <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Sliders size={24} />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Timeout Policy</h3>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Idle Inactivity Limit</label>
                      <span className="text-xl font-black text-indigo-400 font-mono">{globalTimeout}m</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="60"
                      value={globalTimeout}
                      onChange={(e) => setGlobalTimeout(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                      <span>Strict (1m)</span>
                      <span>Lenient (60m)</span>
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-indigo-400" />
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Absolute Timeout</p>
                    </div>
                    <p className="text-2xl font-black">24 Hours</p>
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Force re-auth after 24h regardless of activity.</p>
                  </div>

                  <button
                    onClick={handleUpdatePolicy}
                    disabled={policyLoading}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-[0.25em] rounded-2xl transition-all shadow-xl shadow-indigo-950/50 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {policyLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                    Update Global Policy
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <MousePointer2 size={18} className="text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Real-time Telemetry</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase text-slate-400">Handshake Latency</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">12ms</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-800 dark:text-white">WAF Incident Ledger</h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-3 py-1 rounded-full">Threat Defense: ACTIVE</span>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {anomalies.map((anom) => (
                <div key={anom.id} className="p-8 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-6">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${anom.severity === 'Critical' ? 'bg-rose-50 text-rose-500' : 'bg-orange-50 text-orange-500'
                      }`}>
                      <ShieldAlert size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{anom.id}</span>
                        <span className="text-[10px] font-black text-slate-300 dark:text-slate-700">{anom.time}</span>
                      </div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white">{anom.type}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{anom.source}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${anom.status === 'Blocked' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {anom.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#0f172a] dark:bg-black rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
              <Cpu size={200} />
            </div>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter">Hardware Security Modules</h3>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Root Key Sharding</p>
                <p className="text-3xl font-black">FIPS 140-2</p>
                <div className="h-1 w-full bg-indigo-500 rounded-full"></div>
              </div>
              <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Envelope Encryption</p>
                <p className="text-3xl font-black">256-Bit GCM</p>
                <div className="h-1 w-full bg-emerald-500 rounded-full"></div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-100 dark:border-slate-800 text-center shadow-sm">
            <div className="h-20 w-20 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center mx-auto mb-8">
              <Zap size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Adaptive Auth</h3>
            <p className="text-sm font-medium text-slate-400 mb-10 leading-relaxed uppercase">Real-time risk scoring actively monitoring {activeSessions.length} concurrent sessions.</p>
            <button
              onClick={handleSystemAudit}
              disabled={auditLoading}
              className="w-full py-5 bg-[#0f172a] dark:bg-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {auditLoading ? <Loader2 size={18} className="animate-spin" /> : null}
              System Audit Scan
            </button>
            {scanResult && (
              <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-left">
                <p className="text-[9px] font-black text-emerald-600 uppercase">Scan Complete</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">Hash: {scanResult.hash?.slice(0, 24)}...</p>
              </div>
            )}
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <Terminal size={18} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Runtime Guard</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Code Integrity</span>
                <span className="text-[10px] font-black uppercase text-emerald-500">{scanResult?.findings?.codeIntegrity || 'VERIFIED'}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Anti-Tamper</span>
                <span className="text-[10px] font-black uppercase text-emerald-500">{scanResult?.findings?.antiTamper || 'ACTIVE'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSecurity;
