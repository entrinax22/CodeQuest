import React from 'react';
import { 
  ArrowRight, Sparkles, BookOpen, Trophy, CheckCircle2, 
  Layers, Code, ChevronRight, Flame, Zap, Crown, Lock, Check,
  Sliders, Star, Award
} from 'lucide-react';
import { PATHS_METADATA, PathMeta, getPathModules, isPathUnlockedForUser } from '../data/learningPaths';
import { useGameStore } from '../store/useGameStore';
import { sounds } from '../lib/sound';

interface LearningPathsHubProps {
  onSelectPath: (pathId: string) => void;
  activePathId: string;
  completedLessons: string[];
  streak: number;
  xp: number;
  onOpenHandbook: () => void;
  onOpenSubscription?: () => void;
}

export default function LearningPathsHub({
  onSelectPath,
  activePathId,
  completedLessons,
  streak,
  xp,
  onOpenHandbook,
  onOpenSubscription
}: LearningPathsHubProps) {
  const { subscriptionTier, unlockedAdvancedPathId, studentPlusPathLocked, setStudentPlusAdvancedPath } = useGameStore();

  const isStudentPlus = subscriptionTier === 'student_plus';
  const isPro = subscriptionTier === 'pro';
  const hasChosenAdvanced = isStudentPlus && studentPlusPathLocked && unlockedAdvancedPathId !== 'web-dev';

  const handleSelectTrack = (path: PathMeta) => {
    const isUnlocked = isPathUnlockedForUser(path.id, subscriptionTier, unlockedAdvancedPathId);

    if (!isUnlocked) {
      if (isStudentPlus) {
        const { studentPlusPathLocked, unlockedAdvancedPathId: currentLocked } = useGameStore.getState();
        if (studentPlusPathLocked && currentLocked !== 'web-dev' && currentLocked !== path.id) {
          sounds.playWrong();
          const lockedMeta = PATHS_METADATA.find(p => p.id === currentLocked);
          alert(`Your StudentPlus subscription includes 1 permanent advanced path choice. Your account is permanently locked to "${lockedMeta?.title || currentLocked}". Upgrade to CodeQuest PRO to unlock all 6 tracks simultaneously!`);
          return;
        }

        setStudentPlusAdvancedPath(path.id);
        onSelectPath(path.id);
        return;
      }
      if (onOpenSubscription) {
        onOpenSubscription();
      }
      return;
    }

    sounds.playCorrect();
    onSelectPath(path.id);
  };

  return (
    <div className="max-w-4xl lg:max-w-5xl mx-auto py-6 sm:py-8 space-y-6 sm:space-y-8 text-left animate-in fade-in duration-300">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-500/15 via-indigo-600/15 to-purple-600/15 border border-sky-500/25 rounded-3xl p-5 sm:p-7 shadow-xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <Sparkles size={30} className="fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-black uppercase text-sky-400 bg-sky-500/20 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                  CodeQuest Academy
                </span>
                
                {isPro ? (
                  <span className="text-[10px] font-black uppercase bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                    <Crown size={11} className="fill-amber-950" />
                    <span>All Advanced Tracks Unlocked</span>
                  </span>
                ) : isStudentPlus ? (
                  <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Zap size={11} className="fill-emerald-400" />
                    <span>StudentPlus: 1 Advanced Track Choice</span>
                  </span>
                ) : (
                  <span className="text-white/40 text-xs">• 6 Career Paths</span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                Choose Your Learning Path
              </h1>
              <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-xl">
                {isStudentPlus 
                  ? "As a StudentPlus scholar, choose 1 advanced path to have permanently unlocked for your subscription."
                  : isPro 
                  ? "As a PRO member, all core and advanced software engineering paths are 100% unlocked."
                  : "Explore free core curriculum paths or upgrade to unlock advanced engineering tracks."}
              </p>
            </div>
          </div>

          <div className="flex items-center sm:flex-col gap-2 shrink-0">
            <div className="text-[11px] font-black uppercase text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3.5 py-1.5 rounded-2xl whitespace-nowrap flex items-center gap-1.5 shadow-sm">
              <Flame size={14} className="fill-amber-400" />
              <span>{streak} Day Streak</span>
            </div>
            <div className="text-[11px] font-black uppercase text-yellow-300 bg-yellow-500/15 border border-yellow-500/30 px-3.5 py-1.5 rounded-2xl whitespace-nowrap flex items-center gap-1.5 shadow-sm">
              <Zap size={14} className="fill-yellow-400" />
              <span>{xp} Total XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Theory Handbook & Cheat Sheet Quick Banner */}
      <div className="bg-gradient-to-r from-sky-500/10 via-blue-600/10 to-indigo-600/10 border border-sky-500/20 hover:border-sky-400/40 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg transition-all group backdrop-blur-sm">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white leading-tight">Theory Handbook & Cheat Sheets</h3>
              <span className="text-[10px] font-black uppercase text-sky-400 bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-400/30">
                78 Topics
              </span>
            </div>
            <p className="text-white/60 text-xs mt-0.5">
              Browse complete lesson guides, code cheat sheets, and live browser previews across all paths
            </p>
          </div>
        </div>
        <button
          onClick={onOpenHandbook}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/40 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer shadow-sm"
        >
          <span>Read Guides</span>
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Learning Paths List / Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-widest text-white/50">
            Available Learning Paths ({PATHS_METADATA.length})
          </h2>
          <span className="text-xs text-white/40">Switch tracks anytime with progress saved</span>
        </div>

        {/* 2-Column Responsive Grid on Tablets and Desktops */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {PATHS_METADATA.map((path: PathMeta) => {
            const modules = getPathModules(path.id);
            const pathLessons = modules.flatMap(m => m.lessons);
            const totalLessons = pathLessons.length;
            const doneLessons = pathLessons.filter(l => completedLessons.includes(l.id)).length;
            const progressPct = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;
            const isCompleted = progressPct === 100 && totalLessons > 0;
            const isCurrentActive = path.id === activePathId;

            const isUnlocked = isPathUnlockedForUser(path.id, subscriptionTier, unlockedAdvancedPathId);
            const isStudentPlusChosen = isStudentPlus && (unlockedAdvancedPathId || 'web-dev') === path.id;

            return (
              <div
                key={path.id}
                className={`relative p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between group overflow-hidden bg-gradient-to-br ${path.colorTheme.gradient} ${
                  isCurrentActive 
                    ? `${path.colorTheme.border} ring-2 ring-sky-400/40 shadow-xl` 
                    : `${path.colorTheme.border} hover:border-white/30 shadow-lg`
                }`}
              >
                {/* Subtle Background Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-colors" />

                <div>
                  {/* Top Row: Icon, Tag, Badge, Active Pill */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-3xl shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                        {path.iconEmoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${path.colorTheme.badge}`}>
                            {path.tag}
                          </span>
                          
                          {path.isAdvancedTrack ? (
                            <span className="text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Crown size={10} className="fill-amber-400" />
                              <span>Advance</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-white/50">
                              Core
                            </span>
                          )}

                          <span className="text-[10px] font-bold text-white/40">
                            {path.badge}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mt-1 group-hover:text-sky-300 transition-colors">
                          {path.title}
                        </h3>
                      </div>
                    </div>

                    {/* Status Pill */}
                    {isCompleted ? (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                        <CheckCircle2 size={12} />
                        <span>Completed</span>
                      </span>
                    ) : isCurrentActive ? (
                      <span className="bg-sky-500/20 text-sky-300 border border-sky-400/40 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                        <Sparkles size={12} />
                        <span>Active Path</span>
                      </span>
                    ) : isPro ? (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                        <Crown size={11} className="fill-amber-400" />
                        <span>PRO Unlocked</span>
                      </span>
                    ) : isStudentPlusChosen ? (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                        <Zap size={11} className="fill-emerald-400" />
                        <span>Advance Unlocked</span>
                      </span>
                    ) : isStudentPlus ? (
                      <span className="bg-white/10 text-white/70 border border-white/15 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                        <Sliders size={11} />
                        <span>Core Unlocked</span>
                      </span>
                    ) : (
                      <span className="bg-white/10 text-white/50 border border-white/10 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                        <span>Core Free</span>
                      </span>
                    )}
                  </div>

                  {/* Subtitle & Description */}
                  <div className="mb-4">
                    <div className="text-xs font-bold text-white/80 mb-1">
                      {path.subtitle}
                    </div>
                    <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                      {path.description}
                    </p>
                  </div>
                </div>

                {/* Progress & Action Button */}
                <div className="pt-4 border-t border-white/10 space-y-3 mt-auto">
                  {/* Progress Stats */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                      <span className="text-white/50">Curriculum Mastery</span>
                      <span className={isCurrentActive ? path.colorTheme.accent : 'text-white/80'}>
                        {doneLessons} / {totalLessons} Lessons ({progressPct}%)
                      </span>
                    </div>

                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${path.colorTheme.bar}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Continue / Select Track Button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSelectTrack(path)}
                      className={`flex-1 py-3 sm:py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer shadow-lg ${
                        isCurrentActive
                          ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-950/40'
                          : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                      }`}
                    >
                      <span>{isCurrentActive ? 'Continue Learning' : 'Explore Track'}</span>
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    {isStudentPlus && !isStudentPlusChosen && (
                      <button
                        onClick={() => {
                          setStudentPlusAdvancedPath(path.id);
                          onSelectPath(path.id);
                        }}
                        title="Unlock Advance Topics for this Path"
                        className="py-3 sm:py-3.5 px-3 rounded-2xl font-black text-[11px] uppercase tracking-wider bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Zap size={13} className="fill-emerald-400" />
                        <span>Set as 1-Track</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* StudentPlus Track Choice Card if user is on StudentPlus */}
      {isStudentPlus && (
        <div className="bg-gradient-to-r from-emerald-500/15 via-[#131722] to-teal-500/15 border border-emerald-400/30 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-400 text-emerald-950 flex items-center justify-center font-black shrink-0">
              <Zap size={22} className="fill-emerald-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-white">StudentPlus Active Track</h4>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  1 of 1 Selected
                </span>
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                Current unlocked advanced path: <strong className="text-emerald-300">{PATHS_METADATA.find(p => p.id === unlockedAdvancedPathId)?.title || 'Web Development'}</strong>. You can switch anytime or upgrade to PRO to unlock all!
              </p>
            </div>
          </div>

          {onOpenSubscription && (
            <button
              onClick={onOpenSubscription}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black text-xs uppercase tracking-wider shadow shrink-0 active:scale-95 cursor-pointer"
            >
              Unlock All with PRO
            </button>
          )}
        </div>
      )}

      {/* Friendly Bottom Note */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs text-white/40">
        All progress is automatically saved to your profile. Feel free to explore and learn across multiple paths!
      </div>
    </div>
  );
}
