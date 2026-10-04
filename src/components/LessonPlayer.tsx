import React, { useState } from 'react';
import { 
  X, Heart, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Trophy, 
  Zap, HelpCircle, BookOpen, Lightbulb, ChevronDown, ChevronUp, Layers,
  Terminal, Code2
} from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'motion/react';
import { Lesson, Exercise } from '../data/curriculum';
import NoHeartsModal from './NoHeartsModal';
import { sounds } from '../lib/sound';
import { LESSON_CONCEPTS } from '../data/lessonConcepts';
import LessonConceptBriefing from './LessonConceptBriefing';

interface LessonPlayerProps {
  lesson: Lesson;
  initialMode?: 'briefing' | 'exercises';
  onExit: () => void;
  onComplete?: (lessonId: string) => Promise<void> | void;
}

export default function LessonPlayer({ lesson, initialMode = 'briefing', onExit, onComplete }: LessonPlayerProps) {
  const { hearts, loseHeart, completeLesson, doubleXpUntil } = useGameStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'briefing' | 'exercises'>(initialMode);
  const [showInlineConcept, setShowInlineConcept] = useState(false);
  
  const isDoubleXp = Boolean(doubleXpUntil && Date.now() < doubleXpUntil);
  const fileExt = lesson.id.startsWith('css') ? 'style.css' : lesson.id.startsWith('php') ? 'server.php' : 'index.html';

  // Resolved teaching concept for this lesson
  const concept = LESSON_CONCEPTS[lesson.id] || {
    summary: lesson.description || 'Master the concepts and practical application of this web development topic.',
    keyRule: 'Review the exercises and syntax patterns to reinforce your coding skills.',
    codeSnippet: lesson.exercises[0]?.code?.join('\n') || '<!-- Learn and master this topic -->',
    codeLanguage: (lesson.id.startsWith('css') ? 'css' : lesson.id.startsWith('php') ? 'php' : 'html') as 'html' | 'css' | 'php',
    breakdown: [
      { term: lesson.title, definition: lesson.description, badge: 'Topic' }
    ],
    proTip: 'Practice writing clean, readable code and verify closing tags and attributes.',
    commonMistake: 'Rushing through exercises without reading question details.'
  };

  // Helper to prevent spoiled placeholders in create challenge input
  const getExercisePlaceholder = (ex: Exercise) => {
    if (!ex.placeholder) return 'Type your answer code here...';
    const cleanP = ex.placeholder.trim().toLowerCase();
    const isSpoiled = ex.correct.some(c => c.trim().toLowerCase() === cleanP);
    if (isSpoiled) {
      return 'Type your answer code here...';
    }
    return ex.placeholder;
  };

  const exercise: Exercise = lesson.exercises[currentIdx];
  const totalExercises = lesson.exercises.length;
  const numBlanks = exercise.blanks ? exercise.blanks.length : 0;
  
  // For 'choice' questions: selected string option
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  
  // For 'fill' questions: array of filled tokens corresponding to each blank slot
  const [filledSlots, setFilledSlots] = useState<(string | null)[]>(() => 
    new Array(lesson.exercises[0]?.blanks?.length || 0).fill(null)
  );

  // Track which option index in exercise.options was used for which blank slot!
  const [filledOptionIndices, setFilledOptionIndices] = useState<(number | null)[]>(() =>
    new Array(lesson.exercises[0]?.blanks?.length || 0).fill(null)
  );

  // For 'create' questions: code typed by the student
  const [createdCode, setCreatedCode] = useState<string>('');
  
  // Feedback state: null = unanswered, true = correct, false = incorrect
  const [isEvaluated, setIsEvaluated] = useState<boolean | null>(null);
  
  // Stats tracking for completion screen
  const [mistakesCount, setMistakesCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNoHeartsModal, setShowNoHeartsModal] = useState(false);

  // Initialize or reset slots when exercise changes
  React.useEffect(() => {
    setSelectedChoice(null);
    setFilledSlots(new Array(exercise.blanks?.length || 0).fill(null));
    setFilledOptionIndices(new Array(exercise.blanks?.length || 0).fill(null));
    setCreatedCode('');
    setIsEvaluated(null);
    setShowInlineConcept(false);
  }, [currentIdx, exercise]);

  // Keep passive heart refill active while student is in a lesson
  React.useEffect(() => {
    const checkRefill = useGameStore.getState().checkHeartRefill;
    checkRefill();
    const interval = setInterval(() => {
      useGameStore.getState().checkHeartRefill();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Click on an option chip in Fill mode (tracks specific chip index)
  const handleSelectFillOption = (option: string, optionIndex: number) => {
    if (isEvaluated !== null) return;
    if (filledOptionIndices.includes(optionIndex)) return; // already used this specific chip
    
    const firstEmptyIndex = filledSlots.findIndex(slot => slot === null);
    if (firstEmptyIndex !== -1) {
      const nextSlots = [...filledSlots];
      const nextIndices = [...filledOptionIndices];
      nextSlots[firstEmptyIndex] = option;
      nextIndices[firstEmptyIndex] = optionIndex;
      setFilledSlots(nextSlots);
      setFilledOptionIndices(nextIndices);
    }
  };

  // Click on a slot to remove its value and return chip to bank
  const handleClearSlot = (slotIndex: number) => {
    if (isEvaluated !== null) return;
    const nextSlots = [...filledSlots];
    const nextIndices = [...filledOptionIndices];
    nextSlots[slotIndex] = null;
    nextIndices[slotIndex] = null;
    setFilledSlots(nextSlots);
    setFilledOptionIndices(nextIndices);
  };

  // Check the answer
  const handleCheck = () => {
    if (isEvaluated !== null) return;

    let isCorrectAnswer = false;

    if (exercise.type === 'choice') {
      if (!selectedChoice) return;
      isCorrectAnswer = selectedChoice === exercise.correct[0];
    } else if (exercise.type === 'fill') {
      const isComplete = filledSlots.length === numBlanks && filledSlots.every(s => s !== null);
      if (!isComplete) return;

      isCorrectAnswer = filledSlots.every((val, index) => val === exercise.correct[index]);
    } else if (exercise.type === 'create') {
      const clean = createdCode.trim();
      if (!clean) return;

      // Normalization helpers: collapse spaces, ignore casing for HTML/CSS
      const norm = (s: string) => s.trim().replace(/\s+/g, ' ');
      const cleanNorm = norm(clean).toLowerCase();

      isCorrectAnswer = exercise.correct.some(c => {
        // Direct match
        if (clean === c) return true;
        // Trimmed case-insensitive match
        if (clean.toLowerCase() === c.toLowerCase()) return true;
        // Normalized spacing match
        if (cleanNorm === norm(c).toLowerCase()) return true;
        // Semicolon-tolerant comparison
        const stripSemi = (s: string) => s.replace(/;$/, '').trim().toLowerCase();
        if (stripSemi(clean) === stripSemi(c)) return true;
        return false;
      });
    }

    if (isCorrectAnswer) {
      sounds.playCorrect();
      setIsEvaluated(true);
    } else {
      sounds.playWrong();
      setIsEvaluated(false);
      setMistakesCount(prev => prev + 1);
      loseHeart();
      if (hearts <= 1) {
        setShowNoHeartsModal(true);
      }
    }
  };

  // Move to next exercise or finish
  const handleContinue = async () => {
    if (isEvaluated === true) {
      if (currentIdx < totalExercises - 1) {
        const nextIdx = currentIdx + 1;
        const nextExercise = lesson.exercises[nextIdx];
        setCurrentIdx(nextIdx);
        setIsEvaluated(null);
        setSelectedChoice(null);
        setFilledSlots(new Array(nextExercise.blanks?.length || 0).fill(null));
        setFilledOptionIndices(new Array(nextExercise.blanks?.length || 0).fill(null));
        setCreatedCode('');
      } else {
        // Finished all exercises!
        if (isSubmitting) return;
        setIsSubmitting(true);
        sounds.playFanfare();
        try {
          if (onComplete) {
            await onComplete(lesson.id);
          } else {
            await completeLesson(lesson.id);
          }
          setIsFinished(true);
        } catch (err) {
          console.error("Failed to complete lesson:", err);
          setIsFinished(true);
        } finally {
          setIsSubmitting(false);
        }
      }
    } else if (isEvaluated === false) {
      // Try again
      setIsEvaluated(null);
      setSelectedChoice(null);
      setFilledSlots(new Array(exercise.blanks?.length || 0).fill(null));
      setFilledOptionIndices(new Array(exercise.blanks?.length || 0).fill(null));
      // For create mode, preserve createdCode so user can correct their typo easily
    }
  };

  const isCheckDisabled = () => {
    if (isEvaluated !== null) return false; // Button becomes "Continue" or "Try Again"
    if (exercise.type === 'choice') {
      return selectedChoice === null;
    }
    if (exercise.type === 'fill') {
      if (numBlanks === 0) return false;
      return filledSlots.some(slot => slot === null) || filledSlots.length < numBlanks;
    }
    if (exercise.type === 'create') {
      return !createdCode.trim();
    }
    return false;
  };

  // Completion celebratory screen
  if (isFinished) {
    const accuracy = Math.max(0, Math.round(((totalExercises) / (totalExercises + mistakesCount)) * 100));
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0B] text-white px-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-gradient-to-b from-white/10 to-white/5 border border-white/15 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(251,191,36,0.4)] text-black">
            <Trophy size={40} className="fill-black" />
          </div>

          <h2 className="text-3xl font-black mb-2 tracking-tight">Lesson Complete!</h2>
          <p className="text-white/60 text-sm mb-8 font-medium">
            You just mastered <span className="text-blue-400 font-bold">{lesson.title}</span>!
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center">
              <Sparkles size={20} className="text-blue-400 mb-1" />
              <span className="text-[10px] uppercase font-bold text-white/40">Earned</span>
              <span className="text-lg font-black text-blue-400">
                {isDoubleXp ? '+100 XP ⚡' : '+50 XP'}
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center">
              <Zap size={20} className="text-orange-400 mb-1" />
              <span className="text-[10px] uppercase font-bold text-white/40">Accuracy</span>
              <span className="text-lg font-black text-orange-400">{accuracy}%</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center">
              <Heart size={20} className="text-red-400 fill-red-400 mb-1" />
              <span className="text-[10px] uppercase font-bold text-white/40">Hearts</span>
              <span className="text-lg font-black text-red-400">{hearts}/5</span>
            </div>
          </div>

          <button
            onClick={onExit}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-[0_4px_0_rgb(30,58,138)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 text-lg uppercase tracking-wider"
          >
            Continue Learning
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  const progressPercent = ((currentIdx + (isEvaluated === true ? 1 : 0)) / totalExercises) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0B] text-white font-sans select-none">
      {/* Top Header Bar with Mode Switcher & Hearts HUD */}
      <header className="flex items-center justify-between gap-2 px-3 sm:px-6 py-3.5 border-b border-white/10 bg-[#0A0A0B]/95 backdrop-blur-md sticky top-0 z-30">
        <button 
          onClick={onExit}
          className="text-white/50 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider shrink-0"
          aria-label="Exit lesson"
        >
          <X size={20} />
          <span className="hidden md:inline">Exit</span>
        </button>

        {/* Center Mode Switcher Tabs: Theory vs Quiz */}
        <div className="flex items-center bg-white/5 border border-white/10 p-0.5 sm:p-1 rounded-2xl shadow-inner shrink min-w-0">
          <button
            onClick={() => setViewMode('briefing')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all ${
              viewMode === 'briefing'
                ? 'bg-sky-500 text-black shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen size={13} className="sm:size-[14px]" />
            <span className="hidden sm:inline">Lesson</span>
            <span>Theory</span>
          </button>
          <button
            onClick={() => setViewMode('exercises')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all ${
              viewMode === 'exercises'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap size={13} className={`sm:size-[14px] ${viewMode === 'exercises' ? 'text-amber-300 fill-amber-300' : ''}`} />
            <span>Quiz ({currentIdx + 1}/{totalExercises})</span>
          </button>
        </div>

        {/* Right HUD: Hearts indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-red-500/10 border border-red-500/20 rounded-full">
            <Heart size={14} className="sm:size-[16px] text-red-500 fill-red-500" />
            <span className="font-black text-xs sm:text-sm text-red-400">{hearts}</span>
          </div>
        </div>
      </header>

      {/* VIEW MODE 1: COMPREHENSIVE TEACHING & LESSON THEORY */}
      {viewMode === 'briefing' && (
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <LessonConceptBriefing
              lessonTitle={lesson.title}
              concept={concept}
              onStartExercises={() => setViewMode('exercises')}
            />
          </div>
        </main>
      )}

      {/* VIEW MODE 2: INTERACTIVE PRACTICE QUIZ & CHALLENGES */}
      {viewMode === 'exercises' && (
        <div className="flex-1 flex flex-col justify-between">
          {/* Progress Bar Header Sub-strip */}
          <div className="w-full bg-white/5 h-2 overflow-hidden">
            <motion.div 
              initial={false}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
            />
          </div>

          {/* Main Question Area */}
          <main className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-between">
            <div>
              {/* Category / Lesson badge & Quiz Modality Indicator */}
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                    {lesson.title}
                  </span>

                  {/* Challenge Modality Pill */}
                  {exercise.type === 'choice' && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 bg-purple-500/15 border border-purple-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <span>🎯 Select Answer</span>
                    </span>
                  )}
                  {exercise.type === 'fill' && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-500/15 border border-blue-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <span>🧩 Fill in the Blanks</span>
                    </span>
                  )}
                  {exercise.type === 'create' && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Code2 size={11} />
                      <span>⚡ Code Creator Challenge</span>
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold text-white/40 uppercase tracking-wider">
                  Challenge {currentIdx + 1} of {totalExercises}
                </span>
              </div>

              {/* Expandable "Learn Concept Before Answering" Teaching Accordion */}
              <div className="mb-5">
                <button
                  type="button"
                  onClick={() => setShowInlineConcept(!showInlineConcept)}
                  className="w-full text-left bg-gradient-to-r from-sky-500/15 via-blue-500/10 to-transparent hover:from-sky-500/20 border border-sky-400/30 rounded-2xl p-3 flex items-center justify-between text-xs font-bold text-sky-300 transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-sky-400 shrink-0" />
                    <span>{showInlineConcept ? 'Hide Concept Explanation' : '💡 Learn Concept Before Answering'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase text-sky-300 bg-sky-500/20 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                    <span>{showInlineConcept ? 'Close' : 'View Rule & Code'}</span>
                    {showInlineConcept ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </div>
                </button>

                {showInlineConcept && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-[#10121A] border border-sky-500/30 rounded-2xl p-4 mt-2 text-xs space-y-3 shadow-xl text-left"
                  >
                    <div className="flex items-start gap-2.5">
                      <Lightbulb size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase font-black text-amber-300 block mb-0.5">Golden Rule</span>
                        <p className="text-white/90 font-medium leading-relaxed">{concept.keyRule}</p>
                      </div>
                    </div>

                    {concept.breakdown.length > 0 && (
                      <div className="pt-2 border-t border-white/10">
                        <span className="text-[10px] uppercase font-black text-white/50 block mb-1">Key Syntax</span>
                        <div className="flex flex-wrap gap-1.5">
                          {concept.breakdown.slice(0, 3).map((item, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-sky-300 font-mono text-[11px]">
                              {item.term}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] text-white/50">Need the full guide with live browser preview?</span>
                      <button
                        onClick={() => setViewMode('briefing')}
                        className="text-[11px] font-black text-sky-400 hover:text-sky-300 flex items-center gap-1 underline uppercase tracking-wider"
                      >
                        <BookOpen size={12} />
                        <span>Open Theory Guide</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Question Text */}
              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug mb-6">
                {exercise.question}
              </h2>

              {/* MODE 1: SELECTING (CHOICE QUESTION) */}
              {exercise.type === 'choice' && (
                <div className="space-y-3 mt-4">
                  {exercise.options.map((opt, i) => {
                    const isSelected = selectedChoice === opt;
                    const letter = String.fromCharCode(65 + i);

                    let optionStyle = 'bg-white/5 border-white/10 hover:bg-white/10 text-white';
                    if (isSelected && isEvaluated === null) {
                      optionStyle = 'bg-blue-600/20 border-blue-500 text-white ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.25)]';
                    } else if (isEvaluated === true && isSelected) {
                      optionStyle = 'bg-green-500/20 border-green-500 text-green-300 ring-2 ring-green-500';
                    } else if (isEvaluated === false && isSelected) {
                      optionStyle = 'bg-red-500/20 border-red-500 text-red-300 ring-2 ring-red-500';
                    }

                    return (
                      <motion.button
                        key={opt}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (isEvaluated === null) setSelectedChoice(opt);
                        }}
                        disabled={isEvaluated !== null}
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${optionStyle}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs border ${
                            isSelected 
                              ? 'bg-blue-600 text-white border-blue-400' 
                              : 'bg-white/10 text-white/60 border-white/15'
                          }`}>
                            {letter}
                          </span>
                          <span className="font-semibold text-base sm:text-lg leading-snug">
                            {opt}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* MODE 2: FILL IN THE BLANK CODE (WITH PRECISE TOKEN INDEX TRACKING) */}
              {exercise.type === 'fill' && exercise.code && (
                <div className="space-y-6">
                  {/* Code Editor Preview Box */}
                  <div className="bg-[#121316] border border-white/10 rounded-2xl p-6 font-mono text-base sm:text-lg shadow-xl relative overflow-hidden">
                    <div className="flex items-center gap-1.5 pb-4 mb-4 border-b border-white/5 text-xs text-white/30 font-sans">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                      <span className="ml-2 font-mono text-[11px] text-white/50">{fileExt}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 leading-relaxed">
                      {exercise.code.map((token, codeIndex) => {
                        const blankIndex = exercise.blanks?.indexOf(codeIndex) ?? -1;

                        if (blankIndex !== -1) {
                          const slotValue = filledSlots[blankIndex];
                          return (
                            <button
                              key={codeIndex}
                              type="button"
                              onClick={() => handleClearSlot(blankIndex)}
                              disabled={isEvaluated !== null}
                              className={`min-w-[64px] px-3 h-10 rounded-xl font-bold flex items-center justify-center transition-all border-2 ${
                                slotValue
                                  ? 'bg-blue-600 border-blue-400 text-white shadow-[0_2px_0_rgb(30,58,138)] hover:scale-105 active:scale-95'
                                  : 'bg-white/5 border-dashed border-white/30 text-white/30 animate-pulse'
                              }`}
                            >
                              {slotValue || '___'}
                            </button>
                          );
                        }

                        // Regular code syntax highlighting
                        const isTag = token.startsWith('<') || token.endsWith('>');
                        const isAttribute = token.includes('=') || token.includes(':');
                        return (
                          <span
                            key={codeIndex}
                            className={
                              isTag 
                                ? 'text-blue-400 font-bold' 
                                : isAttribute 
                                  ? 'text-yellow-400' 
                                  : 'text-white/90'
                            }
                          >
                            {token}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Token Bank with specific chip index tracking */}
                  <div>
                    <p className="text-xs uppercase font-bold tracking-widest text-white/40 mb-3 text-center">
                      Tap tokens to fill the blanks
                    </p>
                    <div className="flex flex-wrap justify-center gap-2.5">
                      {exercise.options.map((opt, i) => {
                        const isAlreadyUsed = filledOptionIndices.includes(i);
                        return (
                          <motion.button
                            key={`${opt}-${i}`}
                            whileTap={!isAlreadyUsed && isEvaluated === null ? { scale: 0.95 } : undefined}
                            onClick={() => handleSelectFillOption(opt, i)}
                            disabled={isEvaluated !== null || isAlreadyUsed}
                            className={`px-5 py-3 rounded-2xl font-mono text-base font-bold transition-all shadow-md ${
                              isAlreadyUsed 
                                ? 'bg-white/5 text-white/20 border-b-2 border-white/5 cursor-not-allowed opacity-40' 
                                : 'bg-white/10 hover:bg-white/15 border-b-4 border-white/25 hover:border-white/35 text-white active:translate-y-1 active:border-b-0'
                            }`}
                          >
                            {opt}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 3: CODE CREATION / BUILDER CHALLENGE */}
              {exercise.type === 'create' && (
                <div className="space-y-4">
                  {/* Interactive Code Creation Canvas */}
                  <div className="bg-[#12141D] border border-white/10 rounded-3xl p-5 shadow-2xl relative overflow-hidden text-left font-mono">
                    {/* Editor Header Bar */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs text-white/40">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                        <span className="ml-2 font-mono text-[11px] text-white/50">{fileExt}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        Write & Construct
                      </span>
                    </div>

                    {/* Starter Code context if present */}
                    {exercise.starterCode && (
                      <pre className="text-white/40 text-xs sm:text-sm mb-3 select-none leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono">
                        {exercise.starterCode}
                      </pre>
                    )}

                    {/* Code Input Field */}
                    <div className="relative">
                      <input
                        type="text"
                        value={createdCode}
                        onChange={(e) => {
                          if (isEvaluated === null) setCreatedCode(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isCheckDisabled()) {
                            if (isEvaluated === null) handleCheck();
                            else handleContinue();
                          }
                        }}
                        disabled={isEvaluated !== null}
                        placeholder={getExercisePlaceholder(exercise)}
                        autoFocus
                        className="w-full bg-[#0A0C13] border-2 border-sky-500/40 focus:border-sky-400 rounded-2xl px-4 py-3.5 text-base sm:text-lg text-sky-200 placeholder-white/20 font-mono tracking-wide focus:outline-none focus:ring-4 focus:ring-sky-500/20 transition-all shadow-inner"
                      />
                    </div>

                    <p className="text-[11px] text-white/40 mt-2 font-sans">
                      Type the exact code or tag. Press Enter or tap <strong>Check Answer</strong> when ready.
                    </p>
                  </div>

                  {/* Quick Symbol Insertion Toolbar */}
                  {isEvaluated === null && (
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1.5 text-center font-sans">
                        Quick Insert Symbols
                      </span>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {['<', '>', '/', '"', "'", '{', '}', ';', '$', '=', '!', ':', '.', '-', '#'].map(sym => (
                          <button
                            key={sym}
                            type="button"
                            onClick={() => setCreatedCode(prev => prev + sym)}
                            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 active:scale-95 text-sky-300 font-mono text-sm font-bold flex items-center justify-center transition-all shadow-sm"
                            title={`Insert ${sym}`}
                          >
                            {sym}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="h-6" />
          </main>

          {/* Bottom Sticky Action Bar with Educational Feedback */}
          <footer className={`border-t transition-colors duration-300 p-4 sm:p-6 ${
            isEvaluated === true 
              ? 'bg-emerald-950/80 border-emerald-500/30' 
              : isEvaluated === false 
                ? 'bg-rose-950/80 border-rose-500/30' 
                : 'bg-[#0A0A0B]/90 border-white/10 backdrop-blur'
          }`}>
            <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <AnimatePresence mode="wait">
                {isEvaluated === true && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 w-full sm:w-auto"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-black font-black shrink-0 mt-0.5">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-emerald-400">Excellent!</h4>
                      <p className="text-xs font-semibold text-emerald-200/70">
                        {isDoubleXp ? '+100 XP gained (2X Boost Active! ⚡)' : '+50 XP gained'}
                      </p>
                      {exercise.explanation && (
                        <p className="text-xs text-emerald-100/90 mt-1 max-w-sm leading-relaxed">
                          💡 {exercise.explanation}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {isEvaluated === false && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 w-full sm:w-auto"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-rose-500 flex items-center justify-center text-black font-black shrink-0 mt-0.5">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-rose-400">Not quite right</h4>
                      <p className="text-xs font-medium text-rose-200/90 flex items-center gap-1 mt-0.5">
                        <HelpCircle size={14} className="shrink-0" />
                        <span>{exercise.hint}</span>
                      </p>
                      <button
                        onClick={() => setViewMode('briefing')}
                        className="text-xs font-bold text-sky-300 hover:text-sky-200 mt-1.5 flex items-center gap-1 underline"
                      >
                        <BookOpen size={13} />
                        <span>Study Lesson Theory & Rules First</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Button */}
              <button
                onClick={isEvaluated === null ? handleCheck : handleContinue}
                disabled={isCheckDisabled()}
                className={`w-full sm:w-auto sm:ml-auto px-8 py-4 rounded-2xl font-black text-base uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  isEvaluated === true 
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_4px_0_rgb(6,95,70)] active:translate-y-1' 
                    : isEvaluated === false 
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_4px_0_rgb(159,18,57)] active:translate-y-1' 
                      : isCheckDisabled()
                        ? 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_0_rgb(30,58,138)] active:translate-y-1'
                }`}
              >
                {isEvaluated === null ? (
                  'Check Answer'
                ) : isEvaluated === true ? (
                  <>
                    <span>Continue</span>
                    <ArrowRight size={18} />
                  </>
                ) : (
                  'Try Again'
                )}
              </button>
            </div>
          </footer>
        </div>
      )}

      {/* No Hearts Modal */}
      <NoHeartsModal
        isOpen={showNoHeartsModal}
        onClose={() => setShowNoHeartsModal(false)}
        isInsideLesson={true}
        onQuitLesson={onExit}
      />
    </div>
  );
}
