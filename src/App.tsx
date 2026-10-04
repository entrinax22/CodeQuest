import React, { useState, useEffect } from 'react';
import { 
  Heart, Zap, Trophy, User, Users, BookOpen, Code, Settings, Loader2, 
  Lock, Check, Flame, ChevronRight, AlertCircle, Sparkles, CheckCircle2, ShoppingBag,
  Layers, ChevronDown, ArrowLeft, Crown, Infinity, Volume2, VolumeX, ShieldCheck
} from 'lucide-react';
import { useGameStore } from './store/useGameStore';
import { supabase } from './lib/supabase';
import { sounds } from './lib/sound';
import LessonPlayer from './components/LessonPlayer';
import Auth from './components/Auth';
import SocialTab from './components/SocialTab';
import LeaderboardTab from './components/LeaderboardTab';
import NoHeartsModal from './components/NoHeartsModal';
import PracticeSession from './components/PracticeSession';
import ProfileTab from './components/ProfileTab';
import SettingsTab from './components/SettingsTab';
import SubscriptionModal from './components/SubscriptionModal';
import { Lesson, Module } from './data/curriculum';
import { HEART_REFILL_INTERVAL_MS, PRACTICE_COOLDOWN_MS, MAX_HEARTS } from './store/useGameStore';
import TopicPreviewModal from './components/TopicPreviewModal';
import CurriculumHandbookModal from './components/CurriculumHandbookModal';
import LearningPathSelectorModal from './components/LearningPathSelectorModal';
import LearningPathsHub from './components/LearningPathsHub';
import SplashScreen from './components/SplashScreen';
import DebugConsoleModal from './components/DebugConsoleModal';
import { getPathModules, getPathMeta, PATHS_METADATA, isModuleUnlockedForUser, isPathUnlockedForUser } from './data/learningPaths';

export default function App() {
  const { 
    xp, hearts, streak, level, syncWithSupabase, isSyncing, 
    buyHeartRefill, buyStreakFreeze, completedLessons, completeLesson,
    lastHeartLostAt, lastPracticeAt, checkHeartRefill, avatarIcon, username,
    streakFreezesCount, doubleXpUntil, buyDoubleXpBoost,
    activePathId, setActivePath, isPro, subscriptionTier,
    unlockedAdvancedPathId, unlockedAdvancedPathIds, setStudentPlusAdvancedPath,
    soundEnabled, toggleSound
  } = useGameStore();

  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'learn' | 'leaderboard' | 'shop' | 'social' | 'profile' | 'settings'>('learn');
  const [learnView, setLearnView] = useState<'paths' | 'roadmap'>('paths');
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [lessonInitialMode, setLessonInitialMode] = useState<'briefing' | 'exercises'>('briefing');
  const [selectedTopicInfo, setSelectedTopicInfo] = useState<{ lesson: Lesson; moduleTitle: string; isCompleted: boolean; isAdvancedLocked?: boolean; isSequentialLocked?: boolean } | null>(null);
  const [showHandbookModal, setShowHandbookModal] = useState<boolean>(false);
  const [showPathSelectorModal, setShowPathSelectorModal] = useState<boolean>(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  const [session, setSession] = useState<any>(null);
  const [lockedToast, setLockedToast] = useState<string | null>(null);
  const [heartRefillToast, setHeartRefillToast] = useState<string | null>(null);
  const [showHeartsModal, setShowHeartsModal] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);
  const [heartTimerFormatted, setHeartTimerFormatted] = useState<string>('');
  const [practiceCdMs, setPracticeCdMs] = useState<number>(0);
  const prevHeartsRef = React.useRef(hearts);

  // Detect when hearts increase and show celebratory banner
  useEffect(() => {
    if (hearts > prevHeartsRef.current && prevHeartsRef.current < MAX_HEARTS) {
      const added = hearts - prevHeartsRef.current;
      setHeartRefillToast(`+${added} Heart Refilled! (${hearts}/${MAX_HEARTS} Hearts)`);
      const timer = setTimeout(() => setHeartRefillToast(null), 3500);
      return () => clearTimeout(timer);
    }
    prevHeartsRef.current = hearts;
  }, [hearts]);

  // Continuous heart refill & practice cooldown checker
  useEffect(() => {
    const tick = () => {
      checkHeartRefill();
      const state = useGameStore.getState();

      if (state.lastPracticeAt) {
        const pElapsed = Date.now() - Number(state.lastPracticeAt);
        const pRemaining = Math.max(0, PRACTICE_COOLDOWN_MS - pElapsed);
        setPracticeCdMs(pRemaining);
      } else {
        setPracticeCdMs(0);
      }

      if (state.hearts >= MAX_HEARTS) {
        setHeartTimerFormatted('');
        return;
      }
      const startTime = state.lastHeartLostAt ? Number(state.lastHeartLostAt) : Date.now();
      const elapsed = Math.max(0, Date.now() - startTime);
      const remainder = Math.max(0, HEART_REFILL_INTERVAL_MS - (elapsed % HEART_REFILL_INTERVAL_MS));
      const m = Math.floor(remainder / 60000);
      const s = Math.floor((remainder % 60000) / 1000);
      setHeartTimerFormatted(`${m}:${s.toString().padStart(2, '0')}`);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [checkHeartRefill]);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        syncWithSupabase(session.user.id);
      } else {
        useGameStore.getState().resetStore();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'SIGNED_OUT' || !session) {
        useGameStore.getState().resetStore();
      } else if (session?.user) {
        syncWithSupabase(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [syncWithSupabase]);

  // Listen for admin subscription approval event in real-time
  useEffect(() => {
    const handleApproval = (e: any) => {
      const payment = e.detail;
      if (payment && payment.username === username) {
        useGameStore.getState().upgradeToPro(payment.tier, payment.cycle);
        setLockedToast(`PRO plan approved! Enjoy full access 🎉`);
        if (session?.user) syncWithSupabase(session.user.id);
      }
    };
    window.addEventListener('codequest_subscription_approved', handleApproval);
    return () => window.removeEventListener('codequest_subscription_approved', handleApproval);
  }, [username, session, syncWithSupabase]);

  // Auto-dismiss locked toast
  useEffect(() => {
    if (lockedToast) {
      const timer = setTimeout(() => setLockedToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [lockedToast]);

  if (!supabase) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-black text-white">Setup Required</h1>
          <p className="text-white/50">
            Please add your Supabase credentials to the <span className="text-blue-500 font-bold">Secrets</span> panel in the AI Studio UI:
          </p>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-left font-mono text-xs text-blue-400 space-y-2">
            <div>VITE_SUPABASE_URL</div>
            <div>VITE_SUPABASE_ANON_KEY</div>
          </div>
          <p className="text-xs text-white/30 italic">
            You can find these in your Supabase Project Settings &gt; API.
          </p>
        </div>
      </div>
    );
  }

  const handleSplashFinish = React.useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (!session) {
    return <Auth />;
  }

  if (isPracticing) {
    return (
      <PracticeSession
        onExit={() => setIsPracticing(false)}
        onSuccess={() => setIsPracticing(false)}
      />
    );
  }

  if (currentLesson) {
    return (
      <LessonPlayer 
        lesson={currentLesson} 
        initialMode={lessonInitialMode}
        onExit={() => setCurrentLesson(null)} 
        onComplete={async (lessonId) => {
          await completeLesson(lessonId);
        }}
      />
    );
  }

  // Active learning track modules and metadata
  const activeModules = getPathModules(activePathId);
  const currentPathMeta = getPathMeta(activePathId);
  const allLessons = activeModules.flatMap(m => m.lessons);
  const activeGlobalIndex = allLessons.findIndex(l => !completedLessons.includes(l.id));

  const currentPathDoneCount = allLessons.filter(l => completedLessons.includes(l.id)).length;
  const currentPathProgressPercent = allLessons.length > 0 
    ? Math.round((currentPathDoneCount / allLessons.length) * 100) 
    : 0;

  // Offset patterns for the snake path (winding left and right)
  const snakeOffsets = [0, -35, -55, -35, 0, 35, 55, 35];

  const xpIntoCurrentLevel = xp % 1000;
  const levelProgressPercent = Math.min(100, Math.round((xpIntoCurrentLevel / 1000) * 100));

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-sky-500/30 overflow-hidden">
      {/* Top Header Navigation & Stats HUD */}
      <header className="h-14 sm:h-16 px-3 sm:px-6 md:px-8 border-b border-slate-800 bg-[#0F172A] text-white sticky top-0 z-30 flex items-center justify-between gap-2 sm:gap-4 shadow-md w-full select-none">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white font-black shadow-md shadow-sky-950/30 shrink-0">
            <Code size={16} className="stroke-[2.5]" />
          </div>
          <span className="font-black text-sm sm:text-base tracking-tight text-white hidden sm:inline">
            CodeQuest
          </span>
        </div>

        {/* Minimalist Stats Capsule */}
        <div className="flex items-center bg-[#1E293B] border border-slate-700 rounded-full px-2 py-1 gap-1 sm:gap-1.5 shadow-inner shrink min-w-0">
          {/* Streak Stat */}
          <div 
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-xs font-bold text-amber-300 cursor-default"
            title={`${streak} Day Continuous Coding Streak`}
          >
            <Flame size={13} className="text-amber-400 fill-amber-400 shrink-0" />
            <span className="tabular-nums font-black text-[11px] sm:text-xs">{streak}</span>
          </div>

          <div className="w-px h-3.5 bg-white/10 shrink-0" />

          {/* XP Stat */}
          <div 
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-xs font-bold text-yellow-300 cursor-default"
            title={`${xp} Total XP Earned`}
          >
            <Zap size={13} className="text-yellow-400 fill-yellow-400 shrink-0" />
            <span className="tabular-nums font-black text-[11px] sm:text-xs">{xp}</span>
            {doubleXpUntil && Date.now() < doubleXpUntil && (
              <span className="text-[8px] font-black text-yellow-300 bg-yellow-500/25 px-1 py-0.2 rounded border border-yellow-400/40 animate-pulse leading-none">
                2X
              </span>
            )}
          </div>

          <div className="w-px h-3.5 bg-white/10 shrink-0" />

          {/* Hearts & Live Refill Timer */}
          <button 
            onClick={() => setShowHeartsModal(true)}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            title="Heart health & refill timer"
          >
            {isPro ? (
              <Infinity size={13} className="text-rose-400 shrink-0" />
            ) : (
              <>
                <Heart size={13} className="text-rose-500 fill-rose-500 shrink-0" />
                <span className="tabular-nums font-black text-[11px] sm:text-xs">{hearts}</span>
              </>
            )}
            {!isPro && hearts < MAX_HEARTS && heartTimerFormatted && (
              <span className="text-[9px] font-mono font-bold text-rose-300 bg-rose-500/20 px-1 rounded leading-none hidden xs:inline">
                {heartTimerFormatted}
              </span>
            )}
          </button>

          <div className="w-px h-3.5 bg-white/10 shrink-0" />

          {/* SaaS Pro / Plus Pill */}
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
              subscriptionTier === 'pro'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30'
                : subscriptionTier === 'student_plus'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
            title="Manage or upgrade membership"
          >
            {subscriptionTier === 'pro' ? (
              <>
                <Crown size={11} className="fill-amber-400" />
                <span>PRO</span>
              </>
            ) : subscriptionTier === 'student_plus' ? (
              <>
                <Zap size={11} className="fill-emerald-400" />
                <span>PLUS</span>
              </>
            ) : (
              <>
                <Sparkles size={11} className="text-yellow-400 fill-yellow-400" />
                <span>GET PRO</span>
              </>
            )}
          </button>
        </div>

        {/* Right Actions: Sound & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={toggleSound}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition-all cursor-pointer"
            title={soundEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} className="text-white/30" />}
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 p-1 sm:pr-2 rounded-xl transition-all cursor-pointer border ${
              activeTab === 'profile' 
                ? 'bg-sky-500/20 border-sky-400/50' 
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700'
            }`}
            title="Profile & Level"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-xs shadow-inner">
              {avatarIcon || '👾'}
            </div>
            <span className="text-[11px] font-black text-white hidden sm:inline">
              Lv.{level}
            </span>
          </button>
        </div>
      </header>

      {/* Full-width Responsive Rectangular Toast Notification for Heart Refills */}
      {heartRefillToast && (
        <div className="fixed top-16 left-2 right-2 sm:left-4 sm:right-4 md:max-w-3xl md:mx-auto z-50 bg-[#1A1118]/98 text-rose-200 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xl font-bold text-xs sm:text-sm flex items-center justify-between gap-3 border border-rose-500/40 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200 leading-snug">
          <div className="flex items-center gap-2.5 min-w-0">
            <Heart size={18} className="text-rose-400 fill-rose-500 shrink-0" />
            <span className="whitespace-normal break-words">{heartRefillToast}</span>
          </div>
          <button onClick={() => setHeartRefillToast(null)} className="text-rose-300/60 hover:text-rose-200 text-xs font-bold shrink-0 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Full-width Responsive Rectangular Toast Notification for System Alerts / Unlocks */}
      {lockedToast && (
        <div className="fixed top-16 left-2 right-2 sm:left-4 sm:right-4 md:max-w-3xl md:mx-auto z-50 bg-[#181926]/98 text-sky-200 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xl font-bold text-xs sm:text-sm flex items-center justify-between gap-3 border border-sky-400/40 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200 leading-snug">
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertCircle size={18} className="text-sky-400 shrink-0" />
            <span className="whitespace-normal break-words">{lockedToast}</span>
          </div>
          <button onClick={() => setLockedToast(null)} className="text-sky-300/60 hover:text-sky-200 text-xs font-bold shrink-0 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-28 px-4 sm:px-6">
        {activeTab === 'learn' && learnView === 'paths' && (
          <LearningPathsHub
            onSelectPath={(pathId) => {
              setActivePath(pathId);
              setLearnView('roadmap');
            }}
            activePathId={activePathId}
            completedLessons={completedLessons}
            streak={streak}
            xp={xp}
            onOpenHandbook={() => setShowHandbookModal(true)}
            onOpenSubscription={() => setShowSubscriptionModal(true)}
          />
        )}

        {activeTab === 'learn' && learnView === 'roadmap' && (
          <div className="max-w-xl md:max-w-2xl mx-auto py-6 sm:py-8">
            {/* Back to Paths & Switch Track Header */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <button
                onClick={() => setLearnView('paths')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-sm group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-slate-500" />
                <span>All Learning Paths</span>
              </button>

              <button
                onClick={() => setShowPathSelectorModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
              >
                <Layers size={14} />
                <span>Switch Track</span>
              </button>
            </div>

            {/* Active Learning Track Selector Banner */}
            <div className={`bg-gradient-to-br ${currentPathMeta.colorTheme.gradient} border ${currentPathMeta.colorTheme.border} rounded-3xl p-5 mb-6 shadow-sm relative overflow-hidden transition-all group`}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl filter drop-shadow-md">{currentPathMeta.iconEmoji}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${currentPathMeta.colorTheme.badge}`}>
                        {currentPathMeta.tag} Track
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {currentPathMeta.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                      {currentPathMeta.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setShowPathSelectorModal(true)}
                  className="px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 border border-slate-200 active:scale-95 shadow-sm shrink-0 cursor-pointer"
                >
                  <Layers size={13} className="text-slate-500" />
                  <span>Switch Track</span>
                </button>
              </div>

              <p className="text-slate-600 text-xs mb-3 font-normal">
                {currentPathMeta.description}
              </p>

              {/* Path Progress Bar */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1 font-bold">
                  <span className="text-slate-500">Curriculum Progress</span>
                  <span className={currentPathMeta.colorTheme.accent}>
                    {currentPathDoneCount} / {allLessons.length} Lessons ({currentPathProgressPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden p-0.5 border border-slate-300/10">
                  <div
                    className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${currentPathMeta.colorTheme.bar}`}
                    style={{ width: `${currentPathProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Interactive Theory Handbook & Cheatsheet Banner */}
            <div className="bg-white border border-slate-200 hover:border-sky-400/40 rounded-3xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm transition-all group">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-105 transition-transform">
                  <BookOpen size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">Theory Handbook & Cheat Sheets</h3>
                    <span className="text-[10px] font-black uppercase text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full border border-sky-200">
                      {allLessons.length} Topics
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Browse full lesson guides, code cheat sheets, and live browser previews
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHandbookModal(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer shadow-sm"
              >
                <span>Read Guides</span>
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Modules Loop */}
            <div className="space-y-16">
              {activeModules.map((module) => {
                const totalModLessons = module.lessons.length;
                const completedModLessons = module.lessons.filter(l => completedLessons.includes(l.id)).length;
                const modProgress = Math.round((completedModLessons / totalModLessons) * 100);
                const theme = currentPathMeta.colorTheme;
                const isModuleAdvanceLocked = !isModuleUnlockedForUser(activePathId, module, subscriptionTier, unlockedAdvancedPathId, unlockedAdvancedPathIds);

                return (
                  <div key={module.id} className="w-full flex flex-col items-center">
                    {/* Vibrant Module Header Card */}
                    <div className={`w-full bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-3xl p-6 mb-12 shadow-sm relative overflow-hidden`}>
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${theme.badge}`}>
                            {module.subtitle}
                          </span>
                          
                          {module.isAdvanced && (
                            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm ${
                              isModuleAdvanceLocked 
                                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}>
                              {isModuleAdvanceLocked ? <Lock size={10} /> : <Crown size={10} className="fill-emerald-800" />}
                              <span>{isModuleAdvanceLocked ? 'Advance Locked' : 'Advance Unlocked'}</span>
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-bold text-slate-500">
                          {completedModLessons} / {totalModLessons} Done
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{module.title}</h3>
                      <p className="text-slate-600 text-xs mb-4">{module.description}</p>

                      {/* Progress Bar */}
                      <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden p-0.5 border border-slate-300/10">
                        <div 
                          className={`h-full bg-gradient-to-r ${theme.bar} rounded-full transition-all duration-500`}
                          style={{ width: `${modProgress}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Winding Snake Path with Trail (Connecting Trail Line Removed) */}
                    <div className="relative flex flex-col items-center gap-9 w-full py-2 overflow-x-hidden">

                      {module.lessons.map((lesson, lessonIdx) => {
                        // Find lesson global index
                        const globalIdx = allLessons.findIndex(l => l.id === lesson.id);
                        const isCompleted = completedLessons.includes(lesson.id);
                        
                        // Active is the first uncompleted lesson, OR if all completed, allow clicking any
                        const isActive = activeGlobalIndex === -1 ? false : globalIdx === activeGlobalIndex;
                        const isLocked = !isCompleted && !isActive;

                        // Horizontal winding snake curve offset
                        const xOffset = snakeOffsets[lessonIdx % snakeOffsets.length];

                        return (
                          <div 
                            key={lesson.id} 
                            className="transition-transform duration-300 flex flex-col items-center relative"
                            style={{ transform: `translateX(${xOffset}px)` }}
                          >
                            <LessonNode 
                              title={lesson.title}
                              description={lesson.description}
                              completed={isCompleted} 
                              active={isActive}
                              locked={isLocked || isModuleAdvanceLocked}
                              isBoss={lesson.isBoss}
                              onClick={() => {
                                setSelectedTopicInfo({
                                  lesson,
                                  moduleTitle: module.title,
                                  isCompleted,
                                  isAdvancedLocked: isModuleAdvanceLocked,
                                  isSequentialLocked: isLocked
                                });
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'social' && <SocialTab />}
        {activeTab === 'leaderboard' && <LeaderboardTab />}

        {activeTab === 'profile' && (
          <ProfileTab 
            session={session} 
            onStartPractice={() => setIsPracticing(true)}
            onGoToLearn={() => setActiveTab('learn')}
            onOpenSubscription={() => setShowSubscriptionModal(true)}
          />
        )}

        {activeTab === 'shop' && (
          <div className="max-w-2xl lg:max-w-3xl mx-auto py-6 sm:py-8 px-3 sm:px-6 pb-28 space-y-5 animate-in fade-in duration-300">
            {/* Header & Wallet Banner */}
            <div className="bg-[#12131C] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  Academy Vault
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">Shop & Power-Ups</h2>
                <p className="text-white/40 text-xs mt-0.5">Spend earned XP on streak shields and potions</p>
              </div>

              <div className="text-right bg-white/5 border border-white/10 px-3.5 py-2 rounded-2xl shrink-0">
                <div className="flex items-center gap-1.5 justify-end">
                  <Zap size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-lg sm:text-xl font-black text-yellow-300 tabular-nums">{xp}</span>
                </div>
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider block">XP Balance</span>
              </div>
            </div>
            
            {/* CodeQuest PRO / Plus Pass Hero Card */}
            <div className="bg-gradient-to-br from-[#1A1826] via-[#141420] to-[#0F1018] border border-amber-400/40 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                      <Crown size={10} className="fill-amber-400" />
                      <span>{isPro ? `${subscriptionTier.toUpperCase()} ACTIVE` : 'PREMIUM PASS'}</span>
                    </span>
                    <span className="text-xs font-bold text-amber-200/70">
                      {isPro ? 'All Features Active' : '₱49/mo Student Pricing'}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    CodeQuest Pass
                  </h3>

                  <p className="text-white/60 text-xs sm:text-sm max-w-lg leading-relaxed">
                    Unlimited Infinite Hearts, permanent 2X XP boost, advance track curriculum, and automatic monthly streak protection.
                  </p>
                </div>

                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-amber-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-950/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                >
                  <Sparkles size={14} className="fill-amber-950" />
                  <span>{isPro ? 'Manage Membership' : 'Upgrade Pass'}</span>
                </button>
              </div>

              {/* Quick Perks grid */}
              <div className="pt-3.5 mt-3.5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 relative z-10 text-center text-xs">
                <div className="bg-white/5 border border-white/5 p-2 rounded-xl">
                  <Infinity size={14} className="text-rose-400 mx-auto mb-0.5" />
                  <span className="text-[10px] font-bold text-white">Infinite Hearts</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-2 rounded-xl">
                  <Zap size={14} className="text-yellow-400 mx-auto mb-0.5" />
                  <span className="text-[10px] font-bold text-white">2X Turbo XP</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-2 rounded-xl">
                  <Layers size={14} className="text-sky-400 mx-auto mb-0.5" />
                  <span className="text-[10px] font-bold text-white">Advance Topics</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-2 rounded-xl">
                  <Crown size={14} className="text-amber-400 mx-auto mb-0.5" />
                  <span className="text-[10px] font-bold text-white">VIP Badge</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Heart Refill */}
              <div className="bg-[#12131C] rounded-2xl p-4 sm:p-5 border border-white/10 flex items-center justify-between group hover:border-rose-500/30 transition-all shadow-md">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-rose-500/15 rounded-xl flex items-center justify-center border border-rose-500/30 shrink-0">
                    <Heart size={22} className="text-rose-500 fill-rose-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Full Heart Refill</h3>
                    <p className="text-white/40 text-xs">Restore health back to full 5 hearts</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-rose-300 font-bold">Health: {hearts}/5</span>
                      {hearts < 5 && (
                        <span className="text-[10px] text-white/50 bg-white/5 border border-white/10 px-2 py-0.2 rounded-full">
                          1 heart refills every 12 mins
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={buyHeartRefill}
                  disabled={xp < 500 || hearts === 5}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer
                    ${xp >= 500 && hearts < 5 
                      ? 'bg-rose-600 hover:bg-rose-500 text-white active:translate-y-0.5' 
                      : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'}`}
                >
                  {hearts === 5 ? 'Full' : '500 XP'}
                </button>
              </div>

              {/* Streak Freeze */}
              <div className="bg-[#12131C] rounded-2xl p-4 sm:p-5 border border-white/10 flex items-center justify-between group hover:border-amber-500/30 transition-all shadow-md">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-amber-500/15 rounded-xl flex items-center justify-center border border-amber-500/30 shrink-0">
                    <Flame size={22} className="text-amber-400 fill-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm">Streak Freeze Shield</h3>
                      {(streakFreezesCount || 0) > 0 && (
                        <span className="text-[9px] font-black uppercase text-amber-300 bg-amber-500/20 px-2 py-0.2 rounded-full border border-amber-500/30">
                          {streakFreezesCount} Equipped
                        </span>
                      )}
                    </div>
                    <p className="text-white/40 text-xs">Protects your daily coding streak if you miss a day</p>
                  </div>
                </div>
                <button 
                  onClick={buyStreakFreeze}
                  disabled={xp < 1000}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer
                    ${xp >= 1000 
                      ? 'bg-amber-600 hover:bg-amber-500 text-white active:translate-y-0.5' 
                      : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'}`}
                >
                  1,000 XP
                </button>
              </div>

              {/* Double XP Booster */}
              <div className="bg-[#12131C] rounded-2xl p-4 sm:p-5 border border-white/10 flex items-center justify-between group hover:border-yellow-500/30 transition-all shadow-md">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-yellow-500/15 rounded-xl flex items-center justify-center border border-yellow-500/30 shrink-0">
                    <Sparkles size={22} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm">2X Double XP Potion</h3>
                      {doubleXpUntil && Date.now() < doubleXpUntil && (
                        <span className="text-[9px] font-black uppercase text-yellow-300 bg-yellow-500/25 px-2 py-0.2 rounded-full border border-yellow-500/40 animate-pulse">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-white/40 text-xs">Doubles all XP earned from lessons for 30 minutes</p>
                  </div>
                </div>
                <button 
                  onClick={buyDoubleXpBoost}
                  disabled={xp < 750 || Boolean(doubleXpUntil && Date.now() < doubleXpUntil)}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer
                    ${xp >= 750 && (!doubleXpUntil || Date.now() >= doubleXpUntil)
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 active:translate-y-0.5 font-black' 
                      : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'}`}
                >
                  {doubleXpUntil && Date.now() < doubleXpUntil ? 'Active' : '750 XP'}
                </button>
              </div>

              {/* Free Practice Arena */}
              <div className="bg-[#12131C] rounded-2xl p-4 sm:p-5 border border-sky-500/20 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">Low on XP? Practice for Free</h3>
                  <p className="text-white/40 text-xs mt-0.5">Solve interactive challenges in the Practice Arena to earn free hearts</p>
                </div>
                <button
                  onClick={() => setIsPracticing(true)}
                  disabled={practiceCdMs > 0}
                  className={`px-3.5 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all shrink-0 ${
                    practiceCdMs === 0
                      ? 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-400/30 active:scale-95 cursor-pointer'
                      : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                  }`}
                >
                  {practiceCdMs > 0
                    ? `Cooldown (${Math.floor(practiceCdMs / 60000)}:${Math.floor((practiceCdMs % 60000) / 1000).toString().padStart(2, '0')})`
                    : 'Practice'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <SettingsTab 
            session={session} 
            onGoToProfile={() => setActiveTab('profile')}
            onOpenSubscription={() => setShowSubscriptionModal(true)}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Dock (Responsive Centered Pill on Desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-lg sm:rounded-3xl sm:border sm:border-white/10 sm:shadow-[0_10px_35px_rgba(0,0,0,0.8)] h-16 sm:h-20 bg-[#0C0D14]/95 border-t border-white/10 px-2 sm:px-6 flex items-center justify-around z-30 backdrop-blur-xl">
        <NavButton active={activeTab === 'learn'} icon={<BookOpen />} label="Learn" onClick={() => { setActiveTab('learn'); setLearnView('paths'); }} />
        <NavButton active={activeTab === 'social'} icon={<Users />} label="Friends" onClick={() => setActiveTab('social')} />
        <NavButton active={activeTab === 'leaderboard'} icon={<Trophy />} label="Leagues" onClick={() => setActiveTab('leaderboard')} />
        <NavButton active={activeTab === 'shop'} icon={<ShoppingBag />} label="Shop" onClick={() => setActiveTab('shop')} />
        <NavButton active={activeTab === 'settings'} icon={<Settings />} label="Settings" onClick={() => setActiveTab('settings')} />
      </nav>

      {/* Topic Preview & Learning Hub Modal */}
      <TopicPreviewModal
        isOpen={Boolean(selectedTopicInfo)}
        onClose={() => setSelectedTopicInfo(null)}
        lesson={selectedTopicInfo?.lesson || null}
        moduleTitle={selectedTopicInfo?.moduleTitle || ''}
        isCompleted={Boolean(selectedTopicInfo?.isCompleted)}
        hearts={hearts}
        isAdvancedLocked={Boolean(selectedTopicInfo?.isAdvancedLocked)}
        isSequentialLocked={Boolean(selectedTopicInfo?.isSequentialLocked)}
        isStudentPlus={subscriptionTier === 'student_plus'}
        onUnlockAdvance={async () => {
          const success = await setStudentPlusAdvancedPath(activePathId);
          setSelectedTopicInfo(null);
          if (!success) {
            setShowSubscriptionModal(true);
          }
        }}
        onStartTheory={(lesson) => {
          setSelectedTopicInfo(null);
          setLessonInitialMode('briefing');
          setCurrentLesson(lesson);
        }}
        onStartQuiz={(lesson) => {
          if (hearts <= 0 && !isPro) {
            setSelectedTopicInfo(null);
            setShowHeartsModal(true);
          } else {
            setSelectedTopicInfo(null);
            setLessonInitialMode('exercises');
            setCurrentLesson(lesson);
          }
        }}
      />

      {/* Curriculum Handbook & Theory Library Modal */}
      <CurriculumHandbookModal
        isOpen={showHandbookModal}
        onClose={() => setShowHandbookModal(false)}
        completedLessons={completedLessons}
        activePathId={activePathId}
        subscriptionTier={subscriptionTier}
        unlockedAdvancedPathId={unlockedAdvancedPathId}
        unlockedAdvancedPathIds={unlockedAdvancedPathIds}
        onOpenSubscription={() => setShowSubscriptionModal(true)}
        onUnlockAdvanceTrack={async (pathId) => {
          const success = await setStudentPlusAdvancedPath(pathId);
          if (!success) {
            setShowSubscriptionModal(true);
          }
        }}
        onSelectLesson={(lesson, mode) => {
          setShowHandbookModal(false);
          setLessonInitialMode(mode);
          if (mode === 'exercises' && hearts <= 0 && !isPro) {
            setShowHeartsModal(true);
          } else {
            setCurrentLesson(lesson);
          }
        }}
      />

      {/* Learning Path Selector Modal */}
      <LearningPathSelectorModal
        isOpen={showPathSelectorModal}
        onClose={() => setShowPathSelectorModal(false)}
        activePathId={activePathId}
        onSelectPath={(pathId) => {
          setActivePath(pathId);
          setLearnView('roadmap');
          setShowPathSelectorModal(false);
        }}
        completedLessons={completedLessons}
        onOpenSubscription={() => setShowSubscriptionModal(true)}
      />

      {/* No Hearts / Refill Modal */}
      <NoHeartsModal
        isOpen={showHeartsModal}
        onClose={() => setShowHeartsModal(false)}
        onStartPractice={() => {
          setShowHeartsModal(false);
          setIsPracticing(true);
        }}
        onOpenSubscription={() => setShowSubscriptionModal(true)}
      />

      {/* SaaS Subscription Modal */}
      {showSubscriptionModal && (
        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
        />
      )}

      {/* Live In-App Debug Console Drawer (Admin Only) */}
      <DebugConsoleModal session={session} />
    </div>
  );
}

interface LessonNodeProps {
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
  locked: boolean;
  isBoss?: boolean;
  onClick: () => void;
}

function LessonNode({ title, description, completed, active, locked, isBoss, onClick }: LessonNodeProps) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center group relative focus:outline-none"
    >
      {/* 3D Chunky Node Button */}
      <div className={`
        relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-200 select-none
        ${completed 
          ? 'bg-gradient-to-b from-emerald-400 to-emerald-500 border-b-[6px] border-emerald-700 text-white shadow-[0_6px_0_rgb(4,120,87),0_10px_20px_rgba(16,185,129,0.3)] hover:brightness-110 active:translate-y-1 active:border-b-2' 
          : ''}
        ${active 
          ? 'bg-gradient-to-b from-sky-400 to-blue-600 border-b-[6px] border-blue-800 text-white scale-110 shadow-[0_6px_0_rgb(30,58,138),0_14px_28px_rgba(14,165,233,0.45)] ring-4 ring-sky-400/40 active:translate-y-1 active:border-b-2 animate-pulse' 
          : ''}
        ${locked 
          ? 'bg-[#181920] border-b-[6px] border-[#101117] text-white/25 hover:bg-[#20212b] active:scale-95' 
          : ''}
        ${isBoss && !locked 
          ? 'scale-125 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 border-b-[6px] border-amber-700 text-amber-950 ring-4 ring-amber-400/40 shadow-[0_6px_0_rgb(180,83,9),0_16px_32px_rgba(245,158,11,0.5)] active:translate-y-1 active:border-b-2' 
          : ''}
      `}>
        {completed ? (
          <Check size={32} className="stroke-[3.5] drop-shadow-sm" />
        ) : active ? (
          <Code size={30} className="stroke-[2.5]" />
        ) : isBoss ? (
          <Trophy size={30} className="fill-amber-950/20 stroke-[2.5]" />
        ) : (
          <Lock size={22} className="stroke-[2]" />
        )}

        {/* Duolingo style "START" or "NEXT UP" Tooltip */}
        {active && (
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap shadow-[0_4px_12px_rgba(14,165,233,0.5)] border border-sky-300/40 flex items-center gap-1.5 animate-bounce">
            <Sparkles size={13} className="text-yellow-300 fill-yellow-300" />
            <span>Next Up</span>
          </div>
        )}
      </div>

      {/* Label under node */}
      <div className="mt-2.5 text-center max-w-[130px]">
        <span className={`text-xs font-black uppercase tracking-tight block ${
          active 
            ? 'text-sky-600' 
            : completed 
              ? 'text-emerald-600' 
              : 'text-slate-400'
        }`}>
          {title}
        </span>
      </div>
    </button>
  );
}

function NavButton({ 
  active, 
  icon, 
  label, 
  onClick,
  customAvatar 
}: { 
  active: boolean; 
  icon: React.ReactElement<any>; 
  label: string; 
  onClick: () => void;
  customAvatar?: string;
}) {
  return (
    <button 
      onClick={() => {
        sounds.playClick();
        onClick();
      }}
      className={`flex flex-col items-center gap-1 transition-all py-1 px-2.5 sm:px-3 rounded-2xl cursor-pointer ${
        active 
          ? 'text-sky-400 bg-sky-500/15 border border-sky-400/30 scale-105 shadow-[0_0_15px_rgba(56,189,248,0.25)]' 
          : 'text-white/40 hover:text-white/80 hover:bg-white/5'
      }`}
    >
      {customAvatar ? (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
          active ? 'ring-2 ring-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)] scale-110' : 'opacity-80'
        }`}>
          {customAvatar}
        </div>
      ) : (
        React.cloneElement(icon, { size: 22, className: active ? 'fill-sky-500/20' : '' })
      )}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}
