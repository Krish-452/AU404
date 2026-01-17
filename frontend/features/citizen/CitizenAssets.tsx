
import React, { useState } from 'react';
import { User, Eye, EyeOff, ShieldCheck, Plus, Trash2, Heart, Sprout, Building, Info, CheckCircle2, Clock } from 'lucide-react';
import { IdentityAttribute } from '../../types';

const CitizenAssets: React.FC = () => {
  const [attributes, setAttributes] = useState<IdentityAttribute[]>([
    { id: '1', key: 'full_name', label: 'Legal Name', value: 'John Doe Citizen', category: 'Personal', lastUpdated: '2024-03-01', isSensitive: false },
    { id: '2', key: 'dob', label: 'Date of Birth', value: '1985-06-15', category: 'Personal', lastUpdated: '2024-03-01', isSensitive: true },
    { id: '3', key: 'blood_group', label: 'Blood Group', value: 'O Positive', category: 'Health', lastUpdated: '2023-11-20', isSensitive: false },
    { id: '4', key: 'medical_history', label: 'Chronic Conditions', value: 'Hypertension (Managed)', category: 'Health', lastUpdated: '2024-02-15', isSensitive: true },
  ]);

  const [hidden, setHidden] = useState<Set<string>>(new Set(['2', '4']));

  const toggleHide = (id: string) => {
    setHidden(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20 transition-colors">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Identity Vault</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest">Manage your sharded attributes and selective disclosure</p>
        </div>
        <button className="px-8 py-4 bg-[#ff9f43] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-orange-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-orange-100 dark:shadow-none">
           <Plus size={16} /> Link New Asset
        </button>
      </header>

      <div className="bg-indigo-900 dark:bg-indigo-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-100 dark:shadow-none mb-12 border border-white/5">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none rotate-12">
           <ShieldCheck size={200} />
        </div>
        <div className="max-w-xl relative z-10">
           <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Selective Disclosure Active</h3>
           <p className="text-indigo-100 font-medium leading-relaxed opacity-80 mb-8">
             Only the attributes you set as 'Visible' can be requested by external service providers. Sensitive data requires a separate MFA sequence for decryption.
           </p>
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <CheckCircle2 size={16} className="text-emerald-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Quantum Resistant</span>
              </div>
              <div className="flex items-center gap-2">
                 <CheckCircle2 size={16} className="text-emerald-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Zero Knowledge Proofs</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {attributes.map(attr => (
          <div key={attr.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl hover:shadow-slate-100 dark:hover:shadow-none transition-all flex flex-col justify-between">
             <div className="flex justify-between items-start mb-10">
                <div className={`p-4 rounded-2xl transition-colors ${
                  attr.category === 'Health' ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-500' :
                  attr.category === 'Agriculture' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500' :
                  'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500'
                }`}>
                   {attr.category === 'Health' ? <Heart size={24} /> : 
                    attr.category === 'Agriculture' ? <Sprout size={24} /> : <User size={24} />}
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={() => toggleHide(attr.id)}
                    className={`p-3 rounded-xl transition-all ${hidden.has(attr.id) ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500' : 'bg-[#0f172a] dark:bg-indigo-600 text-white shadow-lg dark:shadow-none'}`}
                    title={hidden.has(attr.id) ? "Hidden from providers" : "Visible to providers"}
                   >
                     {hidden.has(attr.id) ? <EyeOff size={18} /> : <Eye size={18} />}
                   </button>
                   <button className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 rounded-xl hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all border border-transparent dark:border-slate-700">
                      <Trash2 size={18} />
                   </button>
                </div>
             </div>

             <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{attr.label}</p>
                <div className={`text-2xl font-black transition-all duration-500 ${hidden.has(attr.id) ? 'text-slate-200 dark:text-slate-800 blur-[4px] select-none' : 'text-slate-900 dark:text-white'}`}>
                  {attr.value}
                </div>
             </div>

             <div className="mt-10 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em] transition-colors">
                <span className="flex items-center gap-1"><Clock size={10} /> Sync: {attr.lastUpdated}</span>
                <span className="flex items-center gap-1 uppercase">{attr.category}</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CitizenAssets;
