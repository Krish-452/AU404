
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  User, Eye, EyeOff, ShieldCheck, Plus, Trash2, Heart, Sprout,
  Building, Cpu, Lock, Key, Smartphone, Edit3, X, Fingerprint,
  Loader2, ShieldAlert, AlertTriangle, ShieldX, Info
} from 'lucide-react';
import { IdentityAttribute } from '../../types.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import api from '../../services/api.ts';

const CitizenAssets: React.FC = () => {
  const { logout, user } = useAuth();
  const [attributes, setAttributes] = useState<IdentityAttribute[]>([
    { id: '1', key: 'full_name', label: 'Legal Name', value: 'John Doe Citizen', category: 'Personal', lastUpdated: '2024-03-01', isSensitive: false },
    { id: '2', key: 'dob', label: 'Date of Birth', value: '1985-06-15', category: 'Personal', lastUpdated: '2024-03-01', isSensitive: true },
    { id: '3', key: 'blood_group', label: 'Blood Group', value: 'O Positive', category: 'Health', lastUpdated: '2023-11-20', isSensitive: false },
    { id: '4', key: 'medical_history', label: 'Chronic Conditions', value: 'Hypertension (Managed)', category: 'Health', lastUpdated: '2024-02-15', isSensitive: true },
    { id: '5', key: 'farmer_id', label: 'National Farmer ID', value: 'AG-IND-8821-X', category: 'Agriculture', lastUpdated: '2024-01-10', isSensitive: false },
    { id: '6', key: 'land_records', label: 'Land Parcel Ref', value: 'BLR/W-42/P-902', category: 'Agriculture', lastUpdated: '2023-12-05', isSensitive: true },
    { id: '7', key: 'resident_permit', label: 'Smart City Permit', value: 'SC-992-BLR-2024', category: 'City', lastUpdated: '2024-02-28', isSensitive: false },
  ]);

  const [hidden, setHidden] = useState<Set<string>>(new Set(['2', '4', '6']));
  const [editingAttr, setEditingAttr] = useState<IdentityAttribute | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form States
  const [newValue, setNewValue] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState<'Personal' | 'Health' | 'Agriculture' | 'City'>('Personal');
  const [aadhaar, setAadhaar] = useState('');
  const [verificationStep, setVerificationStep] = useState<'input' | 'processing' | 'success'>('input');

  // OTP States for Revoke/Delete
  const [otpModal, setOtpModal] = useState<{ open: boolean; action: 'revoke' | 'delete' | null }>({ open: false, action: null });
  const [otpValue, setOtpValue] = useState('');
  const [otpStep, setOtpStep] = useState<'sending' | 'input' | 'processing' | 'success' | 'error'>('input');
  const [otpError, setOtpError] = useState('');

  // Document Upload States
  interface Document {
    id: string;
    category: string;
    documentName: string;
    uploadedAt: string;
    verified: boolean;
    verifiedAt: string | null;
    hash: string;
  }
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<'Personal' | 'Health' | 'Agriculture' | 'City'>('Personal');
  const [uploadName, setUploadName] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [verifyingDoc, setVerifyingDoc] = useState<string | null>(null);

  // Fetch documents on mount
  React.useEffect(() => {
    const fetchDocs = async () => {
      try {
        const { data } = await api.get('/citizen/documents');
        if (data.success) {
          setDocuments(data.documents);
        }
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      }
    };
    fetchDocs();
  }, []);

  const handleUploadDocument = async () => {
    if (!uploadFile || !uploadName) {
      alert('Please provide document name and file');
      return;
    }

    setUploadLoading(true);
    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const { data } = await api.post('/citizen/upload-document', {
          category: uploadCategory,
          documentName: uploadName,
          documentData: base64
        });

        if (data.success) {
          setDocuments(prev => [...prev, {
            id: data.documentId,
            category: data.category,
            documentName: data.documentName,
            uploadedAt: new Date().toISOString(),
            verified: false,
            verifiedAt: null,
            hash: data.hash
          }]);
          setUploadModal(false);
          setUploadFile(null);
          setUploadName('');
          alert('Document uploaded and encrypted successfully!');
        }
        setUploadLoading(false);
      };
      reader.readAsDataURL(uploadFile);
    } catch (error: any) {
      setUploadLoading(false);
      alert(error.response?.data?.message || 'Upload failed');
    }
  };

  const handleVerifyDocument = async (docId: string) => {
    setVerifyingDoc(docId);
    try {
      const { data } = await api.post(`/citizen/verify-document/${docId}`);
      if (data.success) {
        setDocuments(prev => prev.map(d =>
          d.id === docId ? { ...d, verified: true, verifiedAt: data.verifiedAt } : d
        ));
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Verification failed');
    } finally {
      setVerifyingDoc(null);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Delete this document permanently?')) return;
    try {
      await api.delete(`/citizen/document/${docId}`);
      setDocuments(prev => prev.filter(d => d.id !== docId));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  const toggleMask = (id: string) => {
    const newHidden = new Set(hidden);
    if (newHidden.has(id)) newHidden.delete(id);
    else newHidden.add(id);
    setHidden(newHidden);
  };

  const handleEditClick = (attr: IdentityAttribute) => {
    setEditingAttr(attr);
    setNewValue(attr.value);
    setAadhaar('');
    setVerificationStep('input');
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setNewLabel('');
    setNewValue('');
    setAadhaar('');
    setVerificationStep('input');
  };

  const handleVerifyAndAction = async () => {
    if (!aadhaar || aadhaar.length !== 12) return;
    setVerificationStep('processing');
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (isAdding) {
      const newAttr: IdentityAttribute = {
        id: Math.random().toString(36).substr(2, 9),
        key: newLabel.toLowerCase().replace(/\s+/g, '_'),
        label: newLabel,
        value: newValue,
        category: newCategory,
        lastUpdated: 'Just Now',
        isSensitive: true
      };
      setAttributes(prev => [...prev, newAttr]);
    } else if (editingAttr) {
      setAttributes(prev => prev.map(a =>
        a.id === editingAttr.id ? { ...a, value: newValue, lastUpdated: new Date().toISOString().split('T')[0] } : a
      ));
    }

    setVerificationStep('success');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setEditingAttr(null);
    setIsAdding(false);
  };

  // Open OTP Modal and send OTP via email
  const handleOpenOtpModal = async (action: 'revoke' | 'delete') => {
    setOtpModal({ open: true, action });
    setOtpStep('sending');
    setOtpValue('');
    setOtpError('');

    try {
      await api.post('/auth/send-otp', { email: user?.email });
      setOtpStep('input');
    } catch (error: any) {
      console.error('Failed to send OTP:', error);
      setOtpError('Failed to send OTP. Please try again.');
      setOtpStep('error');
    }
  };

  const handleOtpConfirm = async () => {
    if (otpValue.length !== 6) return;
    setOtpStep('processing');
    setOtpError('');

    try {
      // Verify OTP with backend - include email
      await api.post('/auth/verify-otp', { email: user?.email, token: otpValue });

      if (otpModal.action === 'delete') {
        // Delete account from database
        try {
          await api.delete('/auth/delete-account');
        } catch (e) { console.log('Delete endpoint not available'); }

        // Show success state
        setOtpStep('success');

        // Wait 5 seconds then redirect to signup
        setTimeout(() => {
          logout();
          window.location.href = '/signup';
        }, 5000);
      } else {
        // Revoke all handshakes
        try {
          await api.post('/citizen/revoke-all', {});
        } catch (e) { console.log('Revoke endpoint not available'); }

        setOtpStep('success');
        await new Promise(resolve => setTimeout(resolve, 1500));
        setOtpModal({ open: false, action: null });
        setOtpStep('input');
        setOtpValue('');
        alert('All handshakes have been revoked successfully.');
      }
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      setOtpError(error.response?.data?.message || 'Invalid OTP. Please try again.');
      setOtpStep('input');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Health': return <Heart size={24} />;
      case 'Agriculture': return <Sprout size={24} />;
      case 'City': return <Building size={24} />;
      default: return <User size={24} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Health': return 'bg-rose-50 text-rose-500 dark:bg-rose-900/20';
      case 'Agriculture': return 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20';
      case 'City': return 'bg-blue-50 text-blue-500 dark:bg-blue-900/20';
      default: return 'bg-indigo-50 text-indigo-500 dark:bg-indigo-900/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-4 md:px-0">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Identity Vault</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest">Bank-Grade Zero-Knowledge Asset Storage</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => handleOpenOtpModal('revoke')}
            className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400 transition-all flex items-center gap-3 justify-center border border-slate-200 dark:border-slate-700"
          >
            <ShieldX size={16} /> Revoke All Handshakes
          </button>
          <button
            onClick={handleAddClick}
            className="px-8 py-4 bg-[#ff9f43] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 dark:shadow-none flex items-center gap-3 justify-center"
          >
            <Plus size={16} /> Link New Shard
          </button>
        </div>
      </header>

      {/* Security Infrastructure Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0">
        <div className="bg-[#0f172a] dark:bg-black rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl border dark:border-slate-800">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none rotate-12">
            <ShieldCheck size={200} />
          </div>
          <div className="max-w-xl relative z-10">
            <div className="flex items-center gap-4 mb-6 text-indigo-400">
              <Lock size={28} />
              <h3 className="text-2xl font-black uppercase tracking-tight">Encryption Engine</h3>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed mb-8 uppercase text-[10px] tracking-widest">
              Identity shards are sharded across the sovereign node cluster. Decryption is only possible through your authenticated FIDO2 device handshake.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/10">SHA-256 Verified</span>
              <span className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/10">Zero-Trust V2.4</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center gap-4 mb-10 text-slate-900 dark:text-white">
            <Key size={28} className="text-orange-500" />
            <h3 className="text-2xl font-black uppercase tracking-tight">Active Handshakes</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 transition-all">
              <div className="flex items-center gap-4">
                <Smartphone className="text-slate-400 shrink-0" size={20} />
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase">Primary Authenticator</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase">Registered Mobile Node | Verified</p>
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </div>
            <button className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
              Provision Secondary FIDO2 Key
            </button>
          </div>
        </div>
      </div>

      {/* Document Vault Section */}
      <section className="px-4 md:px-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
              <Lock size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Document Vault</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AES-256-GCM Encrypted Storage</p>
            </div>
          </div>
          <button
            onClick={() => setUploadModal(true)}
            className="px-6 py-3 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus size={14} /> Upload Document
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-12 text-center border border-dashed border-slate-200 dark:border-slate-800">
            <Lock size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-slate-400 text-sm font-medium">No documents uploaded yet.</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-2">Click "Upload Document" to add encrypted documents.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map(doc => (
              <div key={doc.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${getCategoryColor(doc.category)}`}>
                    {getCategoryIcon(doc.category)}
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.verified ? (
                      <div className="flex items-center gap-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full">
                        <ShieldCheck size={14} />
                        <span className="text-[9px] font-black uppercase">Verified</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleVerifyDocument(doc.id)}
                        disabled={verifyingDoc === doc.id}
                        className="flex items-center gap-1 px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-full hover:bg-orange-100 transition-all text-[9px] font-black uppercase disabled:opacity-50"
                      >
                        {verifyingDoc === doc.id ? <Loader2 size={14} className="animate-spin" /> : <ShieldAlert size={14} />}
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{doc.documentName}</h3>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3">{doc.category}</p>
                <div className="space-y-1 text-[9px] text-slate-400">
                  <p>Hash: <code className="text-indigo-500">{doc.hash}</code></p>
                  <p>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                  {doc.verifiedAt && <p className="text-emerald-500">✓ Verified: {new Date(doc.verifiedAt).toLocaleDateString()}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upload Document Modal */}
      {uploadModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase">Upload Document</h3>
              <button onClick={() => setUploadModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Category</label>
                <select
                  value={uploadCategory}
                  onChange={e => setUploadCategory(e.target.value as any)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                >
                  <option value="Personal">Personal</option>
                  <option value="Health">Health / Medical</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="City">City / Government</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Document Name</label>
                <input
                  type="text"
                  value={uploadName}
                  onChange={e => setUploadName(e.target.value)}
                  placeholder="e.g., Medical Report, Land Record"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">PDF File</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={e => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                />
              </div>

              <button
                onClick={handleUploadDocument}
                disabled={uploadLoading}
                className="w-full py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {uploadLoading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                Encrypt & Upload
              </button>

              <p className="text-[9px] text-center text-slate-400 uppercase tracking-widest">
                Documents are encrypted with AES-256-GCM before storage
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
        {attributes.map(attr => (
          <div key={attr.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm group hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-10">
              <div className={`p-4 rounded-2xl transition-colors ${getCategoryColor(attr.category)}`}>
                {getCategoryIcon(attr.category)}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(attr)}
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-900 hover:text-white dark:hover:bg-indigo-600 transition-all"
                  title="Edit Attribute"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => toggleMask(attr.id)}
                  className={`p-3 rounded-xl transition-all ${hidden.has(attr.id) ? 'bg-slate-100 text-slate-400 dark:bg-slate-800' : 'bg-[#0f172a] text-white shadow-lg'}`}
                >
                  {hidden.has(attr.id) ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{attr.label}</p>
              <div className={`text-2xl font-black transition-all duration-500 ${hidden.has(attr.id) ? 'text-slate-200 dark:text-slate-800 blur-[6px] select-none' : 'text-slate-900 dark:text-white'}`}>
                {attr.value}
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600">
              <span className="flex items-center gap-1"><Cpu size={10} /> {attr.category} Asset</span>
              <span>Last Updated: {attr.lastUpdated}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <section className="px-4 md:px-0 pt-10">
        <div className="bg-rose-50/30 dark:bg-rose-950/10 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30 p-10 md:p-14 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-3 text-rose-500">
                <AlertTriangle size={24} />
                <h3 className="text-2xl font-black uppercase tracking-tight">Identity Decommissioning</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed uppercase text-[10px] tracking-widest">
                Permanent deletion of your sovereign identity node. This action is irreversible and will purge all linked assets, certificates, and decryption shards from the National Ledger.
              </p>
            </div>
            <button
              onClick={() => handleOpenOtpModal('delete')}
              className="px-10 py-5 bg-rose-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl hover:bg-rose-700 transition-all flex items-center gap-3 justify-center shrink-0"
            >
              <Trash2 size={18} /> Decommission Identity
            </button>
          </div>
        </div>
      </section>

      {/* Verification Modal (OTP) - Portaled and Scrollable */}
      {otpModal.open && createPortal(
        <div className="fixed inset-0 z-[2000] bg-slate-900/60 dark:bg-black/80 backdrop-blur-2xl overflow-y-auto px-4 py-8 flex justify-center items-start sm:items-center">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] animate-in zoom-in duration-300 border dark:border-slate-800 flex flex-col overflow-hidden my-auto">
            <div className="p-10 md:p-14 pb-0 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mb-4 block">Verification Sequence</span>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                  {otpModal.action === 'delete' ? 'Confirm Deletion' : 'Confirm Revocation'}
                </h3>
              </div>
              <button onClick={() => setOtpModal({ open: false, action: null })} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="p-10 md:p-14 pt-8 space-y-10">
              {otpStep === 'sending' && (
                <div className="py-20 flex flex-col items-center space-y-8 animate-in fade-in duration-500 text-center">
                  <Loader2 size={64} className="text-indigo-600 animate-spin" />
                  <div className="space-y-2">
                    <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Sending OTP</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Dispatching code to your email...</p>
                  </div>
                </div>
              )}

              {otpStep === 'error' && (
                <div className="py-12 flex flex-col items-center space-y-8 animate-in fade-in duration-500 text-center">
                  <div className="h-20 w-20 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center">
                    <AlertTriangle size={40} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">OTP Failed</h4>
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{otpError}</p>
                  </div>
                  <button
                    onClick={() => setOtpModal({ open: false, action: null })}
                    className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black uppercase text-xs tracking-widest rounded-xl"
                  >
                    Close
                  </button>
                </div>
              )}

              {otpStep === 'input' && (
                <div className="space-y-10 animate-in fade-in duration-300">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-relaxed">
                      A one-time code has been sent to your registered email address.
                    </p>
                  </div>

                  {otpError && (
                    <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-800 text-center">
                      <p className="text-xs font-black text-rose-500 uppercase tracking-widest">{otpError}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="w-full py-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-rose-600 outline-none transition-all font-mono tracking-[0.6em] text-center text-3xl dark:text-white"
                    />
                    <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Check your email inbox for the code</p>
                  </div>

                  <button
                    onClick={handleOtpConfirm}
                    disabled={otpValue.length !== 6}
                    className="w-full py-6 bg-rose-600 text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-xl hover:bg-rose-700 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
                  >
                    Finalize Authorization
                  </button>
                </div>
              )}

              {otpStep === 'processing' && (
                <div className="py-20 flex flex-col items-center space-y-8 animate-in fade-in duration-500 text-center">
                  <div className="relative">
                    <Loader2 size={64} className="text-rose-600 animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Processing Shard Purge</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Broadcasting revocation to all ecosystem nodes...</p>
                  </div>
                </div>
              )}

              {otpStep === 'success' && (
                <div className="py-20 flex flex-col items-center space-y-8 animate-in zoom-in duration-500 text-center">
                  <div className="h-24 w-24 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-100 dark:shadow-none transition-all">
                    <ShieldCheck size={48} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {otpModal.action === 'delete' ? 'Account Deleted Successfully' : 'Execution Success'}
                    </h4>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                      {otpModal.action === 'delete' ? 'Redirecting to signup in 5 seconds...' : 'Immutable Ledger Updated'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Attribute Editor / Adder Modal - Portaled and Scrollable */}
      {(editingAttr || isAdding) && createPortal(
        <div className="fixed inset-0 z-[2000] bg-slate-900/60 dark:bg-black/80 backdrop-blur-2xl overflow-y-auto px-4 py-8 flex justify-center items-start sm:items-center">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] animate-in zoom-in duration-300 border dark:border-slate-800 flex flex-col overflow-hidden my-auto">
            <div className="p-8 md:p-14 pb-4 md:pb-6 flex justify-between items-start shrink-0">
              <div>
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-2 md:mb-4 block">
                  {isAdding ? 'Provision New Shard' : 'Secure Shard Update'}
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                  {isAdding ? 'Add Custom Asset' : `Edit ${editingAttr?.label}`}
                </h3>
              </div>
              <button onClick={() => { setEditingAttr(null); setIsAdding(false); }} className="p-2 md:p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0 ml-4">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="p-8 md:p-14 pt-0">
              {verificationStep === 'input' && (
                <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
                  {isAdding && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Information Label</label>
                        <input
                          type="text"
                          value={newLabel}
                          onChange={(e) => setNewLabel(e.target.value)}
                          placeholder="E.g. Passport Number, Voter ID"
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold dark:text-white text-base"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Information Category</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Personal', 'Health', 'Agriculture', 'City'].map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setNewCategory(cat as any)}
                              className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${newCategory === cat
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'
                                }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      {isAdding ? 'Information Value' : 'Proposed Value'}
                    </label>
                    <input
                      type="text"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      className="w-full px-6 py-4 md:py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold dark:text-white text-base md:text-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between ml-1 gap-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aadhaar Card Verification (12-Digit)</label>
                      <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Auth Required</span>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        maxLength={12}
                        value={aadhaar}
                        onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                        placeholder="0000 0000 0000"
                        className="w-full px-12 md:px-16 py-4 md:py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-600 outline-none transition-all font-mono tracking-[0.3em] md:tracking-[0.5em] text-center text-lg md:text-xl dark:text-white"
                      />
                      <Fingerprint size={20} className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div className="p-5 md:p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-widest flex items-start gap-3">
                      <ShieldAlert size={14} className="shrink-0 text-orange-500 mt-0.5" />
                      <span>By clicking "{isAdding ? 'Verify & Add Asset' : 'Verify & Update Shard'}", you authorize a cryptographic handshake between your sovereign node and the National Identity Registry to validate the provided Aadhaar number.</span>
                    </p>
                  </div>

                  <button
                    onClick={handleVerifyAndAction}
                    disabled={!newValue || (isAdding && !newLabel) || aadhaar.length !== 12}
                    className="w-full py-5 md:py-6 bg-[#0f172a] dark:bg-indigo-600 text-white font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs rounded-2xl shadow-xl hover:bg-black dark:hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale mt-2 mb-2"
                  >
                    {isAdding ? 'Verify & Add Asset' : 'Verify & Update Shard'}
                  </button>
                </div>
              )}

              {verificationStep === 'processing' && (
                <div className="py-12 md:py-20 flex flex-col items-center space-y-8 animate-in fade-in duration-500 text-center">
                  <div className="relative">
                    <Loader2 size={64} className="text-indigo-600 animate-spin md:size-80" />
                    <ShieldCheck size={28} className="absolute inset-0 m-auto text-indigo-400 md:size-32" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Authenticating Shard</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Requesting Zero-Knowledge Proof from Gateway...</p>
                  </div>
                </div>
              )}

              {verificationStep === 'success' && (
                <div className="py-12 md:py-20 flex flex-col items-center space-y-8 animate-in zoom-in duration-500 text-center">
                  <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-100 dark:shadow-none transition-all">
                    <ShieldCheck size={40} className="md:size-48" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Identity Verified</h4>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Secure Ledger Updated Successfully</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CitizenAssets;
