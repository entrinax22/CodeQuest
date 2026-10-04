import React from 'react';
import { 
  BookOpen, Zap, Trophy, Sparkles, X, ArrowRight, CheckCircle2, 
  HelpCircle, Eye, Code, Heart, AlertCircle, Lock, Crown, Sliders
} from 'lucide-react';
import { Lesson } from '../data/curriculum';
import { LESSON_CONCEPTS } from '../data/lessonConcepts';
import { motion, AnimatePresence } from 'motion/react';

interface TopicPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  moduleTitle: string;
  isCompleted: boolean;
  onStartTheory: (lesson: Lesson) => void;
  onStartQuiz: (lesson: Lesson) => void;
  hearts: number;
  isAdvancedLocked?: boolean;
  isSequentialLocked?: boolean;
  onUnlockAdvance?: () => void;
  isStudentPlus?: boolean;
}

export default function TopicPreviewModal({
  isOpen,
  onClose,
  lesson,
  moduleTitle,
  isCompleted,
  onStartTheory,
  onStartQuiz,
  hearts,
  isAdvancedLocked = false,
  isSequentialLocked = false,
  onUnlockAdvance,
  isStudentPlus = false
}: TopicPreviewModalProps) {
  if (!isOpen || !lesson) return null;

  const concept = LESSON_CONCEPTS[lesson.id];
  const totalQuestions = lesson.exercises.length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative max-w-lg w-full max-h-[90vh] my-auto bg-[#0E1017] border border-white/15 rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-left flex flex-col overflow-hidden"
        >
          {/* Subtle Ambient Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 text-white/40 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors z-20 cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Scrollable Inner Body Container */}
          <div className="overflow-y-auto pr-1 sm:pr-2 space-y-4 max-h-full">
            {/* Header Info */}
            <div className="pr-8">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 bg-sky-500/15 border border-sky-400/30 px-2.5 py-0.5 rounded-full">
                  {moduleTitle}
                </span>
                
                {isAdvancedLocked && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-400/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Lock size={10} />
                    <span>Advance Topic</span>
                  </span>
                )}

                {isCompleted && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>Mastered</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                {lesson.title}
              </h2>
              <p className="text-white/60 text-xs sm:text-sm mt-1 leading-relaxed">
                {lesson.description}
              </p>
            </div>

            {/* Locked Advance Banner Callout */}
            {isAdvancedLocked && (
              <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-400/30 rounded-2xl p-3 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shrink-0 mt-0.5">
                  <Crown size={16} className="fill-amber-950" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-black text-amber-300 block">
                    Advance Curriculum Topic
                  </span>
                  <p className="text-[11px] text-white/70 mt-0.5 leading-snug">
                    {isStudentPlus 
                      ? "Choose this track as your 1 StudentPlus unlocked path or upgrade to PRO to unlock all tracks!"
                      : "Upgrade to StudentPlus (1 chosen track) or CodeQuest PRO (all tracks) to access full exercises."}
                  </p>
                </div>
              </div>
            )}

            {/* Concept Key Rule Preview */}
            {concept && (
              <div className="bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-transparent border border-sky-500/20 rounded-2xl p-3 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-300 shrink-0 mt-0.5">
                  <Sparkles size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-300 block mb-0.5">
                    Core Concept Rule
                  </span>
                  <p className="text-xs font-bold text-white/90 leading-snug line-clamp-2">
                    {concept.keyRule}
                  </p>
                </div>
              </div>
            )}

            {/* Key Topics Covered Pills */}
            {concept?.breakdown && concept.breakdown.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1.5">
                  Curriculum Takeaways
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {concept.breakdown.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-bold bg-white/5 border border-white/10 text-white/80 px-2.5 py-0.5 rounded-xl"
                    >
                      {item.term}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Exercise & XP info pills */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold shrink-0">
                  <BookOpen size={15} />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-bold text-white/40 block truncate">Theory Guide</span>
                  <span className="font-bold text-xs text-white truncate block">Full Guide & Code</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
                  <Trophy size={15} />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-bold text-white/40 block truncate">Practice Quiz</span>
                  <span className="font-bold text-xs text-amber-300 truncate block">{totalQuestions} Challenges</span>
                </div>
              </div>
            </div>

            {/* Action Buttons Zone */}
            <div className="space-y-2.5 pt-1">
              {/* Primary Option 1: Read Theory & Teaching Guide (Always Free to read) */}
              <button
                onClick={() => onStartTheory(lesson)}
                className="w-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black py-3 px-4 sm:py-3.5 sm:px-5 rounded-2xl shadow-[0_4px_0_rgb(30,58,138)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen size={18} className="text-white shrink-0" />
                  <div className="text-left">
                    <span className="text-xs sm:text-sm uppercase tracking-wider block font-black leading-tight">
                      Study Lesson Theory & Guide
                    </span>
                    <span className="text-[10px] text-white/80 font-medium block">
                      Read concepts, code syntax & browser outputs
                    </span>
                  </div>
                </div>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              {/* Primary Option 2: Quiz Challenges (or Unlock / Locked state) */}
              {isAdvancedLocked ? (
                <button
                  onClick={onUnlockAdvance}
                  className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-amber-950 font-black py-3 px-4 sm:py-3.5 sm:px-5 rounded-2xl shadow-lg active:translate-y-0.5 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Crown size={18} className="fill-amber-950 shrink-0" />
                    <div className="text-left">
                      <span className="text-xs sm:text-sm uppercase tracking-wider block font-black leading-tight">
                        {isStudentPlus ? 'Select as Your 1 Unlocked Track' : 'Unlock Advance Track with StudentPlus'}
                      </span>
                      <span className="text-[10px] text-amber-950/80 font-bold block">
                        {isStudentPlus ? 'Activate this track' : '1 track for StudentPlus · All tracks for PRO'}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              ) : isSequentialLocked ? (
                <div className="w-full bg-white/5 border border-white/10 text-white/40 font-black py-3 px-4 sm:py-3.5 sm:px-5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Lock size={18} className="text-white/40 shrink-0" />
                    <div className="text-left">
                      <span className="text-xs sm:text-sm uppercase tracking-wider block font-black leading-tight text-white/50">
                        Quiz Sequentially Locked
                      </span>
                      <span className="text-[10px] text-white/40 font-medium block">
                        Complete previous lessons in sequence to unlock quiz
                      </span>
                    </div>
                  </div>
                  <Lock size={16} className="text-white/30 shrink-0" />
                </div>
              ) : (
                <button
                  onClick={() => onStartQuiz(lesson)}
                  className="w-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-black py-3 px-4 sm:py-3.5 sm:px-5 rounded-2xl active:translate-y-0.5 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Zap size={18} className="text-amber-400 fill-amber-400 shrink-0" />
                    <div className="text-left">
                      <span className="text-xs sm:text-sm uppercase tracking-wider block font-black leading-tight">
                        Start Quiz Challenges
                      </span>
                      <span className="text-[10px] text-white/60 font-medium block">
                        {totalQuestions} Interactive questions • Earn XP
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold shrink-0">
                    <Heart size={14} className="fill-rose-400" />
                    <span>{hearts}/5</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
