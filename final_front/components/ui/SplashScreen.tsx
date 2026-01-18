
import React, { useEffect, useState } from 'react';
import { Landmark, Shield } from 'lucide-react';

const SplashScreen: React.FC = () => {
  const [glitchText, setGlitchText] = useState('01011101');
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    const interval = setInterval(() => {
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setGlitchText(result);
    }, 80);

    const timer = setTimeout(() => {
      setReveal(true);
      clearInterval(interval);
    }, 1200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[10000] bg-[#020617] flex flex-col items-center justify-center overflow-hidden">
      {/* Moving Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)',
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="relative z-10 text-center space-y-8">
        <div className={`transition-all duration-1000 transform ${reveal ? 'scale-110 opacity-100' : 'scale-90 opacity-0'}`}>
          <div className="relative inline-block">
            <div className="h-24 w-24 bg-white dark:bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.4)]">
              <Landmark size={48} className="text-[#020617] dark:text-white" />
            </div>
            {/* Pulsing Shield behind */}
            <div className="absolute inset-0 -z-10 animate-ping opacity-20">
               <div className="h-24 w-24 bg-indigo-500 rounded-[1.5rem]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <div className="relative overflow-hidden px-4 py-2">
            {!reveal ? (
              <h1 className="text-5xl font-mono font-black text-indigo-400 tracking-[0.2em] animate-pulse">
                {glitchText}
              </h1>
            ) : (
              <h1 className="text-7xl font-black text-white tracking-tighter uppercase animate-in slide-in-from-bottom-4 duration-1000">
                IDTrust
              </h1>
            )}
            
            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500 shadow-[0_0_15px_#6366f1] animate-scan pointer-events-none" />
          </div>

          <div className={`flex items-center gap-3 transition-opacity duration-1000 ${reveal ? 'opacity-40' : 'opacity-0'}`}>
             <Shield size={12} className="text-indigo-400" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Sovereign Node Protocol</p>
          </div>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-indigo-500/20 rounded-tl-3xl" />
      <div className="absolute top-10 right-10 w-20 h-20 border-r-2 border-t-2 border-indigo-500/20 rounded-tr-3xl" />
      <div className="absolute bottom-10 left-10 w-20 h-20 border-l-2 border-b-2 border-indigo-500/20 rounded-bl-3xl" />
      <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-indigo-500/20 rounded-br-3xl" />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: -10%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}} />
    </div>
  );
};

export default SplashScreen;
