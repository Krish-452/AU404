
import React, { useState } from 'react';
import { 
  User, Heart, MapPin, Sprout, ShieldCheck, ShieldAlert, Clock, ExternalLink,
  ChevronRight, Fingerprint, Zap, Eye, EyeOff, ShieldX, Info,
  History as HistoryIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { IdentityAttribute, AccessRequest, RequestStatus } from '../../types';
import { analyzeRiskWithGemini } from '../../services/geminiService';

const MOCK_ATTRIBUTES: IdentityAttribute[] = [
  { id: '1', key: 'full_name', label: 'Legal Name', value: 'John Doe Citizen', category: 'Personal', lastUpdated: '2024-03-01', isSensitive: false },
  { id: '2', key: 'dob', label: 'Date of Birth', value: '1985-06-15', category: 'Personal', lastUpdated: '2024-03-01', isSensitive: true },
  { id: '3', key: 'blood_group', label: 'Blood Group', value: 'O Positive', category: 'Health', lastUpdated: '2023-11-20', isSensitive: false },
  { id: '4', key: 'medical_history', label: 'Chronic Conditions', value: 'Hypertension (Managed)', category: 'Health', lastUpdated: '2024-02-15', isSensitive: true },
];

const CitizenDashboard: React.FC = () => {
  const [requests, setRequests] = useState<AccessRequest[]>([
    { 
      id: 'req_1', 
      requesterName: 'City Central Hospital', 
      requesterType: 'Healthcare', 
      purpose: 'Updating Emergency Patient Records', 
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
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20 transition-colors duration-300">
      <header>
        <div className="flex items-center gap-2 mb-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
           <Link to="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
           <ChevronRight size={14} />
           <span className="text-slate-900 dark:text-slate-300">Citizen Dashboard</span>
        </div>
        <h1 className="text-5xl font-black text-[#0f172a] dark:text-white tracking-tight mb-8 uppercase">Citizen Dashboard</h1>
      </header>

      {/* Main Banner */}
      <section className="node-active-banner rounded-3xl p-12 md:p-20 relative overflow-hidden bg-slate-900 dark:bg-slate-900 border border-slate-800">
         <div className="max-w-3xl relative z-10">
            <div className="flex items-center gap-3 mb-8">
               <div className="h-1 w-12 bg-white"></div>
               <span className="text-xs font-black uppercase tracking-[0.4em] opacity-60 text-white">National Registry Status</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter text-white">SOVEREIGN NODE ACTIVE</h2>
            <p className="text-lg md:text-xl font-medium opacity-60 leading-relaxed text-white">
              Your cryptographic identity node is synchronized with the central registry. No unauthorized access attempts detected in the last 24 hours.
            </p>
         </div>
         {/* Decorative Background Element */}
         <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <ShieldCheck size={300} strokeWidth={1} className="text-white" />
         </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Assets */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {attributes.map(attr => (
              <div key={attr.id} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-300">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl w-fit mb-6 transition-colors">
                  {attr.category === 'Health' ? <Heart size={20} className="text-rose-500" /> : <User size={20} className="text-indigo-500" />}
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{attr.label}</p>
                <p className="text-xl font-black text-[#0f172a] dark:text-white">{attr.value}</p>
              </div>
            ))}
          </section>

          {/* Activity Logs */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-800 dark:text-white">Global Transparency Ledger</h3>
              <button className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">View All Logs</button>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
               {[
                 { entity: 'Node-Sync', action: 'Identity Update', time: '5m ago' },
                 { entity: 'MFA Cluster', action: 'Secure Login', time: '12m ago' },
                 { entity: 'Central Auth', action: 'Public Key Rotation', time: '1h ago' }
               ].map((log, i) => (
                 <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                          <HistoryIcon size={16} />
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

        {/* Action Panel */}
        <div className="space-y-8">
          <section className="bg-[#0f172a] dark:bg-black text-white rounded-3xl p-10 border dark:border-slate-800 transition-colors">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black uppercase tracking-widest">Verify Requests</h3>
                <span className="bg-[#ff9f43] text-white px-3 py-1 rounded-full text-[10px] font-black">01 Pending</span>
             </div>
             {requests.filter(r => r.status === RequestStatus.PENDING).map(req => (
               <div key={req.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer" onClick={() => handleReviewRequest(req)}>
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2">{req.requesterType}</p>
                  <h4 className="text-xl font-black mb-4">{req.requesterName}</h4>
                  <button className="w-full py-4 bg-[#ff9f43] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-colors">
                    Decryption Handshake
                  </button>
               </div>
             ))}
          </section>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-100 dark:border-slate-800 text-center shadow-sm transition-colors duration-300">
             <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
                <Fingerprint size={32} className="text-slate-400 dark:text-slate-500" />
             </div>
             <h3 className="text-xl font-black mb-2 uppercase tracking-tight text-slate-900 dark:text-white">Security Keys</h3>
             <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-8 uppercase">Your identity shards are encrypted using FIPS 140-2 level keys.</p>
             <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-[#0f172a] dark:text-white border-2 border-slate-100 dark:border-slate-800 rounded-xl hover:border-indigo-600 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">Manage Keys</button>
          </div>
        </div>
      </div>

      {/* Handshake Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
           <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300 border dark:border-slate-800 transition-colors duration-300">
              <div className="p-10">
                 <div className="flex justify-between items-start mb-10">
                    <div>
                       <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-2 block">Consent Handshake</span>
                       <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{selectedRequest.requesterName}</h3>
                    </div>
                    <div className="bg-slate-900 dark:bg-black p-4 rounded-xl text-white">
                       <ShieldAlert size={32} />
                    </div>
                 </div>

                 <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl mb-8 transition-colors">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Risk Analysis System</p>
                    {isAnalyzing ? <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div> : 
                      <div className="flex items-center gap-6">
                         <div className="text-4xl font-black text-slate-900 dark:text-white">{aiAnalysis?.riskScore}%</div>
                         <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase">{aiAnalysis?.analysis}</p>
                      </div>
                    }
                 </div>

                 <div className="flex flex-col gap-4">
                    <button onClick={() => handleDecision(selectedRequest.id, true)} className="w-full py-5 bg-[#ff9f43] text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-orange-100 transition-all active:scale-95">Confirm and Share</button>
                    <button onClick={() => setSelectedRequest(null)} className="w-full py-5 text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest text-xs hover:text-slate-600 dark:hover:text-slate-300">Cancel</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
