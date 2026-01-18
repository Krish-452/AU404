
import React, { useState, useEffect } from 'react';
// @ts-ignore
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { Shield, Lock, ChevronRight, Fingerprint, RefreshCcw, Loader2, Landmark, Sun, Moon, User, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const { login, verifyMfa } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('citizen@idtrust.gov');
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

  const [password, setPassword] = useState('password123');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      setStep(2);
      setTimer(30);
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
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
            login(email);
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
          <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">Identifying Clearance...</h2>
          <p className="text-slate-400 font-bold mb-12 uppercase text-xs tracking-widest">Checking node permissions for {email}</p>

          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-orange-400" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc] dark:bg-slate-950 transition-colors duration-300">
      <div className="h-10 bg-[#0f172a] dark:bg-black w-full flex items-center justify-between px-6 shrink-0 border-b dark:border-slate-800">
        <span className="text-[10px] font-black text-white uppercase tracking-widest">National Identity Gateway</span>
        <div className="flex items-center gap-6">
          <button onClick={toggleTheme} className="text-white hover:text-orange-400 transition-colors">
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="max-w-[460px] w-full animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center h-24 w-24 rounded-[2rem] bg-[#0f172a] dark:bg-black text-white mb-10 shadow-2xl">
              <Landmark size={48} />
            </div>
            <h1 className="text-5xl font-black text-[#0f172a] dark:text-white tracking-tighter uppercase mb-4">Identity Hub</h1>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Sign in to your sovereign node
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
            {step === 1 ? (
              <div className="p-10 md:p-14">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                        <User size={20} />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-[#0f172a] dark:focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-900 text-sm font-bold dark:text-white outline-none transition-all pl-14"
                        placeholder="Identifier / DID"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                        <Lock size={20} />
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-[#0f172a] dark:focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-900 text-sm font-bold dark:text-white outline-none transition-all pl-14"
                        placeholder="Secure Phrase"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-6 px-6 rounded-2xl text-white bg-[#0f172a] dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 font-black uppercase text-[12px] tracking-[0.2em] shadow-xl transition-all disabled:opacity-50 active:scale-95"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                      <>
                        Access Shard <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="p-10 md:p-14 text-center border-b border-slate-100 dark:border-slate-800">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-[#0f172a] dark:bg-black text-white mb-8 shadow-xl">
                    <Fingerprint size={40} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">MFA Challenge</h3>
                  <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">Awaiting cryptographic proof</p>
                </div>

                <form onSubmit={handleMfaSubmit} className="p-10 md:p-14 space-y-10">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 text-center">Enter 6-digit Code</label>
                    <input
                      type="text"
                      required
                      autoFocus
                      maxLength={6}
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      className="mfa-input-box block w-full text-center py-8 rounded-2xl text-4xl font-black outline-none border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 dark:text-white focus:border-indigo-500 transition-all tracking-[0.4em]"
                      placeholder="000000"
                    />
                  </div>

                  {error && <p className="text-[10px] text-red-500 text-center font-black uppercase tracking-widest">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 px-6 rounded-2xl text-white bg-[#ff9f43] hover:bg-orange-600 font-black uppercase text-xs tracking-[0.3em] shadow-2xl transition-all active:scale-95"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Decrypt & Access'}
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link to="/signup" className="text-[11px] font-black text-slate-400 hover:text-slate-900 dark:hover:text-white uppercase tracking-[0.4em] transition-colors">
              New Identity? Enroll in Node
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
