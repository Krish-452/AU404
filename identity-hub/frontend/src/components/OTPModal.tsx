import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface OTPModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (otp: string) => Promise<void>;
    title?: string;
    description?: string;
}

const OTPModal: React.FC<OTPModalProps> = ({
    isOpen,
    onClose,
    onVerify,
    title = "Security Verification",
    description = "Please enter the implementation code from your authenticator app."
}) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 6) {
            setError('Code must be 6 digits');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await onVerify(otp);
            // Don't close here, allow parent to decide or close on success
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <ShieldCheck className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-zinc-400 text-sm mb-6">{description}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Authentication Code</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="w-full bg-black/50 border border-zinc-800 focus:border-indigo-500 rounded-lg px-4 py-3 text-white placeholder-zinc-700 outline-none text-center text-2xl tracking-[0.5em] font-mono transition-all"
                            placeholder="000000"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-lg shadow-indigo-900/20"
                        >
                            {loading ? 'Verifying...' : 'Verify Identity'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OTPModal;
