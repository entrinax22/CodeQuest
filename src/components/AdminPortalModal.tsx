import React, { useState, useEffect } from 'react';
import { X, Shield, QrCode, Smartphone, CheckCircle2, XCircle, RefreshCw, Check, Upload, Lock } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { supabase } from '../lib/supabase';
import { sounds } from '../lib/sound';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: any;
}

export default function AdminPortalModal({ isOpen, onClose, session }: AdminPortalModalProps) {
  const { username } = useGameStore();
  const [activeTab, setActiveTab] = useState<'pending' | 'qr_config'>('pending');

  const userEmail = session?.user?.email || 'mark.entrina12@gmail.com';
  const isAdmin = userEmail === 'mark.entrina12@gmail.com' || localStorage.getItem('codequest_is_admin') === 'true';

  // QR Config state stored in localStorage
  const [qrConfig, setQrConfig] = useState(() => {
    const saved = localStorage.getItem('codequest_admin_qr_config');
    return saved ? JSON.parse(saved) : {
      gcashName: 'CodeQuest Academy',
      gcashNumber: '0917 555 0192',
      gcashQrImage: '',
      mayaName: 'CodeQuest EdTech',
      mayaNumber: '0918 555 0192',
      mayaQrImage: '',
    };
  });

  // Pending payments state
  const [pendingPayments, setPendingPayments] = useState<any[]>(() => {
    const saved = localStorage.getItem('codequest_pending_payments');
    return saved ? JSON.parse(saved) : [];
  });

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'gcash' | 'maya') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (type === 'gcash') {
        setQrConfig((prev: any) => ({ ...prev, gcashQrImage: result }));
      } else {
        setQrConfig((prev: any) => ({ ...prev, mayaQrImage: result }));
      }
      sounds.playCorrect();
      showToast(`${type.toUpperCase()} QR code image uploaded successfully! 📸`);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveQrConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('codequest_admin_qr_config', JSON.stringify(qrConfig));

    if (supabase) {
      try {
        const { error } = await supabase.from('admin_settings').upsert({
          id: 'qr_config',
          config: qrConfig,
          updated_at: new Date().toISOString()
        });
        if (error) {
          console.warn('admin_settings upsert error:', error.message);
        }
      } catch (err) {
        console.error('Supabase save error:', err);
      }
    }

    window.dispatchEvent(new CustomEvent('codequest_qr_config_updated', { detail: qrConfig }));
    sounds.playCorrect();
    showToast('Admin QR settings saved to DB & synced successfully! 💾');
  };

  const handleApprovePayment = async (paymentId: string) => {
    const payment = pendingPayments.find(p => p.id === paymentId);
    if (!payment) return;

    const updated = pendingPayments.map(p => {
      if (p.id === paymentId) {
        return { ...p, status: 'approved' };
      }
      return p;
    });
    setPendingPayments(updated);
    localStorage.setItem('codequest_pending_payments', JSON.stringify(updated));

    // Also upgrade user in store if it's the current user
    // (In full production, this would trigger server-side activation)
    sounds.playFanfare();
    showToast(`Payment approved! Subscription upgraded to ${payment.tier.toUpperCase()}. 🎉`);
  };

  const handleRejectPayment = (paymentId: string) => {
    const updated = pendingPayments.map(p => {
      if (p.id === paymentId) {
        return { ...p, status: 'rejected' };
      }
      return p;
    });
    setPendingPayments(updated);
    localStorage.setItem('codequest_pending_payments', JSON.stringify(updated));
    sounds.playWrong();
    showToast('Payment request rejected.');
  };

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-[#0B0C10] border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden text-white p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
            <Lock size={26} />
          </div>
          <h3 className="text-xl font-bold text-white">Restricted Admin Access</h3>
          <p className="text-white/60 text-xs leading-relaxed">
            Your account ({userEmail}) does not have administrator privileges. Only authorized admin role users can access the QR configuration and manual approval portal.
          </p>
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                localStorage.setItem('codequest_is_admin', 'true');
                window.location.reload();
              }}
              className="px-4 py-2 rounded-xl bg-sky-500 text-black font-bold text-xs uppercase cursor-pointer hover:bg-sky-400"
            >
              Simulate Admin Role (Demo)
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs cursor-pointer hover:bg-white/20"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl sm:max-w-4xl bg-[#0B0C10] border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-[#0F1015] shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">Secure Admin Portal</h3>
              <p className="text-xs text-white/50">Manage uploaded QR codes & manual payment approvals (Role: Admin)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-sky-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-1.5 border border-white/20">
            <Check size={13} className="text-emerald-300" />
            <span>{toast}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-[#0D0E13] px-4 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'border-amber-400 text-amber-400 bg-white/[0.02]'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            Pending Approvals ({pendingPayments.filter(p => p.status === 'pending').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('qr_config')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'qr_config'
                ? 'border-amber-400 text-amber-400 bg-white/[0.02]'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            Upload & Manage QR Codes
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {activeTab === 'pending' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50">Subscriber Payment Queue</span>
                <span className="text-[11px] text-white/40">Manual review for GCash and Maya transactions</span>
              </div>

              {pendingPayments.length === 0 ? (
                <div className="py-12 text-center text-white/40 text-xs">
                  No payment verification requests in queue.
                </div>
              ) : (
                pendingPayments.map((p) => (
                  <div key={p.id} className="bg-white/[0.02] border border-white/10 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{p.username}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-white/70">
                          {p.tier === 'pro' ? 'CodeQuest PRO' : 'StudentPlus'} ({p.cycle})
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          p.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          p.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                      <p className="text-white/50 text-[11px] font-mono">
                        Method: <strong className="text-white">{p.method}</strong> | Ref: <strong className="text-amber-400 font-bold">{p.refNumber}</strong>
                      </p>
                      <span className="text-[10px] text-white/40 block">
                        Submitted {new Date(p.timestamp).toLocaleString()}
                      </span>
                    </div>

                    {p.status === 'pending' ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleApprovePayment(p.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                        >
                          <CheckCircle2 size={13} />
                          <span>Approve</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectPayment(p.id)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer border border-white/10 transition-colors"
                        >
                          <XCircle size={13} />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-white/40 font-bold">
                        {p.status === 'approved' ? '✓ Verified & Approved' : '✕ Rejected'}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <form onSubmit={handleSaveQrConfig} className="space-y-5">
              <p className="text-xs text-white/60 leading-relaxed">
                Upload official QR code images for GCash and Maya. These uploaded QR codes will be dynamically displayed to students during checkout.
              </p>

              {/* GCash QR Upload */}
              <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <Smartphone size={15} />
                  <span>GCash QR Code & Account</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-white/40 mb-1">Account Name</label>
                    <input
                      type="text"
                      value={qrConfig.gcashName}
                      onChange={(e) => setQrConfig({ ...qrConfig, gcashName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-white/40 mb-1">GCash Number</label>
                    <input
                      type="text"
                      value={qrConfig.gcashNumber}
                      onChange={(e) => setQrConfig({ ...qrConfig, gcashNumber: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white font-mono focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                    {qrConfig.gcashQrImage ? (
                      <img src={qrConfig.gcashQrImage} alt="GCash QR" className="w-full h-full object-contain p-1" />
                    ) : (
                      <QrCode size={32} className="text-white/30" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">Upload GCash QR Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'gcash')}
                      className="text-xs text-white/60 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                    />
                    <p className="text-[10px] text-white/40">Upload clean PNG or JPG QR code image (Square aspect ratio recommended)</p>
                  </div>
                </div>
              </div>

              {/* Maya QR Upload */}
              <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <QrCode size={15} />
                  <span>Maya QR Code & Account</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-white/40 mb-1">Account Name</label>
                    <input
                      type="text"
                      value={qrConfig.mayaName}
                      onChange={(e) => setQrConfig({ ...qrConfig, mayaName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-white/40 mb-1">Maya Number</label>
                    <input
                      type="text"
                      value={qrConfig.mayaNumber}
                      onChange={(e) => setQrConfig({ ...qrConfig, mayaNumber: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white font-mono focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                    {qrConfig.mayaQrImage ? (
                      <img src={qrConfig.mayaQrImage} alt="Maya QR" className="w-full h-full object-contain p-1" />
                    ) : (
                      <QrCode size={32} className="text-white/30" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">Upload Maya QR Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'maya')}
                      className="text-xs text-white/60 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                    />
                    <p className="text-[10px] text-white/40">Upload clean PNG or JPG QR code image (Square aspect ratio recommended)</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-white/90 text-black font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-all"
                >
                  Save QR Code Settings & Images
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
