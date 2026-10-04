import React, { useState, useEffect } from 'react';
import { 
  X, Check, Sparkles, Zap, Heart, Shield, Crown, Infinity, 
  Flame, Award, CreditCard, Lock, ArrowRight, CheckCircle2,
  RefreshCw, Layers, ShieldCheck, Smartphone, QrCode
} from 'lucide-react';
import { useGameStore, PlanCycle, SubscriptionTier } from '../store/useGameStore';
import { PATHS_METADATA } from '../data/learningPaths';
import { supabase } from '../lib/supabase';
import { sounds } from '../lib/sound';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerSource?: string;
}

export default function SubscriptionModal({ isOpen, onClose, triggerSource }: SubscriptionModalProps) {
  const { 
    isPro, 
    subscriptionTier, 
    subscriptionPlanCycle, 
    subscriptionExpiresAt,
    unlockedAdvancedPathId, 
    unlockedAdvancedPathIds,
    studentPlusRenewalCount,
    username,
    upgradeToPro, 
    cancelSubscription 
  } = useGameStore();

  const isStudentPlus = subscriptionTier === 'student_plus';
  const isProTier = subscriptionTier === 'pro';
  const isBasicTier = !isStudentPlus && !isProTier;

  const maxAllowedTracks = 1 + studentPlusRenewalCount;
  const unlockedCount = unlockedAdvancedPathIds && unlockedAdvancedPathIds.length > 0 ? unlockedAdvancedPathIds.length : 1;

  // 1-Week Expiration Check for Renewal Prompt
  const expiresMs = subscriptionExpiresAt ? new Date(subscriptionExpiresAt).getTime() : null;
  const daysUntilExpiry = expiresMs ? (expiresMs - Date.now()) / (1000 * 60 * 60 * 24) : null;
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 7;

  const [currency, setCurrency] = useState<'PHP' | 'USD'>('PHP');
  const [billingCycle, setBillingCycle] = useState<PlanCycle>('yearly');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(isStudentPlus ? 'pro' : 'student_plus');
  
  // Payment options restricted to GCash and Maya only
  const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'maya'>('gcash');
  const [refNumber, setRefNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'plans' | 'checkout' | 'pending_approval' | 'success'>('plans');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelNotice, setCancelNotice] = useState<string | null>(null);

  // User payment requests for tracker
  const [userRequests, setUserRequests] = useState<any[]>([]);
  const [activeModalTab, setActiveModalTab] = useState<'plans' | 'tracker'>('plans');

  const reqKey = (r: any) => `${r.refNumber || r.reference_number}_${r.tier}_${r.method}`;

  const loadRequests = async () => {
    let localRequests: any[] = [];
    const saved = localStorage.getItem('codequest_pending_payments');
    if (saved && username && username !== 'CodeExplorer') {
      try {
        const all = JSON.parse(saved);
        localRequests = all.filter((p: any) => p.username === username && p.username !== 'CodeExplorer');
      } catch {}
    }

    if (supabase && username && username !== 'CodeExplorer') {
      try {
        const { data, error } = await supabase
          .from('payment_approvals')
          .select('*')
          .ilike('username', username)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const dbMapped = data.map(item => ({
            id: item.id,
            username: item.username,
            tier: item.tier,
            cycle: item.cycle,
            method: item.method,
            refNumber: item.reference_number,
            timestamp: new Date(item.created_at).getTime(),
            status: item.status
          }));

          const mergedMap = new Map<string, any>();
          localRequests.forEach(r => mergedMap.set(reqKey(r), r));
          dbMapped.forEach(r => mergedMap.set(reqKey(r), r));

          setUserRequests(Array.from(mergedMap.values()));
          return;
        }
      } catch (err) {
        console.error('Error loading db payment requests:', err);
      }
    }
    setUserRequests(localRequests);
  };

  useEffect(() => {
    if (!isOpen) return;
    loadRequests();
    window.addEventListener('codequest_subscription_approved', loadRequests);
    window.addEventListener('storage', loadRequests);
    return () => {
      window.removeEventListener('codequest_subscription_approved', loadRequests);
      window.removeEventListener('storage', loadRequests);
    };
  }, [isOpen, username]);

  // Load admin QR config & uploaded QR images from localStorage or Supabase DB
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

  useEffect(() => {
    if (!isOpen) return;
    const saved = localStorage.getItem('codequest_admin_qr_config');
    if (saved) {
      try {
        setQrConfig(JSON.parse(saved));
      } catch {}
    }

    async function fetchConfig() {
      if (supabase) {
        try {
          const { data } = await supabase.from('admin_settings').select('config').eq('id', 'qr_config').maybeSingle();
          if (data && data.config) {
            setQrConfig(data.config);
            localStorage.setItem('codequest_admin_qr_config', JSON.stringify(data.config));
          }
        } catch {}
      }
    }
    fetchConfig();

    const handleQrUpdate = (e: any) => {
      if (e.detail) {
        setQrConfig(e.detail);
      } else {
        const saved = localStorage.getItem('codequest_admin_qr_config');
        if (saved) {
          try {
            setQrConfig(JSON.parse(saved));
          } catch {}
        }
      }
    };
    window.addEventListener('codequest_qr_config_updated', handleQrUpdate);
    return () => window.removeEventListener('codequest_qr_config_updated', handleQrUpdate);
  }, [isOpen]);

  // Listen for admin approval while waiting in pending_approval state
  useEffect(() => {
    const handleApproval = (e: any) => {
      const payment = e.detail;
      if (payment && payment.username === username) {
        setStep('success');
        sounds.playFanfare();
      }
    };
    window.addEventListener('codequest_subscription_approved', handleApproval);
    return () => window.removeEventListener('codequest_subscription_approved', handleApproval);
  }, [username]);

  const PRICING = {
    PHP: {
      symbol: '₱',
      basic: { monthly: 0, yearlyMonthly: 0, totalYearly: 0 },
      student_plus: { monthly: 99, yearlyMonthly: 49, totalYearly: 49 * 12 },
      pro: { monthly: 199, yearlyMonthly: 99, totalYearly: 99 * 12 },
    },
    USD: {
      symbol: '$',
      basic: { monthly: 0, yearlyMonthly: 0, totalYearly: 0 },
      student_plus: { monthly: 3.99, yearlyMonthly: 1.99, totalYearly: Number((1.99 * 12).toFixed(2)) },
      pro: { monthly: 7.99, yearlyMonthly: 3.99, totalYearly: Number((3.99 * 12).toFixed(2)) },
    }
  };

  const currPricing = PRICING[currency];

  const getPlanPriceDisplay = (tier: SubscriptionTier, cycle: PlanCycle) => {
    const p = currPricing[tier === 'student_plus' ? 'student_plus' : tier === 'pro' ? 'pro' : 'basic'];
    if (cycle === 'yearly') return `${currPricing.symbol}${p.yearlyMonthly}`;
    return `${currPricing.symbol}${p.monthly}`;
  };

  const getPlanTotalDisplay = (tier: SubscriptionTier, cycle: PlanCycle) => {
    const p = currPricing[tier === 'student_plus' ? 'student_plus' : tier === 'pro' ? 'pro' : 'basic'];
    if (cycle === 'yearly') return `${currPricing.symbol}${p.totalYearly}/yr billed annually`;
    return `${currPricing.symbol}${p.monthly}/mo billed monthly`;
  };

  const handleStartCheckout = (tier: SubscriptionTier) => {
    if (tier === 'basic' || tier === 'free') {
      if (!isBasicTier) {
        setShowCancelConfirm(true);
      } else {
        onClose();
      }
      return;
    }
    setSelectedTier(tier);
    setRefNumber('');
    setStep('checkout');
  };

  const handleManualApprovalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refNumber.trim() || refNumber.trim().length < 5) {
      alert('Please enter a valid payment Reference Number / Transaction ID.');
      return;
    }

    setIsProcessing(true);
    sounds.playCorrect();

    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        const rate = selectedTier === 'pro' 
          ? (billingCycle === 'yearly' ? 99 : 199)
          : (billingCycle === 'yearly' ? 49 : 99);
        const calcAmount = billingCycle === 'yearly' ? rate * 12 : rate;

        const { error } = await supabase
          .from('payment_approvals')
          .insert([{
            user_id: user?.id || null,
            username: username || 'CodeExplorer',
            method: paymentMethod === 'gcash' ? 'GCash' : 'Maya',
            reference_number: refNumber.trim(),
            amount: calcAmount,
            tier: selectedTier,
            cycle: billingCycle,
            status: 'pending',
            proof_image: ''
          }]);

        if (error) {
          console.warn('payment_approvals insert error:', error.message);
        }
      } catch (err) {
        console.error('payment_approvals insert error:', err);
      }
    }

    // Save locally as fallback
    const existing = JSON.parse(localStorage.getItem('codequest_pending_payments') || '[]');
    const newPayment = {
      id: `pay-${Date.now()}`,
      username: username || 'CodeExplorer',
      tier: selectedTier,
      cycle: billingCycle,
      method: paymentMethod === 'gcash' ? 'GCash' : 'Maya',
      refNumber: refNumber.trim(),
      timestamp: Date.now(),
      status: 'pending'
    };
    localStorage.setItem('codequest_pending_payments', JSON.stringify([newPayment, ...existing]));

    setIsProcessing(false);
    setStep('pending_approval');
    sounds.playFanfare();
  };

  const handleCancelSub = async () => {
    await cancelSubscription();
    setShowCancelConfirm(false);
    setCancelNotice('Successfully downgraded to Basic Free plan.');
    sounds.playWrong();
    setTimeout(() => {
      setCancelNotice(null);
      onClose();
    }, 2200);
  };

  const getTierDisplayName = (tier: SubscriptionTier) => {
    if (tier === 'pro') return 'CodeQuest PRO VIP';
    if (tier === 'student_plus') return 'StudentPlus Scholar';
    return 'Basic Free';
  };

  const activeQrImage = paymentMethod === 'gcash' ? qrConfig.gcashQrImage : qrConfig.mayaQrImage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0B0C10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]">
        {cancelNotice && (
          <div className="bg-rose-500/20 text-rose-300 border-b border-rose-500/30 px-5 py-3 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <Check size={15} className="text-rose-400" />
            <span>{cancelNotice}</span>
          </div>
        )}
        
        {/* Header - No admin button here anymore per requirement */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0F1015] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
              <Crown size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold tracking-tight text-white">Subscription & Plans</h3>
              <p className="text-[11px] text-white/50">Manage membership & manual QR payments</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex p-0.5 bg-white/5 border border-white/10 rounded-lg text-[11px] font-medium">
              <button
                type="button"
                onClick={() => setCurrency('PHP')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  currency === 'PHP' ? 'bg-white/15 text-white font-bold' : 'text-white/40 hover:text-white'
                }`}
              >
                ₱ PHP
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  currency === 'USD' ? 'bg-white/15 text-white font-bold' : 'text-white/40 hover:text-white'
                }`}
              >
                $ USD
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tabs: Plans / Request Tracker */}
        {step === 'plans' && (
          <div className="flex border-b border-white/10 bg-[#0D0E13] px-4 pt-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveModalTab('plans')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeModalTab === 'plans'
                  ? 'border-amber-400 text-amber-400 bg-white/[0.02]'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              Subscription Plans
            </button>
            <button
              type="button"
              onClick={() => setActiveModalTab('tracker')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeModalTab === 'tracker'
                  ? 'border-amber-400 text-amber-400 bg-white/[0.02]'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <span>Request Tracker</span>
              {userRequests.filter(r => r.status === 'pending').length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              )}
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {activeModalTab === 'tracker' && step === 'plans' ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-sm font-bold text-white">Your Subscription Requests</h4>
                  <p className="text-xs text-white/50">Track the status of your manual QR payment submissions</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const saved = localStorage.getItem('codequest_pending_payments');
                    if (saved) {
                      try {
                        const all = JSON.parse(saved);
                        setUserRequests(all.filter((p: any) => p.username === username));
                      } catch {}
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-xs font-bold border border-white/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={13} />
                  <span>Refresh Status</span>
                </button>
              </div>

              {userRequests.length === 0 ? (
                <div className="py-12 text-center text-white/40 text-xs space-y-2 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                  <QrCode size={32} className="mx-auto text-white/20 mb-2" />
                  <p className="font-bold text-white/60">No payment requests submitted yet.</p>
                  <p className="text-[11px] text-white/40 max-w-xs mx-auto">
                    Choose StudentPlus or PRO VIP and submit your GCash/Maya reference number to start tracking your request here!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userRequests.map((req) => (
                    <div key={req.id} className="bg-white/[0.02] border border-white/10 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-xs sm:text-sm">
                            {req.tier === 'pro' ? 'CodeQuest PRO VIP' : 'StudentPlus Scholar'}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-white/80">
                            {req.cycle}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            req.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {req.status === 'approved' ? '✅ Approved & Active' :
                             req.status === 'rejected' ? '❌ Rejected' : '⏳ Pending Review'}
                          </span>
                        </div>
                        <div className="text-[11px] text-white/50 flex items-center gap-3">
                          <span>Method: <strong className="text-white">{req.method}</strong></span>
                          <span>Ref: <strong className="text-white font-mono">{req.refNumber}</strong></span>
                          <span>Submitted: {new Date(req.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {req.status === 'approved' ? (
                        <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                          Active Perks Unlocked
                        </div>
                      ) : req.status === 'rejected' ? (
                        <div className="text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                          Please Resubmit
                        </div>
                      ) : (
                        <div className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 flex items-center gap-1.5">
                          <RefreshCw size={12} className="animate-spin" />
                          <span>Waiting Admin Review</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : step === 'pending_approval' ? (
            <div className="py-12 px-4 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
                <RefreshCw size={28} className="animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-white">Payment Submitted for Approval! ⏳</h3>
              <p className="text-white/60 text-xs max-w-sm mx-auto leading-relaxed">
                Your reference number has been received and queued in the admin review system. Once verified, your subscription will be manually approved and activated!
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-all cursor-pointer shadow-sm"
              >
                Return to Dashboard
              </button>
            </div>
          ) : step === 'success' ? (
            <div className="py-12 px-4 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">Subscription Activated!</h3>
              <p className="text-white/60 text-xs max-w-sm mx-auto leading-relaxed">
                Your account has been successfully upgraded with infinite hearts, accelerated XP multipliers, and full advanced path access.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-all cursor-pointer shadow-sm"
              >
                Continue Learning
              </button>
            </div>
          ) : step === 'checkout' ? (
            <form onSubmit={handleManualApprovalSubmit} className="space-y-5 animate-in fade-in duration-200">
              {/* Summary */}
              <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-white/40 tracking-wider block mb-0.5">Selected Plan</span>
                  <h4 className="text-sm font-bold text-white">{getTierDisplayName(selectedTier)}</h4>
                  <p className="text-white/50 text-[11px] capitalize mt-0.5">{billingCycle} Billing</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-white/40 tracking-wider block mb-0.5">Amount Due</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {getPlanTotalDisplay(selectedTier, billingCycle)}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector: GCash and Maya QR only */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/50 block">
                  Choose Admin QR Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gcash')}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'gcash'
                        ? 'bg-sky-500/10 border-sky-400/80 text-white'
                        : 'bg-white/[0.02] border-white/10 text-white/50 hover:text-white'
                    }`}
                  >
                    <Smartphone size={16} className="text-sky-400" />
                    <span>GCash QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('maya')}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'maya'
                        ? 'bg-emerald-500/10 border-emerald-400/80 text-white'
                        : 'bg-white/[0.02] border-white/10 text-white/50 hover:text-white'
                    }`}
                  >
                    <QrCode size={16} className="text-emerald-400" />
                    <span>Maya QR</span>
                  </button>
                </div>
              </div>

              {/* Display Actual Admin-Uploaded QR Code Image */}
              <div className="bg-white/[0.02] border border-white/10 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="w-56 h-56 sm:w-64 sm:h-64 bg-black/40 p-3 rounded-2xl shrink-0 flex flex-col items-center justify-center shadow-2xl border-2 border-white/25 overflow-hidden">
                  {activeQrImage ? (
                    <img 
                      src={activeQrImage} 
                      alt={`${paymentMethod.toUpperCase()} Admin QR`} 
                      className="w-full h-full object-contain rounded-xl" 
                    />
                  ) : (
                    <div className="w-full h-full bg-[#111] rounded-xl flex flex-col items-center justify-center p-4 text-white font-mono text-xs text-center">
                      <QrCode size={64} className="text-white/40 mb-2" />
                      <span className="text-[11px] text-white/60 font-bold">Admin QR Pending Upload</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-white/80">
                    Scan Official Admin {paymentMethod === 'gcash' ? 'GCash' : 'Maya'} QR
                  </span>
                  <h4 className="text-base font-black text-white">
                    {paymentMethod === 'gcash' ? qrConfig.gcashName : qrConfig.mayaName}
                  </h4>
                  <p className="text-xs font-mono text-white/70">
                    Account No: <strong className="text-emerald-400">{paymentMethod === 'gcash' ? qrConfig.gcashNumber : qrConfig.mayaNumber}</strong>
                  </p>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    Scan the QR code above using your banking or e-wallet app, transfer the exact amount, and enter your transaction reference number below.
                  </p>
                </div>
              </div>

              {/* Reference Number Input */}
              <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl space-y-2">
                <label className="block text-[11px] font-bold uppercase text-white/60">
                  Payment Reference Number / Transaction ID *
                </label>
                <input
                  type="text"
                  required
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  placeholder="e.g., REF-948201948"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white font-mono focus:outline-none focus:border-white/30"
                />
                <span className="text-[10px] text-white/40 block">
                  Admin will review this reference code for manual approval.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('plans')}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-bold text-xs cursor-pointer border border-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-2.5 rounded-xl bg-white hover:bg-white/90 text-black font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw size={14} className="animate-spin text-black" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={13} />
                      <span>Submit for Manual Approval</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <>
              {triggerSource === 'hearts' && (
                <div className="bg-white/[0.03] border border-white/10 p-3 rounded-xl flex items-center gap-2.5 text-xs text-white/70">
                  <Heart size={15} className="text-rose-400 fill-rose-400 shrink-0" />
                  <span>Out of Hearts? Upgrade to StudentPlus or Pro for infinite lives with zero interruptions!</span>
                </div>
              )}

              {/* Active Plan Banner */}
              {isProTier ? (
                <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
                      <Crown size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-xs sm:text-sm">Active: CodeQuest PRO VIP</h4>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-white/80">Active</span>
                      </div>
                      <p className="text-white/50 text-[11px] mt-0.5">All 6 tracks unlocked • Infinite Lives • 2X Double XP</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      {isExpiringSoon && (
                        <button
                          onClick={() => handleStartCheckout('pro')}
                          className="px-3 py-1.5 rounded-lg bg-amber-400 hover:brightness-110 text-amber-950 text-xs font-bold transition-all cursor-pointer"
                        >
                          Renew PRO
                        </button>
                      )}
                      <button
                        onClick={() => setShowCancelConfirm(true)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs border border-white/10 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : isStudentPlus ? (
                <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <Zap size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-xs sm:text-sm">Active: StudentPlus</h4>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-white/80">
                          {unlockedCount}/{maxAllowedTracks} Tracks
                        </span>
                      </div>
                      <p className="text-white/50 text-[11px] mt-0.5">
                        {isExpiringSoon 
                          ? 'Subscription ending within 1 week! Renew to extend & get +1 advanced path.' 
                          : 'Infinite Hearts • 1.5X XP Boost • Active Unlocked Tracks'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {isExpiringSoon && (
                      <button
                        onClick={() => handleStartCheckout('student_plus')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-400 hover:brightness-110 text-emerald-950 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <RefreshCw size={12} />
                        <span>Renew (+1 Path)</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleStartCheckout('pro')}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer border border-white/10"
                    >
                      Upgrade PRO
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs border border-white/10 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Billing Cycle selector */}
              <div className="flex items-center justify-center">
                <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      billingCycle === 'monthly' ? 'bg-white/15 text-white font-bold' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      billingCycle === 'yearly' ? 'bg-white/15 text-white font-bold' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    Annually (Save 50%)
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Basic */}
                <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">Basic</span>
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-white">{currPricing.symbol}0</span>
                      <span className="text-white/40 text-xs"> / free</span>
                      <p className="text-[11px] text-white/40 mt-0.5">Standard fundamentals</p>
                    </div>
                    <ul className="space-y-1.5 text-xs text-white/70">
                      <li className="flex items-center gap-2">
                        <Check size={13} className="text-white/40" />
                        <span>Standard 5 Hearts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={13} className="text-white/40" />
                        <span>1X Base XP</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={13} className="text-white/40" />
                        <span>Core Curriculum</span>
                      </li>
                    </ul>
                  </div>
                  {isBasicTier ? (
                    <div className="w-full py-2 rounded-lg bg-white/10 text-white/60 text-xs font-bold text-center border border-white/10">
                      ✓ Active Free Plan
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartCheckout('basic')}
                      className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-bold transition-all cursor-pointer border border-white/10"
                    >
                      Downgrade to Free
                    </button>
                  )}
                </div>

                {/* 2. StudentPlus */}
                <div className="bg-white/[0.02] border border-white/15 rounded-xl p-4 flex flex-col justify-between space-y-3 relative">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">StudentPlus</span>
                    </div>
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-white">
                        {getPlanPriceDisplay('student_plus', billingCycle)}
                      </span>
                      <span className="text-white/40 text-xs"> / mo</span>
                      <p className="text-[11px] text-white/40 mt-0.5">
                        {billingCycle === 'yearly' ? getPlanTotalDisplay('student_plus', 'yearly') : 'Billed monthly'}
                      </p>
                    </div>
                    <ul className="space-y-1.5 text-xs text-white/80">
                      <li className="flex items-center gap-2">
                        <Infinity size={13} className="text-emerald-400" />
                        <span>Infinite Hearts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap size={13} className="text-emerald-400" />
                        <span>{maxAllowedTracks} Unlocked Tracks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles size={13} className="text-emerald-400" />
                        <span>1.5X Turbo XP</span>
                      </li>
                    </ul>
                  </div>
                  {isStudentPlus ? (
                    <div className="w-full py-2 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold text-xs text-center">
                      ✓ Active Plan
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartCheckout('student_plus')}
                      className="w-full py-2 rounded-lg bg-white hover:bg-white/90 text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                    >
                      Get StudentPlus
                    </button>
                  )}
                </div>

                {/* 3. CodeQuest PRO */}
                <div className="bg-white/[0.02] border border-white/15 rounded-xl p-4 flex flex-col justify-between space-y-3 relative">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">CodeQuest PRO</span>
                    </div>
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-white">
                        {getPlanPriceDisplay('pro', billingCycle)}
                      </span>
                      <span className="text-white/40 text-xs"> / mo</span>
                      <p className="text-[11px] text-white/40 mt-0.5">
                        {billingCycle === 'yearly' ? getPlanTotalDisplay('pro', 'yearly') : 'Billed monthly'}
                      </p>
                    </div>
                    <ul className="space-y-1.5 text-xs text-white/80">
                      <li className="flex items-center gap-2">
                        <Crown size={13} className="text-amber-400" />
                        <span>All 6 Tracks Unlocked</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Infinity size={13} className="text-amber-400" />
                        <span>Infinite Hearts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles size={13} className="text-amber-400" />
                        <span>2X Double XP Boost</span>
                      </li>
                    </ul>
                  </div>
                  {isProTier ? (
                    <div className="w-full py-2 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold text-xs text-center">
                      ✓ Active PRO Plan
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartCheckout('pro')}
                      className="w-full py-2 rounded-lg bg-amber-400 hover:brightness-110 text-amber-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                    >
                      Get PRO VIP
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        {showCancelConfirm && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#12131A] border border-rose-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
              <div className="w-14 h-14 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                ⚠️
              </div>
              <div>
                <h4 className="text-lg font-black text-white">Cancel Subscription?</h4>
                <p className="text-xs text-white/60 mt-1">
                  Are you sure you want to cancel your subscription plan? You will revert to the Basic Free plan and lose premium perks.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs cursor-pointer transition-all"
                >
                  Keep Plan
                </button>
                <button
                  type="button"
                  onClick={handleCancelSub}
                  className="flex-1 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-black font-black text-xs uppercase cursor-pointer transition-all shadow-lg"
                >
                  Yes, Cancel Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
