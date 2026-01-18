import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import OTPModal from '../components/OTPModal.tsx';
import { Lock } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isOtpOpen, setIsOtpOpen] = useState(false);
    const [tempToken, setTempToken] = useState('');

    const { login, verifyOtp } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const result = await login(email, password);
            if (result.mfaRequired && result.tempToken) {
                setTempToken(result.tempToken);
                setIsOtpOpen(true);
            } else {
                // Direct login (if backend allowed it)
                navigate('/');
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Login failed');
        }
    };

    const handleOtpVerify = async (otp: string) => {
        try {
            await verifyOtp(tempToken, otp);
            setIsOtpOpen(false);
            navigate('/');
        } catch (err) {
            throw err; // Modal handles component error state
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/30">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Identity Hub</h2>
                    <p className="mt-2 text-zinc-400">Secure Sovereign Identity Platform</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-zinc-800 focus:border-indigo-500 rounded-lg px-4 py-3 outline-none transition-all"
                                placeholder="citizen@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-zinc-800 focus:border-indigo-500 rounded-lg px-4 py-3 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-indigo-900/20"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>

            <OTPModal
                isOpen={isOtpOpen}
                onClose={() => setIsOtpOpen(false)}
                onVerify={handleOtpVerify}
                title="Two-Factor Authentication"
                description="Enter the code from your authenticator app to complete login."
            />
        </div>
    );
};

export default LoginPage;
