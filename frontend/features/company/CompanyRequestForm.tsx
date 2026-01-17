
import React, { useState } from 'react';
import { Send, FileText, Search, ShieldCheck, Database, Info, CheckCircle } from 'lucide-react';

const CompanyRequestForm: React.FC = () => {
  const [citizenId, setCitizenId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [attributes, setAttributes] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const availableAttributes = [
    { id: 'full_name', label: 'Full Legal Name' },
    { id: 'dob', label: 'Date of Birth' },
    { id: 'medical_history', label: 'Medical History' },
    { id: 'farm_id', label: 'Agri Registry ID' },
    { id: 'land_parcel', label: 'Land Record Ref' }
  ];

  const handleToggle = (id: string) => {
    setAttributes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20 transition-colors">
      <header>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">New Data Request</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest">Initiate a time-bound identity attribute request</p>
      </header>

      <form onSubmit={handleRequest} className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-100 dark:shadow-none overflow-hidden transition-colors">
        <div className="p-10 md:p-14 space-y-12">
          
          <div className="space-y-6">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Target Identity</label>
            <div className="relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={20} />
               <input 
                type="text" 
                required 
                placeholder="Citizen DID / Registered Email"
                value={citizenId}
                onChange={e => setCitizenId(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 dark:focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 dark:focus:border-indigo-400 outline-none transition-all text-sm font-bold dark:text-white"
               />
            </div>
          </div>

          <div className="space-y-6">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Required Attributes</label>
            <div className="flex flex-wrap gap-3">
               {availableAttributes.map(item => (
                 <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggle(item.id)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    attributes.includes(item.id) 
                    ? 'bg-slate-900 dark:bg-indigo-600 border-slate-900 dark:border-indigo-600 text-white shadow-lg' 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-indigo-600 dark:hover:border-indigo-400'
                  }`}
                 >
                   {item.label}
                 </button>
               ))}
            </div>
          </div>

          <div className="space-y-6">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Purpose of Access</label>
            <textarea 
              rows={4} 
              required
              placeholder="Provide a clear, legally justifiable reason for this data access request..."
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              className="w-full p-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 dark:focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 dark:focus:border-indigo-400 outline-none transition-all text-sm font-bold dark:text-white"
            />
          </div>

          <div className="p-6 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-4 transition-colors">
             <Info className="text-indigo-500 dark:text-indigo-400 shrink-0" size={20} />
             <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200 leading-relaxed uppercase tracking-wider">
               Identity requests are broadcasted to the user's sovereign node. Approval is not guaranteed and depends on user authorization.
             </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-10 flex justify-end border-t dark:border-slate-800 transition-colors">
           <button 
            type="submit"
            disabled={submitted || attributes.length === 0}
            className="px-12 py-5 bg-slate-900 dark:bg-indigo-600 text-white font-black uppercase text-xs tracking-[0.3em] rounded-2xl shadow-xl shadow-slate-200 dark:shadow-none hover:bg-black dark:hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:grayscale flex items-center gap-3"
           >
             {submitted ? <CheckCircle size={18} /> : <Send size={18} />}
             {submitted ? 'Request Published' : 'Broadcast Request'}
           </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyRequestForm;
