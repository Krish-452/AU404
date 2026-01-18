import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { LogOut, Shield, Building2, User as UserIcon } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-600 rounded-lg p-1.5">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">Identity Hub</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-800/50 px-3 py-1.5 rounded-full border border-zinc-700">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span>{user?.email}</span>
                                <span className="px-1.5 py-0.5 rounded bg-zinc-700 text-xs font-semibold uppercase">{user?.role}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Stats / Overview Cards */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h3 className="text-zinc-400 text-sm font-medium mb-2">Account Security</h3>
                        <div className="text-2xl font-bold text-white flex items-center gap-2">
                            <Shield className="w-6 h-6 text-green-500" />
                            <span>Protected</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">MFA Enabled & Active</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h3 className="text-zinc-400 text-sm font-medium mb-2">Identity Score</h3>
                        <div className="text-2xl font-bold text-white">98/100</div>
                        <p className="text-xs text-zinc-500 mt-2">Sovereign identity verified</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h3 className="text-zinc-400 text-sm font-medium mb-2">Active Sessions</h3>
                        <div className="text-2xl font-bold text-white">1</div>
                        <p className="text-xs text-zinc-500 mt-2">Current session secure</p>
                    </div>
                </div>

                {user?.role === 'citizen' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <UserIcon className="w-5 h-5 text-indigo-500" />
                            Citizen Data Vault
                        </h2>
                        <p className="text-zinc-400">Manage your personal data shards and consent requests here.</p>
                        {/* Add data shard list here */}
                        <div className="mt-6 border border-zinc-800 rounded-lg p-12 text-center text-zinc-600">
                            No active consent requests.
                        </div>
                    </div>
                )}

                {user?.role === 'company' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-indigo-500" />
                            Company Portal
                        </h2>
                        <p className="text-zinc-400">Request access to citizen data and manage active agreements.</p>
                        <div className="mt-6 border border-zinc-800 rounded-lg p-12 text-center text-zinc-600">
                            Start a new data access request.
                        </div>
                    </div>
                )}

                {user?.role === 'admin' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4">Admin Console</h2>
                        <p className="text-zinc-400">System oversight and audit logs.</p>
                        <div className="mt-6 border border-zinc-800 rounded-lg p-12 text-center text-zinc-600">
                            View Audit Logs
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
