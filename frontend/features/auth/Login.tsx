
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';
import { Shield, Lock, ChevronRight, Fingerprint, RefreshCcw, Loader2, Landmark, Sun, Moon } from 'lucide-react';

const Login: React.FC = () => {
  const { login, verifyMfa } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('citizen@idtrust.gov');
  const [role, setRole] = useState<UserRole>(UserRole.CITIZEN);
  const [step, setStep] = useState(1);
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setStep(2);
      setLoading(false);
      setTimer(30);
    }, 1200);
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const valid = await verifyMfa(mfaCode);
    if (valid) {
      setIsDecrypting(true);
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            login(email, role);
            return 100;
          }
          return p + 5;
        });
      }, 80);
    } else {
      setError('Invalid verification code');
      setLoading(false);
    }
  };

  if (isDecrypting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4 transition-colors duration-500">
        <div className="max-w-md w-full text-center">
          <div className="mb-12">
             <Loader2 size={64} className="mx-auto text-orange-400 animate-spin" />
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">Decrypting Shard...</h2>
          <p className="text-slate-400 font-bold mb-12 uppercase text-xs tracking-widest">Connecting to Sovereign Node-Alpha-X</p>
          
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-orange-400" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc] dark:bg-slate-950 transition-colors duration-300">
      {/* Top Banner Stripe */}
      <div className="h-10 bg-[#0f172a] dark:bg-black w-full flex items-center justify-between px-6 shrink-0 border-b dark:border-slate-800">
        <span className="text-[10px] font-black text-white uppercase tracking-widest">National Identity Gateway</span>
        <div className="flex items-center gap-6">
           <button onClick={toggleTheme} className="text-white hover:text-orange-400 transition-colors">
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
           </button>
           <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-orange-400"></span>
              <span className="h-3 w-3 rounded-full bg-white"></span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
            {step === 1 ? (
              <div className="p-10 md:p-14">
                 <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-[1.5rem] bg-[#0f172a] dark:bg-black text-white mb-8 shadow-xl">
                    <Landmark size={40} />
                  </div>
                  <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Identity Hub</h1>
                  <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">Sign in to your sovereign node</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Portal Context</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[UserRole.CITIZEN, UserRole.COMPANY, UserRole.ADMIN].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`py-4 px-1 text-[9px] font-black uppercase tracking-widest rounded-xl border-2 transition-all ${
                            role === r 
                            ? 'border-[#0f172a] dark:border-indigo-600 bg-[#0f172a] dark:bg-indigo-600 text-white shadow-lg' 
                            : 'border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0f172a] dark:focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-900 text-sm font-bold dark:text-white outline-none transition-all"
                      placeholder="Identifier / DID"
                    />
                    <input
                      type="password"
                      required
                      defaultValue="password123"
                      className="block w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0f172a] dark:focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-900 text-sm font-bold dark:text-white outline-none transition-all"
                      placeholder="Secure Phrase"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-5 px-6 rounded-2xl text-white bg-[#0f172a] dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all disabled:opacity-50 active:scale-95"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Access Shard'}
                  </button>
                </form>

                <div className="text-center pt-10 mt-6 border-t border-slate-50 dark:border-slate-800 transition-colors">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    New to IDTrust? <Link to="/signup" className="text-orange-500 hover:underline">Enroll Now</Link>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="p-10 md:p-14 text-center border-b border-slate-100 dark:border-slate-800">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-[#0f172a] dark:bg-black text-white mb-8 shadow-xl">
                    <Fingerprint size={40} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Verification</h3>
                  <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">Multi-factor sequence required</p>
                </div>

                <form onSubmit={handleMfaSubmit} className="p-10 md:p-14 space-y-10">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Enter 6-digit Code</label>
                    <input
                      type="text"
                      required
                      autoFocus
                      maxLength={6}
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      className="mfa-input-box block w-full text-center py-8 rounded-2xl text-4xl font-black outline-none border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 transition-all tracking-[0.4em]"
                      placeholder="000000"
                    />
                  </div>

                  {error && <p className="text-[10px] text-red-500 text-center font-black uppercase tracking-widest">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 px-6 rounded-2xl text-white bg-[#ff9f43] hover:bg-[#f39c12] font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-orange-100 dark:shadow-none transition-all active:scale-95"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Verify and Decrypt'}
                  </button>

                  <div className="text-center">
                     <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Standard Demo Code: 123456</span>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
