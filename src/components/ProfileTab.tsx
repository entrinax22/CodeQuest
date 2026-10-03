import React, { useState } from 'react';
import { 
  Trophy, Flame, Zap, Heart, CheckCircle2, Lock, Award, Edit3, 
  Sparkles, ChevronRight, Check, Share2, Star, BookOpen, 
  Compass, Shield, ArrowUpRight, Copy, CheckCheck, ArrowLeft,
  User, Mail, Target, Layers, AlertCircle, Loader2, Save, X, Crown, Infinity
} from 'lucide-react';
import { useGameStore, MAX_HEARTS } from '../store/useGameStore';
import { supabase } from '../lib/supabase';
import { CURRICULUM } from '../data/curriculum';
import { renderLeagueBadgeIcon } from './LeaderboardTab';
import { sounds } from '../lib/sound';

interface ProfileTabProps {
  session: any;
  onStartPractice?: () => void;
  onGoToLearn?: () => void;
  onOpenSubscription?: () => void;
}

const AVATARS = [
  '👾', '🚀', '🦊', '🐱', '🤖', '⚡', '🦁', '🧙‍♂️',
  '🥷', '🦖', '🦄', '🦉', '💻', '🎨', '🔥', '💎'
];

const THEME_GRADIENTS = [
  { name: 'Sky Electric', bg: 'from-sky-400 via-blue-500 to-indigo-600', ring: 'ring-sky-400/50' },
  { name: 'Emerald Wave', bg: 'from-emerald-400 via-teal-500 to-cyan-600', ring: 'ring-emerald-400/50' },
  { name: 'Sunset Flame', bg: 'from-amber-400 via-orange-500 to-rose-600', ring: 'ring-orange-400/50' },
  { name: 'Cosmic Violet', bg: 'from-fuchsia-400 via-purple-500 to-indigo-600', ring: 'ring-purple-400/50' },
];

const CAREER_GOALS = [
  'Full-Stack Developer',
  'Frontend Engineer',
  'Backend & API Specialist',
  'Algorithms & Systems Engineer',
  'Creative Web Designer',
];

export default function ProfileTab({ session, onStartPractice, onGoToLearn, onOpenSubscription }: ProfileTabProps) {
  const { 
    xp, weeklyXp, leagueId, hearts, streak, level, completedLessons, 
    username, avatarIcon, updateProfile, isPro, subscriptionTier,
    unlockedAdvancedPathIds, studentPlusRenewalCount 
  } = useGameStore();

  const maxAllowedTracks = 1 + studentPlusRenewalCount;
  const unlockedCount = unlockedAdvancedPathIds && unlockedAdvancedPathIds.length > 0 ? unlockedAdvancedPathIds.length : 1;

  // Editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editUsername, setEditUsername] = useState(() => username || 'CodeExplorer');
  const [editCareerGoal, setEditCareerGoal] = useState(() => {
    return localStorage.getItem('codequest_career_goal') || 'Full-Stack Developer';
  });
  const [editBio, setEditBio] = useState(() => {
    return localStorage.getItem('codequest_bio') || 'Leveling up my software engineering skills on CodeQuest Academy.';
  });

  // Sync edit fields when store updates
  React.useEffect(() => {
    if (username) {
      setEditUsername(username);
    }
  }, [username]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [activeThemeIdx, setActiveThemeIdx] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const totalCurriculumLessons = CURRICULUM.flatMap(m => m.lessons).length;
  const completedCount = completedLessons.length;
  const completionPercentage = Math.round((completedCount / totalCurriculumLessons) * 100);

  const xpIntoLevel = xp % 1000;
  const xpNeededForNext = 1000 - xpIntoLevel;
  const progressPercent = Math.min(100, Math.round((xpIntoLevel / 1000) * 100));

  // Determine Student Title based on Level
  const getStudentTitle = (lvl: number) => {
    if (lvl === 1) return { title: 'Junior Script Scout', icon: '🌱', desc: 'Starting your web development journey' };
    if (lvl === 2) return { title: 'HTML Tag Apprentice', icon: '🏷️', desc: 'Mastering tags, elements, and attributes' };
    if (lvl === 3) return { title: 'Syntax Architect', icon: '⚡', desc: 'Building semantic and accessible pages' };
    if (lvl === 4) return { title: 'Frontend Voyager', icon: '🚀', desc: 'Tackling complex forms, media, and tables' };
    if (lvl === 5) return { title: 'DOM Sorcerer', icon: '🔮', desc: 'Commanding web anatomy with precision' };
    return { title: 'Master Web Developer', icon: '👑', desc: 'Legend of the CodeQuest Academy' };
  };

  const currentTitle = getStudentTitle(level);

  // Save all profile information with uniqueness check
  const handleSaveProfile = async () => {
    const trimmed = editUsername.trim();
    if (!trimmed || trimmed.length < 3) {
      setEditError('Username must be at least 3 characters.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setEditError('Username can only contain letters, numbers, and underscores.');
      return;
    }

    setIsSaving(true);
    setEditError(null);

    try {
      // If username changed, verify uniqueness in Supabase
      if (trimmed.toLowerCase() !== (username || '').toLowerCase() && supabase) {
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .ilike('username', trimmed)
          .maybeSingle();

        if (existing && existing.id !== session?.user?.id) {
          throw new Error(`The username "${trimmed}" is already in use by another student.`);
        }
      }

      await updateProfile(trimmed, avatarIcon);
      localStorage.setItem('codequest_career_goal', editCareerGoal);
      localStorage.setItem('codequest_bio', editBio.trim());

      sounds.playCorrect();
      setIsEditingProfile(false);
      showToast(`Profile information updated! 🎉`);
    } catch (err: any) {
      sounds.playWrong();
      setEditError(err.message || 'Could not update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectAvatar = async (emoji: string) => {
    await updateProfile(username, emoji);
    setShowAvatarPicker(false);
    sounds.playCorrect();
    showToast(`New avatar selected! ${emoji}`);
  };

  const handleShareProfile = async () => {
    const textToShare = `🎮 CodeQuest Academy - Student Card\n👤 Coder: ${username}\n⭐ Level ${level} (${currentTitle.title})\n🔥 Streak: ${streak} Days\n⚡ Total XP: ${xp}\n🏆 League: ${(leagueId || 'Bronze').toUpperCase()}\n📚 Lessons Mastered: ${completedCount}/${totalCurriculumLessons} (${completionPercentage}%)\nKeep coding at CodeQuest!`;
    
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(textToShare);
        showToast('Profile summary copied to clipboard! 📋');
        return;
      } catch (e) {}
    }
    showToast('Stats summary ready!');
  };

  // Student Badges system
  const achievements = [
    {
      id: 'first-step',
      title: 'First Spark',
      desc: 'Complete your first coding lesson in the academy',
      icon: <Sparkles size={24} className="text-yellow-400" />,
      color: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/30 text-yellow-300',
      badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      unlocked: completedCount >= 1,
      progress: `${Math.min(1, completedCount)} / 1`,
      percent: Math.min(100, Math.round((completedCount / 1) * 100)),
      xpReward: 50
    },
    {
      id: 'html-apprentice',
      title: 'HTML Scholar',
      desc: 'Complete 5 fundamental HTML lessons',
      icon: <CheckCircle2 size={24} className="text-sky-400" />,
      color: 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-300',
      badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      unlocked: completedCount >= 5,
      progress: `${Math.min(5, completedCount)} / 5`,
      percent: Math.min(100, Math.round((completedCount / 5) * 100)),
      xpReward: 100
    },
    {
      id: 'streak-master',
      title: 'Streak Titan',
      desc: 'Maintain a 7-day continuous coding streak',
      icon: <Flame size={24} className="text-amber-400" />,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      unlocked: streak >= 7,
      progress: `${Math.min(7, streak)} / 7 Days`,
      percent: Math.min(100, Math.round((streak / 7) * 100)),
      xpReward: 150
    },
    {
      id: 'xp-collector',
      title: 'Grand Master Coder',
      desc: 'Accumulate 1,000 Total XP across all academy paths',
      icon: <Zap size={24} className="text-emerald-400" />,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      unlocked: xp >= 1000,
      progress: `${Math.min(1000, xp)} / 1000 XP`,
      percent: Math.min(100, Math.round((xp / 1000) * 100)),
      xpReward: 200
    },
    {
      id: 'curriculum-half',
      title: 'Web Pathfinder',
      desc: 'Complete at least 50% of the syllabus',
      icon: <Compass size={24} className="text-cyan-400" />,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-300',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      unlocked: completionPercentage >= 50,
      progress: `${completionPercentage}% / 50%`,
      percent: Math.min(100, Math.round((completionPercentage / 50) * 100)),
      xpReward: 300
    }
  ];

  const filteredBadges = achievements.filter(b => {
    if (badgeFilter === 'unlocked') return b.unlocked;
    if (badgeFilter === 'locked') return !b.unlocked;
    return true;
  });

  return (
    <div className="max-w-3xl lg:max-w-4xl mx-auto py-6 sm:py-8 px-2 sm:px-4 pb-28 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-black px-5 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2 border border-white/20 animate-bounce">
          <CheckCheck size={16} className="text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Back to Learn Navigation Bar */}
      {onGoToLearn && (
        <div className="flex items-center justify-between">
          <button
            onClick={onGoToLearn}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-black uppercase tracking-wider transition-all active:scale-95 group cursor-pointer"
          >
            <ArrowLeft size={14} className="text-sky-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Academy Roadmap</span>
          </button>

          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest hidden sm:inline">
            CodeQuest Student Profile
          </span>
        </div>
      )}

      {/* Main Student Identity Card */}
      <div className="bg-gradient-to-b from-[#181A26] to-[#11121A] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
          {/* Avatar with Customizer Button & Level Tag */}
          <div className="relative group shrink-0">
            <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr ${THEME_GRADIENTS[activeThemeIdx].bg} flex items-center justify-center text-5xl sm:text-6xl shadow-[0_10px_30px_rgba(14,165,233,0.35)] border-4 border-white/20 select-none transition-transform group-hover:scale-105 duration-200`}>
              {avatarIcon || '👾'}
            </div>

            {/* Level Tag on Avatar */}
            <div className="absolute -top-2.5 -left-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-950 font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full border-2 border-[#181A26] shadow-md flex items-center gap-1">
              <Star size={11} className="fill-amber-950" />
              <span>LVL {level}</span>
            </div>

            {/* Change Avatar Emoji Button */}
            <button
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute -bottom-2 -right-2 bg-[#202334] hover:bg-[#2A2E44] border-2 border-white/20 text-white p-2 rounded-xl transition-all shadow-xl active:scale-95 cursor-pointer group-hover:border-sky-400"
              title="Change Avatar Emoji"
            >
              <Edit3 size={14} className="text-sky-300" />
            </button>
          </div>

          {/* Student Info & In-Place Editor */}
          <div className="flex-1 min-w-0">
            {isEditingProfile ? (
              /* Profile Edit Form */
              <div className="space-y-3.5 bg-black/40 border border-sky-500/30 p-4 sm:p-5 rounded-2xl animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-sky-400 tracking-wider">
                    Edit Your Student Profile
                  </span>
                  <button
                    onClick={() => {
                      setEditUsername(username || 'CodeExplorer');
                      setEditError(null);
                      setIsEditingProfile(false);
                    }}
                    className="text-white/40 hover:text-white p-1"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-white/50 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editUsername || ''}
                    onChange={(e) => setEditUsername(e.target.value)}
                    maxLength={20}
                    placeholder="Enter desired username"
                    className="w-full bg-white/5 border border-white/15 focus:border-sky-400 rounded-xl px-3.5 py-2 text-sm font-bold text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-white/50 mb-1">
                    Career Focus & Goal
                  </label>
                  <select
                    value={editCareerGoal || 'Full-Stack Developer'}
                    onChange={(e) => setEditCareerGoal(e.target.value)}
                    className="w-full bg-[#1A1C28] border border-white/15 focus:border-sky-400 rounded-xl px-3.5 py-2 text-sm font-bold text-white focus:outline-none"
                  >
                    {CAREER_GOALS.map((goal) => (
                      <option key={goal} value={goal} className="bg-[#1A1C28] text-white">
                        {goal}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-white/50 mb-1">
                    Bio & Learning Status
                  </label>
                  <input
                    type="text"
                    value={editBio || ''}
                    onChange={(e) => setEditBio(e.target.value)}
                    maxLength={100}
                    placeholder="What are you mastering right now?"
                    className="w-full bg-white/5 border border-white/15 focus:border-sky-400 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                {editError && (
                  <div className="bg-rose-500/15 border border-rose-500/30 p-2.5 rounded-xl text-xs text-rose-300 font-bold flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{editError}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditUsername(username || 'CodeExplorer');
                      setEditError(null);
                      setIsEditingProfile(false);
                    }}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/70 font-bold text-xs uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Normal View Profile */
              <div>
                <div className="flex items-center gap-2.5 mb-1 justify-center sm:justify-start flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {username || 'CodeExplorer'}
                  </h2>
                  <button
                    onClick={() => {
                      setEditUsername(username || 'CodeExplorer');
                      setEditError(null);
                      setIsEditingProfile(true);
                    }}
                    className="bg-white/5 hover:bg-white/15 border border-white/10 text-sky-400 hover:text-sky-300 px-2.5 py-1 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    title="Edit Profile Information"
                  >
                    <Edit3 size={13} />
                    <span>Edit Profile</span>
                  </button>
                </div>

                {/* Student Title & Active League Badge */}
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 flex-wrap">
                  {subscriptionTier === 'pro' && (
                    <span className="text-xs font-black uppercase tracking-wider text-amber-950 bg-gradient-to-r from-amber-400 to-yellow-400 px-3 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      <Crown size={12} className="fill-amber-950" />
                      <span>CODEQUEST PRO</span>
                    </span>
                  )}

                  {subscriptionTier === 'student_plus' && (
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-950 bg-gradient-to-r from-emerald-400 to-teal-400 px-3 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      <Zap size={12} className="fill-emerald-950" />
                      <span>STUDENTPLUS</span>
                    </span>
                  )}

                  <span className="text-xs font-black uppercase tracking-wider text-sky-300 bg-sky-500/15 border border-sky-400/30 px-3 py-0.5 rounded-full flex items-center gap-1">
                    <span>{currentTitle.icon}</span>
                    <span>{currentTitle.title}</span>
                  </span>

                  <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 rounded-full flex items-center gap-1">
                    {renderLeagueBadgeIcon(leagueId || 'bronze', 13)}
                    <span>{(leagueId || 'bronze').toUpperCase()} LEAGUE</span>
                  </span>
                </div>

                {/* Goal & Bio info */}
                <p className="text-white/80 text-xs font-semibold mb-1">
                  🎯 Focus: {editCareerGoal}
                </p>
                <p className="text-white/50 text-xs italic mb-4 max-w-lg leading-relaxed">
                  "{editBio}"
                </p>

                {/* Action Badges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    onClick={handleShareProfile}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  >
                    <Share2 size={13} className="text-sky-400" />
                    <span>Share Stats Card</span>
                  </button>

                  {onOpenSubscription && (
                    <button
                      onClick={onOpenSubscription}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95 ${
                        isPro 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' 
                          : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 hover:brightness-110'
                      }`}
                    >
                      <Crown size={13} className={isPro ? 'text-amber-400 fill-amber-400' : 'fill-amber-950'} />
                      <span>{isPro ? 'Manage PRO Pass' : 'Get CodeQuest PRO'}</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                    <Shield size={13} />
                    <span>Enrolled CodeQuest Scholar</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Avatar Picker Drawer */}
        {showAvatarPicker && (
          <div className="pt-6 border-t border-white/10 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black uppercase tracking-wider text-white/60">
                Choose your avatar character
              </p>
              <button
                onClick={() => setShowAvatarPicker(false)}
                className="text-xs text-white/40 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-8 gap-2 mb-4">
              {AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleSelectAvatar(emoji)}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl transition-all border cursor-pointer ${
                    avatarIcon === emoji
                      ? 'bg-sky-500/30 border-sky-400 scale-110 shadow-lg ring-2 ring-sky-400/40'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <p className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-2">
              Avatar Aura Theme
            </p>
            <div className="flex flex-wrap gap-2">
              {THEME_GRADIENTS.map((thm, i) => (
                <button
                  key={thm.name}
                  onClick={() => setActiveThemeIdx(i)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    activeThemeIdx === i
                      ? 'bg-white/15 border-white/30 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${thm.bg}`} />
                  <span>{thm.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid of Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total XP */}
        <div className="bg-[#141622] border border-white/10 rounded-3xl p-4 sm:p-5 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-yellow-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Total XP</span>
            <Zap size={16} className="fill-yellow-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white tabular-nums">{xp}</p>
          <span className="text-[10px] text-white/40 block">Cumulative mastery</span>
        </div>

        {/* Weekly XP */}
        <div className="bg-[#141622] border border-white/10 rounded-3xl p-4 sm:p-5 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Weekly XP</span>
            <Trophy size={16} />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white tabular-nums">{weeklyXp || 0}</p>
          <span className="text-[10px] text-white/40 block">This week's score</span>
        </div>

        {/* Day Streak */}
        <div className="bg-[#141622] border border-white/10 rounded-3xl p-4 sm:p-5 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-orange-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Daily Streak</span>
            <Flame size={16} className="fill-orange-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white tabular-nums">{streak} Days</p>
          <span className="text-[10px] text-white/40 block">Continuous study</span>
        </div>

        {/* Lessons Completed */}
        <div className="bg-[#141622] border border-white/10 rounded-3xl p-4 sm:p-5 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-sky-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Lessons</span>
            <BookOpen size={16} />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white tabular-nums">{completedCount}</p>
          <span className="text-[10px] text-white/40 block">{completionPercentage}% of syllabus</span>
        </div>
      </div>

      {/* Level XP Mastery Progress Card */}
      <div className="bg-gradient-to-br from-[#161824] to-[#12131C] border border-sky-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center text-amber-950 shadow-md shrink-0">
              <Sparkles size={20} className="fill-amber-950" />
            </div>
            <div>
              <h3 className="font-black text-white text-base leading-none">
                Level {level} Progress
              </h3>
              <p className="text-white/40 text-xs mt-1">
                {currentTitle.desc}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-base font-black text-sky-400 tabular-nums">
              {xpIntoLevel} <span className="text-white/40 text-xs">/ 1,000 XP</span>
            </span>
            <p className="text-[10px] font-bold text-white/40 uppercase">
              {xpNeededForNext} XP to Level {level + 1}
            </p>
          </div>
        </div>

        <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      </div>

      {/* Membership & Subscription Status Card */}
      <div className="bg-[#141622] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-lg shrink-0 ${
            subscriptionTier === 'pro' 
              ? 'bg-gradient-to-tr from-amber-400 to-yellow-400 text-amber-950' 
              : subscriptionTier === 'student_plus'
              ? 'bg-gradient-to-tr from-emerald-400 to-teal-400 text-emerald-950'
              : 'bg-white/10 text-white/70'
          }`}>
            {subscriptionTier === 'pro' ? <Crown size={24} className="fill-amber-950" /> : subscriptionTier === 'student_plus' ? <Zap size={24} className="fill-emerald-950" /> : <Shield size={24} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-white text-base">
                {subscriptionTier === 'pro' ? 'CodeQuest PRO VIP Plan' : subscriptionTier === 'student_plus' ? 'StudentPlus Membership' : 'Basic Free Plan'}
              </h4>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                subscriptionTier === 'pro' 
                  ? 'bg-amber-400 text-amber-950' 
                  : subscriptionTier === 'student_plus'
                  ? 'bg-emerald-400 text-emerald-950'
                  : 'bg-white/10 text-white/60'
              }`}>
                {subscriptionTier === 'pro' ? 'Active PRO' : subscriptionTier === 'student_plus' ? `Active (${unlockedCount}/${maxAllowedTracks} Tracks)` : 'Free Tier'}
              </span>
            </div>
            <p className="text-white/60 text-xs mt-0.5">
              {subscriptionTier === 'pro' 
                ? 'All 6 Career Tracks • Infinite Hearts • 2X Double XP' 
                : subscriptionTier === 'student_plus'
                ? 'Infinite Hearts • 1.5X XP Boost • Unlocked Advanced Paths'
                : 'Standard 5 Hearts • 12m Heart Refill • Core Curriculum'}
            </p>
          </div>
        </div>

        {onOpenSubscription && (
          <button
            onClick={onOpenSubscription}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shrink-0 flex items-center gap-1.5 ${
              subscriptionTier === 'basic' || !subscriptionTier
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-emerald-950 hover:brightness-110'
                : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
            }`}
          >
            <Crown size={14} className={subscriptionTier === 'basic' || !subscriptionTier ? 'fill-emerald-950' : 'text-amber-400'} />
            <span>{subscriptionTier === 'basic' || !subscriptionTier ? 'Upgrade Plan' : 'Manage Subscription'}</span>
          </button>
        )}
      </div>

      {/* Achievements & Badges Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Award size={20} className="text-yellow-400" />
            <span>Academy Badges</span>
          </h3>

          <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl">
            <button
              onClick={() => setBadgeFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                badgeFilter === 'all' ? 'bg-white/15 text-white shadow' : 'text-white/40 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setBadgeFilter('unlocked')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                badgeFilter === 'unlocked' ? 'bg-white/15 text-white shadow' : 'text-white/40 hover:text-white'
              }`}
            >
              Unlocked
            </button>
            <button
              onClick={() => setBadgeFilter('locked')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                badgeFilter === 'locked' ? 'bg-white/15 text-white shadow' : 'text-white/40 hover:text-white'
              }`}
            >
              Locked
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-3xl border transition-all flex flex-col justify-between ${
                badge.unlocked
                  ? `bg-gradient-to-br ${badge.color} shadow-lg`
                  : 'bg-white/[0.02] border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-inner shrink-0 ${
                  badge.unlocked ? 'bg-black/40 border border-white/15' : 'bg-white/5 border border-white/5'
                }`}>
                  {badge.unlocked ? badge.icon : <Lock size={20} className="text-white/30" />}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{badge.title}</h4>
                  <p className="text-white/50 text-xs mt-0.5 leading-relaxed">{badge.desc}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                <span className="text-white/40">{badge.progress}</span>
                <span className="text-yellow-400">+{badge.xpReward} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
