
import React, { useState } from 'react';
import { Shield, Heart, Sprout, Building, ChevronRight, Lock, Key, AlertCircle } from 'lucide-react';

const ExamplePortals: React.FC = () => {
  const [activePortal, setActivePortal] = useState<'health' | 'agri' | 'city' | null>(null);

  const portals = [
    { id: 'health', icon: Heart, name: 'MedLink Health', color: 'rose', desc: 'Secure medical record exchange for specialized hospitals.' },
    { id: 'agri', icon: Sprout, name: 'Farmer Connect', color: 'emerald', desc: 'Verified identity for agricultural subsidies and land audits.' },
    { id: 'city', icon: Building, name: 'Urban Resident Portal', color: 'blue', desc: 'Citizen services for modern smart city governance.' }
  ];

  if (activePortal) {
    const p = portals.find(x => x.id === activePortal)!;
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12 animate-in slide-in-from-right-4 duration-500">
        <button onClick={() => setActivePortal(null)} className="mb-12 text-sm font-bold text-slate-400 hover:text-slate-900 flex items-center gap-2 transition-colors">
          <ChevronRight size={16} className="rotate-180" /> Back to Ecosystem
        </button>

        <div className="max-w-4xl mx-auto">
          <div className={`p-1 bg-${p.color}-500 rounded-[3rem] shadow-2xl shadow-${p.color}-100`}>
             <div className="bg-white rounded-[2.9rem] p-12">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12 text-center md:text-left">
                   <div className={`h-24 w-24 rounded-[2rem] bg-${p.color}-50 text-${p.color}-600 flex items-center justify-center shadow-inner`}>
                      <p.icon size={48} />
                   </div>
                   <div>
                      <h2 className="text-4xl font-black text-slate-900 mb-2">{p.name}</h2>
                      <p className="text-slate-500 font-medium text-lg italic">"{p.desc}"</p>
                   </div>
                </div>

                <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-100 text-center">
                   <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <Lock size={32} className="text-indigo-600" />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-900 mb-4">Identity Handshake Required</h3>
                   <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto leading-relaxed">
                     To continue, this service needs to verify your identity through the <span className="text-indigo-600 font-black">IDTrust Secure Handshake</span>.
                   </p>

                   <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                         <Key size={20} />
                         Authorize via IDTrust
                      </button>
                      <button className="px-10 py-4 bg-white border border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-50 transition-all">
                         Manual Registration
                      </button>
                   </div>

                   <div className="mt-12 flex items-center justify-center gap-3 py-4 border-t border-slate-200/50">
                      <AlertCircle className="text-slate-400" size={16} />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Powered by IDTrust Zero-Knowledge Protocol v2.4</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Example Partner Ecosystem</h1>
          <p className="text-slate-500 font-medium text-lg">See how IDTrust enables seamless identity verification across different sectors.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portals.map(p => (
            <div 
              key={p.id} 
              onClick={() => setActivePortal(p.id as any)}
              className="group cursor-pointer bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-50 transition-all hover:-translate-y-1"
            >
              <div className={`h-16 w-16 rounded-2xl bg-${p.color}-50 text-${p.color}-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <p.icon size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{p.name}</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-10">{p.desc}</p>
              <div className={`inline-flex items-center gap-2 font-black text-sm text-${p.color}-600`}>
                Launch Application <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamplePortals;
