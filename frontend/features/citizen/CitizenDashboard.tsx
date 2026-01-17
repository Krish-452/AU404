
import React, { useState } from 'react';
import { 
  User, Heart, MapPin, Sprout, ShieldCheck, ShieldAlert, Clock, ExternalLink,
  ChevronRight, Fingerprint, Zap, Eye, EyeOff, ShieldX, Info,
  History as HistoryIcon, Cpu, Lock, Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { IdentityAttribute, AccessRequest, RequestStatus } from '../../types';
import { analyzeRiskWithGemini } from '../../services/geminiService';

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

  const handleReviewRequest = async (req: AccessRequest) => {
    setSelectedRequest(req);
    setIsAnalyzing(true);
    const result = await analyzeRiskWithGemini(req, attributes);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleDecision = (id: string, approve: boolean) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: approve ? RequestStatus.APPROVED : RequestStatus.DENIED } : r));
    setSelectedRequest(null);
    setAiAnalysis(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20 transition-colors">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
             <Link to="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
             <ChevronRight size={14} />
             <span className="text-slate-900 dark:text-slate-300">Citizen Shard Hub</span>
          </div>
          <h1 className="text-5xl font-black text-[#0f172a] dark:text-white tracking-tighter uppercase">National Identity</h1>
        </div>
        <div className="flex gap-4">
           <div className="px-5 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center gap-3 shadow-sm transition-colors">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Identity Active: Node-Sovereign</span>
           </div>
        </div>
      </header>

      {/* Security Infrastructure (Bank-Level) */}
      <section className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-12 md:p-16 relative overflow-hidden border border-slate-800 shadow-2xl">
         <div className="max-w-3xl relative z-10">
            <div className="flex items-center gap-3 mb-8">
               <Fingerprint size={18} className="text-indigo-400 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Adaptive Behavioral Shield Active</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter text-white uppercase">Your Sovereign Vault</h2>
            <p className="text-lg font-medium opacity-60 leading-relaxed text-slate-300 max-w-xl">
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
                  <div className={`p-3 rounded-xl transition-colors ${
                    attr.category === 'Health' ? 'bg-rose-50 text-rose-500 dark:bg-rose-900/20' : 
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

        {/* Security Prevention Sidebar */}
        <div className="space-y-8">
          <section className="bg-slate-900 dark:bg-black text-white rounded-[2.5rem] p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <Zap size={100} />
             </div>
             <div className="flex items-center justify-between mb-10 relative z-10">
                <h3 className="text-lg font-black uppercase tracking-widest">Handshakes</h3>
                <span className="bg-[#ff9f43] text-white px-3 py-1 rounded-full text-[10px] font-black animate-pulse">ACTION REQUIRED</span>
             </div>
             {requests.filter(r => r.status === RequestStatus.PENDING).map(req => (
               <div key={req.id} className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group relative z-10" onClick={() => handleReviewRequest(req)}>
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2">{req.requesterType} Request</p>
                  <h4 className="text-2xl font-black mb-6 group-hover:text-orange-400 transition-colors">{req.requesterName}</h4>
                  <button className="w-full py-5 bg-[#ff9f43] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-500 transition-colors shadow-lg shadow-orange-950/20">
                    Verify Identity
                  </button>
               </div>
             ))}
          </section>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 text-center shadow-sm transition-colors group">
             <div className="h-16 w-16 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mx-auto mb-6 text-indigo-500 group-hover:scale-110 transition-transform">
                <Smartphone size={32} />
             </div>
             <h3 className="text-xl font-black mb-2 uppercase tracking-tight text-slate-900 dark:text-white">FIDO2 Auth</h3>
             <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-8 uppercase text-[10px] tracking-widest leading-relaxed">Identity segments are sharded and bound to your hardware authenticator.</p>
             <button className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#0f172a] dark:text-white border-2 border-slate-100 dark:border-slate-800 rounded-xl hover:border-indigo-600 dark:hover:border-indigo-400 transition-all">Setup Passkey</button>
          </div>
        </div>
      </div>

      {/* Handshake Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
           <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300 border dark:border-slate-800 transition-colors">
              <div className="p-10 md:p-14">
                 <div className="flex justify-between items-start mb-10">
                    <div>
                       <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4 block">Secure Consent Verification</span>
                       <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{selectedRequest.requesterName}</h3>
                    </div>
                    <div className="bg-slate-900 dark:bg-black p-5 rounded-2xl text-white">
                       <ShieldAlert size={32} />
                    </div>
                 </div>

                 <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl mb-10 transition-colors relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <Zap size={60} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <Zap size={14} className="text-orange-400" />
                       Behavioral Risk Analysis
                    </p>
                    {isAnalyzing ? (
                      <div className="space-y-4">
                        <div className="animate-pulse h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-1/3"></div>
                        <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                         <div className={`text-5xl font-black ${aiAnalysis?.riskScore! > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {aiAnalysis?.riskScore}%
                         </div>
                         <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-wider">{aiAnalysis?.analysis}</p>
                         <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">Constraint: {aiAnalysis?.tip}</p>
                         </div>
                      </div>
                    )}
                 </div>

                 <div className="flex flex-col gap-4">
                    <button onClick={() => handleDecision(selectedRequest.id, true)} className="w-full py-6 bg-slate-900 dark:bg-indigo-600 text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-2xl hover:bg-black dark:hover:bg-indigo-700 transition-all active:scale-95">Authorize Decryption</button>
                    <button onClick={() => setSelectedRequest(null)} className="w-full py-6 text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-xs hover:text-slate-600 dark:hover:text-slate-300">Deny Access</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
