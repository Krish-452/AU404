import React, { useState } from 'react';
import { 
  User, Eye, EyeOff, ShieldCheck, Plus, Trash2, Heart, Sprout, 
  Building, Cpu, Lock, Key, Smartphone, Edit3, X, Fingerprint, 
  Loader2, ShieldAlert, AlertTriangle, ShieldX 
} from 'lucide-react';
import { IdentityAttribute } from '../../types';
import { useAuth } from '../../context/AuthContext';

const CitizenAssets: React.FC = () => {
  const { logout } = useAuth();
  const [attributes, setAttributes] = useState<IdentityAttribute[]>([
    { id: '1', key: 'full_name', label: 'Legal Name', value: 'John Doe Citizen', category: 'Personal', lastUpdated: '2024-03-01', isSensitive: false },
    { id: '2', key: 'dob', label: 'Date of Birth', value: '1985-06-15', category: 'Personal', lastUpdated: '2024-03-01', isSensitive: true },
    { id: '3', key: 'blood_group', label: 'Blood Group', value: 'O Positive', category: 'Health', lastUpdated: '2023-11-20', isSensitive: false },
    { id: '4', key: 'medical_history', label: 'Chronic Conditions', value: 'Hypertension (Managed)', category: 'Health', lastUpdated: '2024-02-15', isSensitive: true },
    { id: '5', key: 'farmer_id', label: 'National Farmer ID', value: 'AG-IND-8821-X', category: 'Agriculture', lastUpdated: '2024-01-10', isSensitive: false },
    { id: '6', key: 'land_records', label: 'Land Parcel Ref', value: 'BLR/W-42/P-902', category: 'Agriculture', lastUpdated: '2023-12-05', isSensitive: true },
    { id: '7', key: 'resident_permit', label: 'Smart City Permit', value: 'SC-992-BLR-2024', category: 'City', lastUpdated: '2024-02-28', isSensitive: false },
  ]);

  const [hidden, setHidden] = useState<Set<string>>(new Set(['2', '4', '6']));
  const [editingAttr, setEditingAttr] = useState<IdentityAttribute | null>(null);
  const [newValue, setNewValue] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [verificationStep, setVerificationStep] = useState<'input' | 'processing' | 'success'>('input');
  
  // OTP States for Revoke/Delete
  const [otpModal, setOtpModal] = useState<{ open: boolean; action: 'revoke' | 'delete' | null }>({ open: false, action: null });
  const [otpValue, setOtpValue] = useState('');
  const [otpStep, setOtpStep] = useState<'input' | 'processing' | 'success'>('input');

  const toggleMask = (id: string) => {
    const newHidden = new Set(hidden);
    if (newHidden.has(id)) newHidden.delete(id);
    else newHidden.add(id);
    setHidden(newHidden);
  };

  const handleEditClick = (attr: IdentityAttribute) => {
    setEditingAttr(attr);
    setNewValue(attr.value);
    setAadhaar('');
    setVerificationStep('input');
  };

  const handleVerifyAndSave = async () => {
    if (!aadhaar || aadhaar.length !== 12) return;
    setVerificationStep('processing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAttributes(prev => prev.map(a => 
      a.id === editingAttr?.id ? { ...a, value: newValue, lastUpdated: new Date().toISOString().split('T')[0] } : a
    ));
    setVerificationStep('success');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setEditingAttr(null);
  };

  const handleOtpConfirm = async () => {
    if (otpValue !== '123456') return;
    setOtpStep('processing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setOtpStep('success');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (otpModal.action === 'delete') {
      logout();
    } else {
      setOtpModal({ open: false, action: null });
      setOtpStep('input');
      setOtpValue('');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Health': return <Heart size={24} />;
      case 'Agriculture': return <Sprout size={24} />;
      case 'City': return <Building size={24} />;
      default: return <User size={24} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Health': return 'bg-rose-50 text-rose-500 dark:bg-rose-900/20';
      case 'Agriculture': return 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20';
      case 'City': return 'bg-blue-50 text-blue-500 dark:bg-blue-900/20';
      default: return 'bg-indigo-50 text-indigo-500 dark:bg-indigo-900/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-4 md:px-0">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Identity Vault</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest">Bank-Grade Zero-Knowledge Asset Storage</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={() => { setOtpModal({ open: true, action: 'revoke' }); setOtpStep('input'); setOtpValue(''); }}
            className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 transition-all flex items-center gap-3 justify-center border border-slate-200 dark:border-slate-700"
          >
             <ShieldX size={16} /> Revoke All Handshakes
          </button>
          <button className="px-8 py-4 bg-[#ff9f43] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 dark:shadow-none flex items-center gap-3 justify-center">
             <Plus size={16} /> Link New Shard
          </button>
        </div>
      </header>

      {/* Security Infrastructure Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0">
        <div className="bg-[#0f172a] dark:bg-black rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl border dark:border-slate-800">
           <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none rotate-12">
              <ShieldCheck size={200} />
           </div>
           <div className="max-w-xl relative z-10">
              <div className="flex items-center gap-4 mb-6 text-indigo-400">
                 <Lock size={28} />
                 <h3 className="text-2xl font-black uppercase tracking-tight">Encryption Engine</h3>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed mb-8 uppercase text-[10px] tracking-widest">
                Identity shards are sharded across the sovereign node cluster. Decryption is only possible through your authenticated FIDO2 device handshake.
              </p>
              <div className="flex flex-wrap gap-4">
                 <span className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/10">SHA-256 Verified</span>
                 <span className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/10">Zero-Trust V2.4</span>
              </div>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
           <div className="flex items-center gap-4 mb-10 text-slate-900 dark:text-white">
              <Key size={28} className="text-orange-500" />
              <h3 className="text-2xl font-black uppercase tracking-tight">Active Handshakes</h3>
           </div>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 transition-all">
                 <div className="flex items-center gap-4">
                    <Smartphone className="text-slate-400 shrink-0" size={20} />
                    <div>
                       <p className="text-xs font-black text-slate-900 dark:text-white uppercase">Primary Authenticator</p>
                       <p className="text-[8px] font-bold text-slate-500 uppercase">Registered Mobile Node | Verified</p>
                    </div>
                 </div>
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              </div>
              <button className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
                 Provision Secondary FIDO2 Key
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
        {attributes.map(attr => (
          <div key={attr.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm group hover:shadow-xl transition-all">
             <div className="flex justify-between items-start mb-10">
                <div className={`p-4 rounded-2xl transition-colors ${getCategoryColor(attr.category)}`}>
                   {getCategoryIcon(attr.category)}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditClick(attr)}
                    className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-900 hover:text-white dark:hover:bg-indigo-600 transition-all"
                    title="Edit Attribute"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => toggleMask(attr.id)}
                    className={`p-3 rounded-xl transition-all ${hidden.has(attr.id) ? 'bg-slate-100 text-slate-400 dark:bg-slate-800' : 'bg-[#0f172a] text-white shadow-lg'}`}
                  >
                    {hidden.has(attr.id) ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
             </div>
             <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{attr.label}</p>
                <div className={`text-2xl font-black transition-all duration-500 ${hidden.has(attr.id) ? 'text-slate-200 dark:text-slate-800 blur-[6px] select-none' : 'text-slate-900 dark:text-white'}`}>
                  {attr.value}
                </div>
             </div>
             <div className="mt-8 pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600">
                <span className="flex items-center gap-1"><Cpu size={10} /> {attr.category} Asset</span>
                <span>Last Updated: {attr.lastUpdated}</span>
             </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <section className="px-4 md:px-0 pt-10">
         <div className="bg-rose-50/30 dark:bg-rose-950/10 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30 p-10 md:p-14 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
               <div className="max-w-2xl space-y-4">
                  <div className="flex items-center gap-3 text-rose-500">
                     <AlertTriangle size={24} />
                     <h3 className="text-2xl font-black uppercase tracking-tight">Identity Decommissioning</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed uppercase text-[10px] tracking-widest">
                    Permanent deletion of your sovereign identity node. This action is irreversible and will purge all linked assets, certificates, and decryption shards from the National Ledger.
                  </p>
               </div>
               <button 
                 onClick={() => { setOtpModal({ open: true, action: 'delete' }); setOtpStep('input'); setOtpValue(''); }}
                 className="px-10 py-5 bg-rose-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl hover:bg-rose-700 transition-all flex items-center gap-3 justify-center shrink-0"
               >
                  <Trash2 size={18} /> Decommission Identity
               </button>
            </div>
         </div>
      </section>

      {/* Verification Modal (OTP) */}
      {otpModal.open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-2xl">
           <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 border dark:border-slate-800 flex flex-col overflow-hidden">
              <div className="p-10 md:p-14 pb-0 flex justify-between items-start">
                 <div>
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mb-4 block">Verification Sequence</span>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                      {otpModal.action === 'delete' ? 'Confirm Deletion' : 'Confirm Revocation'}
                    </h3>
                 </div>
                 <button onClick={() => setOtpModal({ open: false, action: null })} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X size={24} className="text-slate-400" />
                 </button>
              </div>

              <div className="p-10 md:p-14 pt-8 space-y-10">
                 {otpStep === 'input' && (
                    <div className="space-y-10 animate-in fade-in duration-300">
                       <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-relaxed">
                            A one-time cryptographic code has been dispatched to your primary authenticator node.
                          </p>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Enter 6-Digit OTP</label>
                          <input 
                            type="text" 
                            maxLength={6}
                            value={otpValue}
                            onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            className="w-full py-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-rose-600 outline-none transition-all font-mono tracking-[0.6em] text-center text-3xl dark:text-white"
                          />
                          <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Default Demo Code: 123456</p>
                       </div>

                       <button 
                         onClick={handleOtpConfirm}
                         disabled={otpValue.length !== 6}
                         className="w-full py-6 bg-rose-600 text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-xl hover:bg-rose-700 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
                       >
                          Finalize Authorization
                       </button>
                    </div>
                 )}

                 {otpStep === 'processing' && (
                   <div className="py-20 flex flex-col items-center space-y-8 animate-in fade-in duration-500 text-center">
                      <div className="relative">
                         <Loader2 size={64} className="text-rose-600 animate-spin" />
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Processing Shard Purge</h4>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Broadcasting revocation to all ecosystem nodes...</p>
                      </div>
                   </div>
                 )}

                 {otpStep === 'success' && (
                   <div className="py-20 flex flex-col items-center space-y-8 animate-in zoom-in duration-500 text-center">
                      <div className="h-24 w-24 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-100 dark:shadow-none transition-all">
                         <ShieldCheck size={48} />
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Execution Success</h4>
                         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Immutable Ledger Updated</p>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Attribute Editor Modal */}
      {editingAttr && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-xl transition-opacity">
           <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2rem] md:rounded-[3rem] shadow-2xl animate-in zoom-in duration-300 border dark:border-slate-800 max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
              <div className="p-8 md:p-14 pb-4 md:pb-6 flex justify-between items-start shrink-0">
                 <div>
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-2 md:mb-4 block">Secure Shard Update</span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Edit {editingAttr.label}</h3>
                 </div>
                 <button onClick={() => setEditingAttr(null)} className="p-2 md:p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0 ml-4">
                    <X size={24} className="text-slate-400" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar px-8 md:px-14 pb-8 md:pb-14">
                 {verificationStep === 'input' && (
                   <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Proposed Value</label>
                         <input 
                           type="text" 
                           value={newValue}
                           onChange={(e) => setNewValue(e.target.value)}
                           className="w-full px-6 py-4 md:py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold dark:text-white text-base md:text-lg"
                         />
                      </div>

                      <div className="space-y-3">
                         <div className="flex flex-col sm:flex-row sm:items-center justify-between ml-1 gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aadhaar Card Verification (12-Digit)</label>
                            <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Auth Required</span>
                         </div>
                         <div className="relative">
                            <input 
                              type="password" 
                              maxLength={12}
                              value={aadhaar}
                              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                              placeholder="0000 0000 0000"
                              className="w-full px-12 md:px-16 py-4 md:py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-600 outline-none transition-all font-mono tracking-[0.3em] md:tracking-[0.5em] text-center text-lg md:text-xl dark:text-white"
                            />
                            <Fingerprint size={20} className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                         </div>
                      </div>

                      <div className="p-5 md:p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                         <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-widest flex items-start gap-3">
                            <ShieldAlert size={14} className="shrink-0 text-orange-500 mt-0.5" />
                            <span>By clicking "Verify & Update", you authorize a cryptographic handshake between your sovereign node and the National Identity Registry to validate the authenticity of the provided Aadhaar number.</span>
                         </p>
                      </div>

                      <button 
                        onClick={handleVerifyAndSave}
                        disabled={!newValue || aadhaar.length !== 12}
                        className="w-full py-5 md:py-6 bg-slate-900 dark:bg-indigo-600 text-white font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs rounded-2xl shadow-xl hover:bg-black dark:hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale mt-2"
                      >
                         Verify & Update Shard
                      </button>
                   </div>
                 )}

                 {verificationStep === 'processing' && (
                   <div className="py-12 md:py-20 flex flex-col items-center space-y-8 animate-in fade-in duration-500 text-center">
                      <div className="relative">
                         <Loader2 size={64} className="text-indigo-600 animate-spin md:size-80" />
                         <ShieldCheck size={28} className="absolute inset-0 m-auto text-indigo-400 md:size-32" />
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Authenticating Shard</h4>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Requesting Zero-Knowledge Proof from Gateway...</p>
                      </div>
                   </div>
                 )}

                 {verificationStep === 'success' && (
                   <div className="py-12 md:py-20 flex flex-col items-center space-y-8 animate-in zoom-in duration-500 text-center">
                      <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-100 dark:shadow-none transition-all">
                         <ShieldCheck size={40} className="md:size-48" />
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Identity Verified</h4>
                         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Secure Ledger Updated Successfully</p>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CitizenAssets;