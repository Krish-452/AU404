
import React, { useState } from 'react';
// @ts-ignore
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.tsx';
// Added Lock to the imports from lucide-react to fix JSX errors
import { Shield, User, Building2, CheckCircle, ArrowRight, Loader2, Landmark, Eye, EyeOff, XCircle, CheckCircle2, Sun, Moon, Briefcase, FileText, Hash, Lock } from 'lucide-react';
import { UserRole } from '../../types.ts';
import api from '../../services/api.ts';

const SignUp: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [role, setRole] = useState<UserRole>(UserRole.CITIZEN);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // New Company Specific Fields
  const [pan, setPan] = useState('');
  const [gstin, setGstin] = useState('');
  const [cin, setCin] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Validation regex for Indian regulatory IDs
  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const cinRegex = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

  // Password validation rules
  const validations = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9!@#$%^&*]/.test(password),
    match: password === confirmPassword && confirmPassword !== ''
  };

  const isCompanyValid = role === UserRole.COMPANY
    ? (pan.length === 10 && panRegex.test(pan.toUpperCase()) &&
      gstin.length === 15 && gstinRegex.test(gstin.toUpperCase()) &&
      cin.length === 21 && cinRegex.test(cin.toUpperCase()))
    : true;

  const isFormValid =
    email !== '' &&
    name !== '' &&
    validations.minLength &&
    validations.hasUpper &&
    validations.hasLower &&
    validations.hasNumber &&
    validations.match &&
    isCompanyValid;



  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setError('Please ensure all security and regulatory requirements are met.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role,
        ...(role === UserRole.COMPANY && { domain: 'pending-verification' })
      };

      await api.post('/auth/register', payload);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Registration failed', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] dark:bg-slate-950 p-6 transition-colors duration-300">
        <div className="max-w-md w-full text-center space-y-10 animate-in fade-in zoom-in duration-500">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-[2rem] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 shadow-xl shadow-emerald-100/50 dark:shadow-none transition-colors">
            <CheckCircle size={48} />
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
              {role === UserRole.COMPANY ? 'Application Filed' : 'Identity Created'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed uppercase text-[10px] tracking-widest">
              {role === UserRole.COMPANY
                ? 'Your request for a Provider License has been broadcast to the Infrastructure Admins. You will be notified via secure shard once verified.'
                : 'Your sovereign identity node is ready. You can now access your personal vault using your secure phrase and MFA.'}
            </p>
          </div>

          <div className="pt-8">
            <Link
              to="/login"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#0f172a] dark:bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-black dark:hover:bg-indigo-700 transition-all active:scale-95"
            >
              Return to Gateway
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc] dark:bg-slate-950 transition-colors duration-300">
      {/* Header matching Landing Page */}
      <div className="h-10 bg-[#0f172a] dark:bg-black w-full flex items-center justify-between px-6 shrink-0 border-b dark:border-slate-800 transition-colors">
        <span className="text-[10px] font-black text-white uppercase tracking-widest">Identity Enrollment Gateway</span>
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

      <div className="flex-1 flex items-center justify-center p-6 py-12 overflow-y-auto">
        <div className="max-w-xl w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-[1.5rem] bg-[#0f172a] dark:bg-black text-white mb-8 shadow-2xl">
              <Landmark size={40} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Registry Enrollment</h1>
            <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">Secured by TRUSTID Protocol</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
            <div className="p-10 md:p-14 space-y-10">
              <form onSubmit={handleSignUp} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5">Enrollment Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole(UserRole.CITIZEN)}
                      className={`flex items-center gap-5 p-6 rounded-[1.5rem] border-2 transition-all ${role === UserRole.CITIZEN
                        ? 'border-[#0f172a] dark:border-indigo-600 bg-[#0f172a] dark:bg-indigo-600 text-white shadow-xl'
                        : 'border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-700'
                        }`}
                    >
                      <User size={24} />
                      <div className="text-left">
                        <p className="text-xs font-black uppercase tracking-widest">Citizen</p>
                        <p className="text-[9px] opacity-60 font-black uppercase tracking-widest">Personal</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole(UserRole.COMPANY)}
                      className={`flex items-center gap-5 p-6 rounded-[1.5rem] border-2 transition-all ${role === UserRole.COMPANY
                        ? 'border-[#0f172a] dark:border-indigo-600 bg-[#0f172a] dark:bg-indigo-600 text-white shadow-xl'
                        : 'border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-700'
                        }`}
                    >
                      <Building2 size={24} />
                      <div className="text-left">
                        <p className="text-xs font-black uppercase tracking-widest">Provider</p>
                        <p className="text-[9px] opacity-60 font-black uppercase tracking-widest">Registry</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-[#0f172a] dark:focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-900 text-sm font-bold dark:text-white outline-none transition-all pl-14"
                      placeholder={role === UserRole.COMPANY ? "Organization Legal Name" : "Full Legal Name"}
                    />
                    <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-[#0f172a] dark:focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-900 text-sm font-bold dark:text-white outline-none transition-all pl-14"
                      placeholder="Secure Email / Identifier"
                    />
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>

                  {/* Company Specific Regulatory Fields */}
                  {role === UserRole.COMPANY && (
                    <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={10}
                          value={pan}
                          onChange={(e) => setPan(e.target.value.toUpperCase())}
                          className="block w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-[#0f172a] dark:focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-900 text-sm font-bold dark:text-white outline-none transition-all pl-14 uppercase"
                          placeholder="Company PAN Card (10 Digits)"
                        />
                        <FileText className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={15}
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value.toUpperCase())}
                          className="block w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-[#0f172a] dark:focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-900 text-sm font-bold dark:text-white outline-none transition-all pl-14 uppercase"
                          placeholder="GSTIN (15 Digits)"
                        />
                        <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={21}
                          value={cin}
                          onChange={(e) => setCin(e.target.value.toUpperCase())}
                          className="block w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-[#0f172a] dark:focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-900 text-sm font-bold dark:text-white outline-none transition-all pl-14 uppercase"
                          placeholder="CIN (21 Digits)"
                        />
                        <Shield className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-[#0f172a] dark:focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-900 text-sm font-bold dark:text-white outline-none transition-all pl-14"
                      placeholder="Establish Secure Phrase"
                    />
                    {/* Fixed: Now correctly uses the imported Lock icon from lucide-react */}
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-[#0f172a] dark:focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-900 text-sm font-bold dark:text-white outline-none transition-all pl-14"
                      placeholder="Re-enter Secure Phrase"
                    />
                    {/* Fixed: Now correctly uses the imported Lock icon from lucide-react */}
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>

                  {/* Password Requirements UI */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-6 py-6 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 transition-colors">
                    <Requirement met={validations.minLength} label="8+ Characters" />
                    <Requirement met={validations.hasUpper} label="Uppercase" />
                    <Requirement met={validations.hasLower} label="Lowercase" />
                    <Requirement met={validations.hasNumber} label="Special/Num" />
                    <div className="col-span-2 pt-4 border-t border-slate-100 dark:border-slate-700 mt-2">
                      <Requirement met={validations.match} label="Phrases Match" />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 text-rose-500 bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-900/50 animate-in fade-in slide-in-from-top-1">
                      <XCircle size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className="w-full py-5 px-6 rounded-2xl text-white bg-[#ff9f43] hover:bg-[#f39c12] font-black uppercase text-xs tracking-[0.3em] shadow-xl shadow-orange-100 dark:shadow-none transition-all active:scale-95 disabled:opacity-40 disabled:grayscale"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : (role === UserRole.COMPANY ? 'Request Provider License' : 'Establish Shard')}
                </button>
              </form>

              <div className="text-center pt-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Already have a shard? <Link to="/login" className="text-[#0f172a] dark:text-white hover:underline">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Requirement = ({ met, label }: { met: boolean; label: string }) => (
  <div className={`flex items-center gap-3 transition-colors ${met ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500'}`}>
    {met ? <CheckCircle2 size={16} /> : <div className="h-4 w-4 rounded-full border-2 border-slate-200 dark:border-slate-700" />}
    <span className="text-[10px] font-black uppercase tracking-[0.1em]">{label}</span>
  </div>
);

export default SignUp;
