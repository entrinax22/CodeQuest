import React, { useState } from 'react';
import { 
  Settings, Volume2, VolumeX, Bell, Moon, Sun, Shield, 
  LogOut, HelpCircle, Smartphone, Sliders, Check, RefreshCw, 
  ExternalLink, User, Sparkles, AlertTriangle, Layers, Target,
  CheckCircle2, Flame, Trophy, Lock, KeyRound, Eye, EyeOff, Loader2,
  CheckCheck, Crown, Infinity, Zap, ChevronRight, QrCode
} from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { supabase } from '../lib/supabase';
import { renderLeagueBadgeIcon } from './LeaderboardTab';
import { sounds } from '../lib/sound';
import AdminPortalModal from './AdminPortalModal';

interface SettingsTabProps {
  session: any;
  onGoToProfile?: () => void;
  onOpenSubscription?: () => void;
}

const DAILY_GOALS = [
  { id: 'casual', label: 'Casual', time: '5m / day', xpTarget: '50 XP', desc: 'Bite-sized daily practice' },
  { id: 'regular', label: 'Regular', time: '15m / day', xpTarget: '150 XP', desc: 'Steady, continuous growth' },
  { id: 'serious', label: 'Serious', time: '30m / day', xpTarget: '300 XP', desc: 'Accelerated skill builder' },
  { id: 'intense', label: 'Intense', time: '60m / day', xpTarget: '600 XP', desc: 'Full career sprint' },
];

export default function SettingsTab({ session, onGoToProfile, onOpenSubscription }: SettingsTabProps) {
  const { 
    soundEnabled, toggleSound, username, avatarIcon, level, xp, streak, leagueId,
    isPro, subscriptionTier, subscriptionPlanCycle, cancelSubscription, role
  } = useGameStore();

  const isAdmin = role === 'admin' || session?.user?.email === 'mark.entrina12@gmail.com';

  const [dailyGoal, setDailyGoal] = useState<'casual' | 'regular' | 'serious' | 'intense'>(() => {
    return username ? ((localStorage.getItem(`codequest_daily_goal_${username}`) as any) || 'regular') : 'regular';
  });
  
  // Security & Password Change state
  const [showPasswordChange, setShowPasswordChange] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Admin Portal Modal state
  const [showAdminPortal, setShowAdminPortal] = useState(false);

  // Sign out confirmation
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const notifySaved = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 2500);
  };

  const handleSelectGoal = (goalId: 'casual' | 'regular' | 'serious' | 'intense') => {
    setDailyGoal(goalId);
    if (username) {
      localStorage.setItem(`codequest_daily_goal_${username}`, goalId);
    }
    sounds.playCorrect();
    notifySaved(`Goal updated to ${DAILY_GOALS.find(g => g.id === goalId)?.label}! 🎯`);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please verify.');
      return;
    }

    if (!window.confirm('Are you sure you want to update your account password?')) {
      return;
    }

    setIsUpdatingPassword(true);

    try {
      if (!supabase) throw new Error('Supabase client is not connected.');

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      sounds.playCorrect();
      setPasswordSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordChange(false);
        setPasswordSuccess(null);
      }, 2500);
    } catch (err: any) {
      sounds.playWrong();
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSignOut = async () => {
    sounds.playCorrect();
    useGameStore.getState().resetStore();
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordsMismatch = newPassword && confirmPassword && newPassword !== confirmPassword;

  return (
    <div className="max-w-2xl lg:max-w-3xl mx-auto py-6 sm:py-8 px-3 sm:px-6 pb-28 space-y-5 animate-in fade-in duration-300">
      {/* Full-width Responsive Rectangular Toast Notification */}
      {savedNotice && (
        <div className="fixed top-16 left-2 right-2 sm:left-4 sm:right-4 md:max-w-3xl md:mx-auto z-50 bg-[#181926]/98 text-sky-200 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-sky-400/40 backdrop-blur-md text-xs sm:text-sm font-bold leading-snug animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <Check size={18} className="text-emerald-400 shrink-0" />
            <span className="whitespace-normal break-words">{savedNotice}</span>
          </div>
          <button onClick={() => setSavedNotice(null)} className="text-sky-300/60 hover:text-sky-200 text-xs font-bold shrink-0 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Settings className="text-sky-400 stroke-[2.5]" size={22} />
            <span>Settings</span>
          </h2>
          <p className="text-white/40 text-xs mt-0.5">
            Preferences, daily commitment, audio, and security
          </p>
        </div>

        {onGoToProfile && (
          <button
            onClick={onGoToProfile}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl transition-all text-xs font-bold text-white cursor-pointer"
            title="View Profile"
          >
            <span className="text-sm">{avatarIcon || '👾'}</span>
            <span className="text-sky-400">Profile</span>
          </button>
        )}
      </div>

      {/* Account Identity Summary */}
      <div className="bg-[#12131C] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-xl shadow-md shrink-0">
            {avatarIcon || '👾'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">
                {username || 'CodeExplorer'}
              </h3>
              <span className="text-[9px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                Level {level}
              </span>
            </div>
            <p className="text-white/40 text-xs font-mono mt-0.5">
              {session?.user?.email || 'student@codequest.dev'}
            </p>
          </div>
        </div>

        {onGoToProfile && (
          <button
            onClick={onGoToProfile}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          >
            <span>Edit</span>
            <ChevronRight size={13} />
          </button>
        )}
      </div>

      {/* Admin Portal Access Card (Separated & Role Protected) */}
      {isAdmin && (
        <div className="bg-gradient-to-br from-amber-500/10 via-[#12131C] to-amber-600/5 border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <Shield size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Admin Portal (QR & Approvals)</h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-md shadow-sm">Admin Only</span>
              </div>
              <p className="text-white/50 text-xs mt-1 leading-relaxed">
                Upload payment QR codes & review manual subscription approvals securely
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAdminPortal(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:brightness-110 text-amber-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shrink-0 flex items-center justify-center gap-2"
          >
            <QrCode size={15} />
            <span>Open Portal</span>
          </button>
        </div>
      )}

      {/* Audio & Haptics Settings */}
      <div className="bg-[#12131C] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Volume2 size={16} className="text-sky-400" />
          <span>Audio & Sound FX</span>
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-white text-xs">Sound Effects</p>
            <p className="text-white/40 text-[11px]">Play audio cues on correct answers, XP, and level up</p>
          </div>
          <button
            onClick={toggleSound}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
              soundEnabled ? 'bg-sky-500' : 'bg-white/10'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              soundEnabled ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Daily Learning Goal */}
      <div className="bg-[#12131C] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Target size={16} className="text-emerald-400" />
          <span>Daily Learning Goal</span>
        </h3>
        <p className="text-white/40 text-xs">Choose your target study pace for continuous progress</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {DAILY_GOALS.map((goal) => (
            <button
              key={goal.id}
              onClick={() => handleSelectGoal(goal.id as any)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                dailyGoal === goal.id
                  ? 'bg-emerald-500/15 border-emerald-400/60 shadow-md ring-1 ring-emerald-400/30'
                  : 'bg-white/[0.02] border-white/10 hover:bg-white/5 text-white/70'
              }`}
            >
              <span className={`text-xs font-black uppercase tracking-wider block mb-0.5 ${
                dailyGoal === goal.id ? 'text-emerald-300' : 'text-white'
              }`}>
                {goal.label}
              </span>
              <span className="text-[11px] font-bold text-white/50 block">{goal.time}</span>
              <span className="text-[10px] text-white/40 block mt-1">{goal.xpTarget}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Security & Password Change */}
      <div className="bg-[#12131C] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <KeyRound size={18} className="text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Security & Password</h3>
              <p className="text-white/40 text-[11px]">Update your account login credentials</p>
            </div>
          </div>

          <button
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 font-bold text-xs border border-white/10 transition-all cursor-pointer"
          >
            {showPasswordChange ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPasswordChange && (
          <form onSubmit={handleChangePassword} className="space-y-3 pt-2 border-t border-white/10 animate-in fade-in duration-200">
            <div>
              <label className="block text-[10px] font-bold uppercase text-white/50 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 pr-10 text-xs text-white focus:outline-none focus:border-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-white/50 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 pr-10 text-xs text-white focus:outline-none focus:border-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {confirmPassword && (
                <div className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${
                  newPassword === confirmPassword ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {newPassword === confirmPassword ? '✓ Passwords match' : '✕ Passwords do not match'}
                </div>
              )}
            </div>

            {passwordError && (
              <div className="bg-rose-500/15 border border-rose-500/30 rounded-xl p-2 text-xs text-rose-300 font-bold flex items-center gap-1.5">
                <AlertTriangle size={13} className="shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-2 text-xs text-emerald-300 font-bold flex items-center gap-1.5">
                <CheckCheck size={13} className="shrink-0 text-emerald-400" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <KeyRound size={13} />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Sign Out Action */}
      <div className="bg-[#12131C] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        {showSignOutConfirm ? (
          <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-xs">Confirm Sign Out</h4>
                <p className="text-white/60 text-[11px] mt-0.5">
                  Your progress is saved securely in the cloud. You can log back in anytime.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleSignOut}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Sign Out
              </button>
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/80 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-white text-xs">Sign Out</p>
              <p className="text-white/40 text-[11px]">End active session on this device</p>
            </div>
            <button
              onClick={() => setShowSignOutConfirm(true)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>

      {/* Admin Portal Modal */}
      <AdminPortalModal
        isOpen={showAdminPortal}
        onClose={() => setShowAdminPortal(false)}
        session={session}
      />
    </div>
  );
}
