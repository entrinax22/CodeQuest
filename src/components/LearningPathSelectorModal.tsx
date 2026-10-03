import React from 'react';
import { X, Check, ArrowRight, Sparkles, Trophy, BookOpen, Layers, Crown, Lock, Zap, Sliders } from 'lucide-react';
import { PATHS_METADATA, PathMeta, getPathModules, isPathUnlockedForUser } from '../data/learningPaths';
import { useGameStore } from '../store/useGameStore';
import { sounds } from '../lib/sound';

interface LearningPathSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePathId: string;
  onSelectPath: (pathId: string) => void;
  completedLessons: string[];
  onOpenSubscription?: () => void;
}

export default function LearningPathSelectorModal({
  isOpen,
  onClose,
  activePathId,
  onSelectPath,
  completedLessons,
  onOpenSubscription
}: LearningPathSelectorModalProps) {
  const { subscriptionTier, unlockedAdvancedPathId, unlockedAdvancedPathIds, studentPlusRenewalCount, setStudentPlusAdvancedPath } = useGameStore();

  if (!isOpen) return null;

  const isStudentPlus = subscriptionTier === 'student_plus';
  const isPro = subscriptionTier === 'pro';
  const maxAllowedTracks = 1 + studentPlusRenewalCount;
  const unlockedCount = unlockedAdvancedPathIds && unlockedAdvancedPathIds.length > 0 ? unlockedAdvancedPathIds.length : 1;

  const handleTrackClick = (path: PathMeta) => {
    const isUnlocked = isPathUnlockedForUser(path.id, subscriptionTier, unlockedAdvancedPathId, unlockedAdvancedPathIds);

    if (!isUnlocked) {
      if (isStudentPlus) {
        setStudentPlusAdvancedPath(path.id);
        onSelectPath(path.id);
        onClose();
        return;
      }
      if (onOpenSubscription) {
        onClose();
        onOpenSubscription();
      }
      return;
    }

    sounds.playCorrect();
    onSelectPath(path.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0C0D14] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-left text-white">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 bg-[#0E101A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">
              🚀
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white tracking-tight">Choose Your Learning Path</h2>
                {isPro ? (
                  <span className="text-[10px] font-black uppercase bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Crown size={10} className="fill-amber-950" />
                    <span>All Tracks Unlocked</span>
                  </span>
                ) : isStudentPlus ? (
                  <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Zap size={10} className="fill-emerald-400" />
                    <span>StudentPlus ({unlockedCount}/{maxAllowedTracks} Tracks Unlocked)</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase text-sky-400 bg-sky-500/20 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                    6 Career Tracks
                  </span>
                )}
              </div>
              <p className="text-white/60 text-xs sm:text-sm mt-0.5">
                Switch anytime! Your completed lessons and achievements are saved across all tracks.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Path Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PATHS_METADATA.map((path: PathMeta) => {
              const isActive = path.id === activePathId;
              const modules = getPathModules(path.id);
              const pathLessons = modules.flatMap(m => m.lessons);
              const totalLessons = pathLessons.length;
              const doneLessons = pathLessons.filter(l => completedLessons.includes(l.id)).length;
              const progressPct = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;

              const isUnlocked = isPathUnlockedForUser(path.id, subscriptionTier, unlockedAdvancedPathId);

              return (
                <div
                  key={path.id}
                  onClick={() => handleTrackClick(path)}
                  className={`relative p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group overflow-hidden ${
                    isActive
                      ? `bg-gradient-to-br ${path.colorTheme.gradient} ${path.colorTheme.border} ring-2 ring-sky-400/40 shadow-xl shadow-sky-950/30`
                      : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Subtle Glow */}
                  {isActive && (
                    <div className="absolute top-0 right-0 w-36 h-36 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />
                  )}

                  <div>
                    {/* Top Row: Tag, Badge & Active Check */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl filter drop-shadow-md">{path.iconEmoji}</span>
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
                          <h3 className="text-lg font-black text-white tracking-tight mt-0.5 group-hover:text-sky-300 transition-colors">
                            {path.title}
                          </h3>
                        </div>
                      </div>

                      {isActive ? (
                        <div className="bg-sky-500/20 text-sky-300 border border-sky-400/40 px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5 shadow-sm shrink-0">
                          <Check size={13} className="text-sky-400" />
                          <span>Active Track</span>
                        </div>
                      ) : isStudentPlus && (unlockedAdvancedPathId || 'web-dev') === path.id ? (
                        <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5 shadow-sm shrink-0">
                          <Zap size={12} className="fill-emerald-400" />
                          <span>StudentPlus Active</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="px-3 py-1 rounded-xl bg-white/10 group-hover:bg-white/20 text-white/80 group-hover:text-white text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                        >
                          <span>Switch</span>
                          <ArrowRight size={13} />
                        </button>
                      )}
                    </div>

                    {/* Subtitle & Description */}
                    <p className="text-white/80 text-xs sm:text-sm font-medium mb-1">
                      {path.subtitle}
                    </p>
                    <p className="text-white/50 text-xs leading-relaxed mb-4">
                      {path.description}
                    </p>
                  </div>

                  {/* Progress Bar & Footer */}
                  <div className="pt-3 border-t border-white/10 mt-auto">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                      <span className="text-white/50">Curriculum Progress</span>
                      <span className={isActive ? path.colorTheme.accent : 'text-white/70'}>
                        {doneLessons} / {totalLessons} Lessons ({progressPct}%)
                      </span>
                    </div>

                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${path.colorTheme.bar}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-4 bg-[#0A0B10] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-amber-400" />
            <span>StudentPlus includes 1 advanced track of your choice. Pro unlocks all advanced tracks.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
