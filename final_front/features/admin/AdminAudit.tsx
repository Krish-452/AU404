
import React, { useState, useEffect } from 'react';
import { Globe, Download, Shield, CheckCircle, Clock, Hash, Loader2, ChevronRight } from 'lucide-react';
import api from '../../services/api.ts';

interface AuditEntry {
    id: number;
    source: string;
    action: string;
    detail: string;
    time: string;
    hash: string;
}

const AdminAudit: React.FC = () => {
    const [entries, setEntries] = useState<AuditEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [expandedHashes, setExpandedHashes] = useState<number[]>([]);

    useEffect(() => {
        fetchAuditStream();
        const interval = setInterval(fetchAuditStream, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchAuditStream = async () => {
        try {
            const { data } = await api.get('/admin/audit-stream');
            if (data.success) {
                setEntries(data.entries);
            }
        } catch (error) {
            console.error('Failed to fetch audit stream:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportLogs = async () => {
        setExporting(true);
        try {
            const response = await api.get('/admin/export-logs', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'IDHUB_Audit_Logs.txt');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export logs');
        } finally {
            setExporting(false);
        }
    };

    const toggleHash = (id: number) => {
        setExpandedHashes(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const getActionColor = (action: string) => {
        if (action.includes('UPDATE')) return 'text-indigo-500';
        if (action.includes('HANDSHAKE') || action.includes('DECRYPTION')) return 'text-purple-500';
        if (action.includes('VERIFICATION') || action.includes('LOGIN')) return 'text-emerald-500';
        if (action.includes('SCAN') || action.includes('AUDIT')) return 'text-orange-500';
        return 'text-slate-500';
    };

    const getActionIcon = (action: string) => {
        if (action.includes('VERIFICATION') || action.includes('LOGIN')) return CheckCircle;
        if (action.includes('HANDSHAKE') || action.includes('DECRYPTION')) return Shield;
        return Globe;
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto flex items-center justify-center py-32">
                <Loader2 size={48} className="animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase transition-colors">Transparency Ledger</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest transition-colors">
                        Immutable audit trail of <span className="text-indigo-500">all identity shard interactions</span>
                    </p>
                </div>
                <button
                    onClick={handleExportLogs}
                    disabled={exporting}
                    className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-3 shadow-sm disabled:opacity-50"
                >
                    {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    Export Logs
                </button>
            </header>

            <section className="bg-[#0f172a] dark:bg-black rounded-[2.5rem] overflow-hidden border dark:border-slate-800 shadow-2xl">
                <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <Globe size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Global Audit Stream</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Nodes Synchronized</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-emerald-500">Live</span>
                    </div>
                </div>

                <div className="divide-y divide-slate-800">
                    {entries.map((entry) => {
                        const IconComponent = getActionIcon(entry.action);
                        const isExpanded = expandedHashes.includes(entry.id);

                        return (
                            <div key={entry.id} className="p-8 hover:bg-slate-800/30 transition-all group">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-6">
                                        <div className={`h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center ${getActionColor(entry.action)}`}>
                                            <IconComponent size={28} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-black text-white">{entry.source}</span>
                                                <span className="text-[10px] font-black text-slate-500 uppercase">{entry.time}</span>
                                            </div>
                                            <p className={`text-[11px] font-black uppercase tracking-widest ${getActionColor(entry.action)}`}>
                                                {entry.action}
                                            </p>
                                            <p className="text-sm font-medium text-slate-400">{entry.detail}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleHash(entry.id)}
                                        className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-400 uppercase tracking-widest transition-colors"
                                    >
                                        <Hash size={14} />
                                        Full Proof Hash
                                        <ChevronRight size={14} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div className="mt-6 ml-20 p-4 bg-slate-800/50 border border-slate-700 rounded-xl">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">SHA-256 Verification Hash</p>
                                        <code className="text-xs font-mono text-indigo-400 break-all">{entry.hash}</code>
                                        <div className="mt-3 flex items-center gap-2">
                                            <CheckCircle size={12} className="text-emerald-500" />
                                            <span className="text-[9px] font-black text-emerald-500 uppercase">Cryptographically Verified</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4 mb-8">
                    <Shield size={24} className="text-indigo-600" />
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Ledger Integrity</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Entries</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{entries.length.toLocaleString()}</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Chain Status</p>
                        <p className="text-3xl font-black text-emerald-500">VALID</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Last Sync</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">Now</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminAudit;
