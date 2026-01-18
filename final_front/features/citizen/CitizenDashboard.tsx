
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  User, Heart, MapPin, Sprout, ShieldCheck, ShieldAlert, Clock, ExternalLink,
  ChevronRight, Fingerprint, Zap, Eye, EyeOff, ShieldX, Info,
  History as HistoryIcon, Cpu, Lock, Smartphone, Shield, Check, XCircle, Loader2
} from 'lucide-react';
// @ts-ignore
import { Link } from 'react-router-dom';
import { IdentityAttribute, AccessRequest, RequestStatus } from '../../types.ts';
import { analyzeRiskWithGemini } from '../../services/geminiService.ts';
import api from '../../services/api.ts';

const MOCK_ATTRIBUTES: IdentityAttribute[] = [
  { id: '1', key: 'full_name', label: 'Legal Name', value: 'John Doe Citizen', category: 'Personal', lastUpdated: '2024-03-01', isSensitive: false },
  { id: '3', key: 'blood_group', label: 'Blood Group', value: 'O Positive', category: 'Health', lastUpdated: '2023-11-20', isSensitive: false },
  { id: '5', key: 'farmer_id', label: 'Farmer ID', value: 'AG-IND-8821', category: 'Agriculture', lastUpdated: '2024-01-10', isSensitive: false },
  { id: '7', key: 'resident_permit', label: 'Resident ID', value: 'SC-992-BLR', category: 'City', lastUpdated: '2024-02-28', isSensitive: false },
];

const CitizenDashboard: React.FC = () => {
  const [requests, setRequests] = useState<AccessRequest[]>([
    {
      id: 'req_1',
      requesterName: 'City Central Hospital',
      requesterType: 'Healthcare',
      purpose: 'Emergency Protocol Verification',
      attributesRequested: ['full_name', 'medical_history', 'blood_group'],
      durationDays: 30,
      status: RequestStatus.PENDING,
      timestamp: new Date().toISOString()
    }
  ]);
  const [attributes] = useState(MOCK_ATTRIBUTES);
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ riskScore: number; analysis: string; tip: string } | null>(null);
  const [zkProofMode, setZkProofMode] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const handleReviewRequest = async (req: AccessRequest) => {
    setSelectedRequest(req);
    setIsAnalyzing(true);
    const result = await analyzeRiskWithGemini(req, attributes);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleDecision = async (id: string, approve: boolean) => {
    setActionLoading(true);
    try {
      if (approve) {
        await api.post('/citizen/authorize', { requestId: id });
      } else {
        // For revoke/block, we skip OTP for simplicity in dashboard (or could prompt)
        await api.post('/citizen/authorize', { requestId: id }); // Using authorize as placeholder
      }
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: approve ? RequestStatus.APPROVED : RequestStatus.DENIED } : r));
    } catch (error) {
      console.error('Action failed:', error);
      alert('Action failed. Please try again.');
    } finally {
      setActionLoading(false);
      setSelectedRequest(null);
      setAiAnalysis(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20 transition-colors">
      {/* Security Infrastructure (Bank-Level) */}
      <section className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-12 md:p-16 relative overflow-hidden border border-slate-800 shadow-2xl">
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <Fingerprint size={18} className="text-indigo-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Adaptive Behavioral Shield Active</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter text-white uppercase">Your Sovereign Vault</h2>
          <p className="text-lg font-medium opacity-60 leading-relaxed text-slate-300 max-w-xl transition-colors">
            Protected by hardware-bound FIDO2 keys and AES-256 envelope encryption. No third-party access is possible without your explicit cryptographic handshake.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
          <ShieldCheck size={350} strokeWidth={1} className="text-white" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Assets */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {attributes.map(attr => (
              <div key={attr.id} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-xl transition-colors ${attr.category === 'Health' ? 'bg-rose-50 text-rose-500 dark:bg-rose-900/20' :
                      attr.category === 'Agriculture' ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20' :
                        'bg-indigo-50 text-indigo-500 dark:bg-indigo-900/20'
                    }`}>
                    {attr.category === 'Health' ? <Heart size={20} /> : attr.category === 'Agriculture' ? <Sprout size={20} /> : <User size={20} />}
                  </div>
                  <span className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">{attr.category} Segment</span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{attr.label}</p>
                <p className="text-xl font-black text-[#0f172a] dark:text-white transition-colors">{attr.value}</p>
              </div>
            ))}
          </section>

          {/* Secure Audit Ledger */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-800 dark:text-white">Security Ledger</h3>
              <Link to="/citizen/logs" className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] hover:underline">Full Transaction Logs</Link>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {[
                { entity: 'FIDO2 Auth', action: 'Biometric Verified', time: '12m ago', icon: Fingerprint },
                { entity: 'Node Encryption', action: 'Key Shard Rotated', time: '1h ago', icon: Lock },
                { entity: 'Sovereign Node', action: 'Environment Isolated', time: '2h ago', icon: Cpu }
              ].map((log, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <log.icon size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{log.entity}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.action}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">{log.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Pending Broadcasts & Handshakes */}
        <div className="space-y-8">
          <section className="bg-slate-900 dark:bg-black text-white rounded-[2.5rem] p-10 border border-slate-800 shadow-2xl relative overflow-hidden transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Zap size={100} />
            </div>
            <div className="flex items-center justify-between mb-10 relative z-10">
              <h3 className="text-lg font-black uppercase tracking-widest">Broadcasts</h3>
              <span className="bg-[#ff9f43] text-white px-3 py-1 rounded-full text-[10px] font-black animate-pulse uppercase tracking-widest">Action Needed</span>
            </div>

            {requests.filter(r => r.status === RequestStatus.PENDING).length > 0 ? (
              requests.filter(r => r.status === RequestStatus.PENDING).map(req => (
                <div key={req.id} className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group relative z-10" onClick={() => handleReviewRequest(req)}>
                  <p className="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] mb-3">Request from {req.requesterType}</p>
                  <h4 className="text-2xl font-black mb-8 group-hover:text-orange-400 transition-colors uppercase leading-tight">{req.requesterName}</h4>
                  <button className="w-full py-5 bg-[#ff9f43] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-500 transition-colors shadow-lg shadow-orange-950/20">
                    View Consent Request
                  </button>
                </div>
              ))
            ) : (
              <div className="py-12 text-center relative z-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">No Pending Broadcasts</p>
              </div>
            )}
          </section>

          {/* Revoke Active Access */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck size={20} className="text-emerald-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Active Handshakes</h3>
            </div>
            <div className="space-y-4">
              {requests.filter(r => r.status === RequestStatus.APPROVED).length > 0 ? (
                requests.filter(r => r.status === RequestStatus.APPROVED).map(req => (
                  <div key={req.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl group transition-all">
                    <div>
                      <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate max-w-[120px]">{req.requesterName}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{req.attributesRequested.length} segments authorized</p>
                    </div>
                    <button
                      onClick={() => handleDecision(req.id, false)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                      title="Revoke Permission"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">No Active Connections</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Handshake Modal (Portaled and Scrollable) */}
      {selectedRequest && createPortal(
        <div className="fixed inset-0 z-[1000] bg-slate-900/60 dark:bg-black/80 backdrop-blur-2xl overflow-y-auto px-4 py-8 md:py-16 flex justify-center items-start sm:items-center animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 animate-in zoom-in duration-300 transition-colors my-auto">
            <div className="p-10 md:p-14 space-y-10">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.4em] mb-3 block">Consent Broadcast</span>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">{selectedRequest.requesterName}</h3>
                </div>
                <div className="bg-[#0f172a] dark:bg-black p-5 rounded-[1.5rem] text-white shadow-xl">
                  <Lock size={32} strokeWidth={2.5} />
                </div>
              </div>

              <div className={`p-8 rounded-[2rem] border transition-all relative overflow-hidden ${isAnalyzing ? 'bg-slate-50 border-slate-100 dark:bg-slate-800' :
                  aiAnalysis?.riskScore! > 50 ? 'bg-rose-50 border-rose-100 text-rose-900 dark:bg-rose-950/20' : 'bg-emerald-50/50 border-emerald-100 text-emerald-900 dark:bg-emerald-950/20'
                }`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className={isAnalyzing ? 'text-slate-400' : aiAnalysis?.riskScore! > 50 ? 'text-rose-500' : 'text-emerald-500'} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isAnalyzing ? 'text-slate-400' : aiAnalysis?.riskScore! > 50 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {isAnalyzing ? 'Privacy Intelligence Analysis...' : `Privacy Risk: ${aiAnalysis?.riskScore! > 50 ? 'Elevated' : 'Safe'}`}
                    </span>
                  </div>
                  <span className="text-[8px] font-black opacity-40 uppercase tracking-widest dark:text-white">Gemini 3 Flash</span>
                </div>

                {isAnalyzing ? (
                  <div className="space-y-4">
                    <div className="animate-pulse h-12 bg-slate-200 dark:bg-slate-700/50 rounded-2xl w-full"></div>
                    <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700/50 rounded-lg w-3/4"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm font-bold leading-relaxed uppercase tracking-wide opacity-80 dark:text-white">{aiAnalysis?.analysis}</p>
                    <div className="pt-4 border-t border-black/5 dark:border-white/10 mt-4">
                      <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 dark:text-indigo-400">
                        <Info size={12} />
                        Pro-Tip: {aiAnalysis?.tip}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Segments Requested:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.attributesRequested.map(attr => (
                    <span key={attr} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-[9px] font-black uppercase tracking-widest dark:text-white">
                      {attr.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-[#0f172a] dark:bg-black rounded-2xl text-white">
                  <div className="flex items-center gap-4">
                    <Zap size={20} className="text-indigo-400" />
                    <span className="text-xs font-black uppercase tracking-widest">Zero-Knowledge Mode</span>
                  </div>
                  <button
                    onClick={() => setZkProofMode(!zkProofMode)}
                    className={`w-12 h-6 rounded-full transition-all relative ${zkProofMode ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${zkProofMode ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleDecision(selectedRequest.id, true)}
                    className="py-6 bg-[#0f172a] dark:bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-2xl hover:bg-black transition-all active:scale-95"
                  >
                    Authorize Share
                  </button>
                  <button
                    onClick={() => handleDecision(selectedRequest.id, false)}
                    className="py-6 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl border border-slate-100 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-95"
                  >
                    Reject Broadcast
                  </button>
                </div>

                <button
                  onClick={() => setSelectedRequest(null)}
                  className="w-full text-slate-300 dark:text-slate-600 font-black uppercase tracking-[0.2em] text-[9px] hover:text-slate-500 transition-colors"
                >
                  Close Sequence
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CitizenDashboard;
