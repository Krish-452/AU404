
import React, { useState } from 'react';
import { FileText, Send, CheckCircle, Clock, ShieldCheck, Database, Search } from 'lucide-react';
import { RequestStatus } from '../../types';

const CompanyDashboard: React.FC = () => {
  const [citizenId, setCitizenId] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [purpose, setPurpose] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const attributes = [
    { id: 'full_name', label: 'Full Legal Name' },
    { id: 'dob', label: 'Date of Birth' },
    { id: 'medical_history', label: 'Medical Records' },
    { id: 'farm_id', label: 'Agricultural ID' },
    { id: 'land_parcel', label: 'Land Registry' }
  ];

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const toggleAttribute = (id: string) => {
    setSelectedAttributes(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20 transition-colors duration-300">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Provider Access Console</h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest">Request identity attributes via Zero-Knowledge protocols.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 dark:bg-slate-800 px-5 py-3 rounded-xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg">
          <ShieldCheck size={16} className="text-emerald-400" />
          Certified Partner
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleRequest} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none overflow-hidden transition-colors duration-300">
            <div className="p-10 md:p-14 space-y-10">
              <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400">
                <FileText size={28} />
                <h2 className="text-2xl font-black uppercase tracking-tight">New Access Request</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Citizen Identifier (DID/Email)</label>
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text"
                      required
                      value={citizenId}
                      onChange={(e) => setCitizenId(e.target.value)}
                      placeholder="citizen@idtrust.gov"
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm font-bold dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Specific Attributes Needed</label>
                  <div className="flex flex-wrap gap-2">
                    {attributes.map(attr => (
                      <button
                        key={attr.id}
                        type="button"
                        onClick={() => toggleAttribute(attr.id)}
                        className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          selectedAttributes.includes(attr.id)
                          ? 'bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-600 shadow-md'
                          : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700 hover:border-indigo-600'
                        }`}
                      >
                        {attr.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Purpose for Data Access</label>
                  <textarea 
                    rows={4}
                    required
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Describe how this data will be used to provide the service..."
                    className="w-full p-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm font-bold dark:text-white outline-none"
                  />
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 transition-colors">
                  <p className="text-xs text-indigo-800 dark:text-indigo-400 font-bold leading-relaxed uppercase tracking-wider">
                    Identity requests are time-bound by default (standard 30-day session). Citizens may revoke access at any time via their vault dashboard.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-10 flex justify-end transition-colors">
              <button 
                type="submit"
                disabled={submitted || selectedAttributes.length === 0}
                className="flex items-center gap-3 px-10 py-4 bg-slate-900 dark:bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl hover:bg-black dark:hover:bg-indigo-700 transition-all disabled:opacity-50 active:scale-95"
              >
                {submitted ? <CheckCircle size={18} /> : <Send size={18} />}
                {submitted ? 'Request Published' : 'Broadcast Request'}
              </button>
            </div>
          </form>
        </div>

        {/* Stats/History */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
             <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8">Request Status</h3>
             <div className="space-y-4">
                {[
                  { name: 'Alice Smith', status: 'Approved', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                  { name: 'Bob Johnson', status: 'Pending', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
                  { name: 'Carol White', status: 'Expired', color: 'text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-black text-[10px]">
                        {item.name[0]}
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${item.bg} ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-indigo-900 dark:bg-black rounded-[2.5rem] p-10 text-white text-center shadow-2xl transition-colors">
            <div className="h-16 w-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center mx-auto mb-8">
               <Database className="text-indigo-300" size={32} />
            </div>
            <h4 className="text-xl font-black mb-2 uppercase tracking-tight">API Handshake</h4>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-8">Integrate IDTrust verification directly into your workflow.</p>
            <button className="w-full py-5 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/5">Generate Access Key</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
