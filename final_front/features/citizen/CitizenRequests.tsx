
import React, { useState } from 'react';
import { ShieldAlert, Clock, ChevronRight, CheckCircle, XCircle, FileText, Info, Loader2 } from 'lucide-react';
import { AccessRequest, RequestStatus } from '../../types.ts';
import api from '../../services/api.ts';

const CitizenRequests: React.FC = () => {
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
    },
    {
      id: 'req_2',
      requesterName: 'National Agri-Hub',
      requesterType: 'Agriculture',
      purpose: 'Subsidy Eligibility Audit',
      attributesRequested: ['farm_id', 'land_parcel'],
      durationDays: 14,
      status: RequestStatus.APPROVED,
      timestamp: new Date(Date.now() - 86400000).toISOString()
    }
  ]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAuthorize = async (requestId: string) => {
    setLoadingId(requestId);
    try {
      await api.post('/citizen/authorize', { requestId });
      setRequests(prev => prev.map(r =>
        r.id === requestId ? { ...r, status: RequestStatus.APPROVED } : r
      ));
    } catch (error) {
      console.error('Authorization failed:', error);
      alert('Authorization failed. Please try again.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleBlock = async (requestId: string) => {
    const otp = prompt('Enter OTP for high-risk action (Check your email):');
    if (!otp) return;

    setLoadingId(requestId);
    try {
      await api.post('/citizen/block', { requestId, otp });
      setRequests(prev => prev.map(r =>
        r.id === requestId ? { ...r, status: RequestStatus.DENIED } : r
      ));
    } catch (error: any) {
      console.error('Block failed:', error);
      alert(error.response?.data?.message || 'Block failed. Invalid OTP?');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20 transition-colors">
      <header>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase transition-colors">Consent Handshakes</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest transition-colors">Decryption requests pending your authorization</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {requests.map((req) => (
          <div key={req.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-slate-100/50 dark:hover:shadow-none transition-all group">
            <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-6">
                <div className={`h-16 w-16 min-w-[64px] rounded-2xl flex items-center justify-center transition-colors ${req.status === RequestStatus.PENDING ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-500' :
                  req.status === RequestStatus.APPROVED ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500' :
                    'bg-slate-50 dark:bg-slate-800 text-slate-400'
                  }`}>
                  {req.status === RequestStatus.PENDING ? <ShieldAlert size={32} /> :
                    req.status === RequestStatus.APPROVED ? <CheckCircle size={32} /> : <XCircle size={32} />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{req.requesterType}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Clock size={10} /> {new Date(req.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white transition-colors">{req.requesterName}</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg transition-colors">{req.purpose}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {req.status === RequestStatus.PENDING ? (
                  <>
                    <button
                      onClick={() => handleAuthorize(req.id)}
                      disabled={loadingId === req.id}
                      className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-black dark:hover:bg-indigo-700 transition-all shadow-lg dark:shadow-none disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loadingId === req.id ? <Loader2 size={14} className="animate-spin" /> : null}
                      Authorize Share
                    </button>
                    <button
                      onClick={() => handleBlock(req.id)}
                      disabled={loadingId === req.id}
                      className="w-full sm:w-auto px-8 py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-500 transition-all border border-slate-100 dark:border-slate-700 disabled:opacity-50"
                    >
                      Block Request
                    </button>
                  </>
                ) : (
                  <div className={`px-6 py-3 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-colors ${req.status === RequestStatus.APPROVED ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                    }`}>
                    {req.status === RequestStatus.APPROVED ? 'Access Authorized' : 'Access Denied'}
                    <ChevronRight size={14} />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-800/50 p-6 md:px-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between transition-colors">
              <div className="flex flex-wrap gap-2">
                {req.attributesRequested.map(attr => (
                  <span key={attr} className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                    {attr.replace('_', ' ')}
                  </span>
                ))}
              </div>
              <div className="text-[10px] font-black uppercase text-slate-300 dark:text-slate-600 tracking-widest group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors cursor-pointer flex items-center gap-2">
                Audit Trail <FileText size={12} />
              </div>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="h-20 w-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto text-slate-300 dark:text-slate-700">
              <Info size={40} />
            </div>
            <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-xs">No pending or historical requests found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenRequests;
