import React, { useState } from 'react';
import { Heart, X, CheckCircle2, AlertCircle, ArrowRight, Zap, HelpCircle } from 'lucide-react';
import { useGameStore, PRACTICE_COOLDOWN_MS } from '../store/useGameStore';
import { motion, AnimatePresence } from 'motion/react';

interface PracticeSessionProps {
  onExit: () => void;
  onSuccess: () => void;
}

const PRACTICE_QUESTIONS = [
  {
    question: "Which tag is used to create a hyperlink in HTML?",
    options: ["<a>", "<link>", "<href>", "<url>"],
    correct: "<a>",
    hint: "Think of an 'anchor' tag."
  },
  {
    question: "What does HTML provide for a webpage?",
    options: ["Structure and content", "Server database queries", "3D raytracing", "Network routing"],
    correct: "Structure and content",
    hint: "HTML is the skeleton/blueprint of the web."
  },
  {
    question: "Which element wraps the entire visible content of a page?",
    options: ["<body>", "<head>", "<meta>", "<title>"],
    correct: "<body>",
    hint: "All visible text and media live in the body."
  }
];

export default function PracticeSession({ onExit, onSuccess }: PracticeSessionProps) {
  const { earnHeart, lastPracticeAt, recordPracticeCompletion } = useGameStore();

  const [cooldownLeftMs, setCooldownLeftMs] = useState<number>(() => {
    if (!lastPracticeAt) return 0;
    const elapsed = Date.now() - Number(lastPracticeAt);
    return Math.max(0, PRACTICE_COOLDOWN_MS - elapsed);
  });

  React.useEffect(() => {
    const checkRefill = useGameStore.getState().checkHeartRefill;
    checkRefill();

    const tick = () => {
      useGameStore.getState().checkHeartRefill();
      if (lastPracticeAt) {
        const elapsed = Date.now() - Number(lastPracticeAt);
        const remaining = Math.max(0, PRACTICE_COOLDOWN_MS - elapsed);
        setCooldownLeftMs(remaining);
      } else {
        setCooldownLeftMs(0);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lastPracticeAt]);

  const [questionIdx] = useState(() => Math.floor(Math.random() * PRACTICE_QUESTIONS.length));
  const [selected, setSelected] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const q = PRACTICE_QUESTIONS[questionIdx];

  const handleCheck = () => {
    if (!selected) return;
    const correct = selected === q.correct;
    setIsEvaluated(correct);
  };

  const handleContinue = async () => {
    if (isEvaluated === true) {
      await earnHeart();
      recordPracticeCompletion();
      setIsFinished(true);
    } else {
      // Free retry in practice!
      setIsEvaluated(null);
      setSelected(null);
    }
  };

  if (cooldownLeftMs > 0) {
    const cdMinutes = Math.floor(cooldownLeftMs / 60000);
    const cdSeconds = Math.floor((cooldownLeftMs % 60000) / 1000);
    const cdFormatted = `${cdMinutes.toString().padStart(2, '0')}:${cdSeconds.toString().padStart(2, '0')}`;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0B] text-white px-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-[#121316] border border-amber-500/30 rounded-3xl p-8 shadow-2xl space-y-6"
        >
          <div className="w-20 h-20 bg-amber-500/15 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30">
            <Zap size={44} className="text-amber-400 fill-amber-400 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-white">Practice Arena Cooldown</h2>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              You recently completed a practice session! To keep practice meaningful, the arena opens every 15 minutes.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 font-mono">
            <span className="text-[10px] uppercase font-black tracking-widest text-white/40 block mb-1">Next Practice Unlocks In</span>
            <span className="text-3xl font-black text-amber-400 tabular-nums">{cdFormatted}</span>
          </div>

          <button
            onClick={onExit}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-black py-3.5 rounded-2xl transition-all text-xs uppercase tracking-wider cursor-pointer"
          >
            Return to Learning Path
          </button>
        </motion.div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0B] text-white px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-[#121316] border border-white/10 rounded-3xl p-8 text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/30">
            <Heart size={44} className="text-red-500 fill-red-500 animate-bounce" />
          </div>

          <h2 className="text-3xl font-black mb-2 tracking-tight">Heart Restored!</h2>
          <p className="text-white/60 text-sm mb-8">
            Great practice session. You earned <span className="text-red-400 font-bold">+1 Heart</span>. You can now get back to your learning path!
          </p>

          <button
            onClick={onSuccess}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-[0_4px_0_rgb(6,95,70)] active:translate-y-1 transition-all flex items-center justify-center gap-2 text-base uppercase tracking-wider"
          >
            <span>Continue Learning</span>
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0B] text-white font-sans select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <button onClick={onExit} className="text-white/40 hover:text-white p-2 -ml-2 rounded-xl">
          <X size={22} />
        </button>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold text-emerald-400">
          <Zap size={14} />
          <span>Heart Practice (No Penalties)</span>
        </div>
        <div className="w-6" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-xl mx-auto w-full px-6 py-10 flex flex-col justify-between">
        <div>
          <span className="text-xs font-bold text-white/30 uppercase tracking-widest block mb-3">
            Quick Practice Question
          </span>
          <h2 className="text-2xl font-black text-white leading-snug mb-8">
            {q.question}
          </h2>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isSelected = selected === opt;
              let optionStyle = 'bg-white/5 border-white/10 hover:bg-white/10 text-white';
              if (isSelected && isEvaluated === null) {
                optionStyle = 'bg-blue-600/20 border-blue-500 text-white ring-2 ring-blue-500';
              } else if (isEvaluated === true && isSelected) {
                optionStyle = 'bg-green-500/20 border-green-500 text-green-300 ring-2 ring-green-500';
              } else if (isEvaluated === false && isSelected) {
                optionStyle = 'bg-red-500/20 border-red-500 text-red-300 ring-2 ring-red-500';
              }

              return (
                <button
                  key={opt}
                  onClick={() => isEvaluated === null && setSelected(opt)}
                  disabled={isEvaluated !== null}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${optionStyle}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs bg-white/10 text-white/70">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="font-semibold text-lg">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t p-6 ${
        isEvaluated === true 
          ? 'bg-emerald-950/80 border-emerald-500/30' 
          : isEvaluated === false 
            ? 'bg-rose-950/80 border-rose-500/30' 
            : 'bg-[#0A0A0B]/90 border-white/10'
      }`}>
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <AnimatePresence>
            {isEvaluated === true && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                <CheckCircle2 size={24} className="text-emerald-400" />
                <span className="font-bold text-emerald-300">Correct! Ready to restore heart</span>
              </motion.div>
            )}
            {isEvaluated === false && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-rose-300 text-sm">
                <HelpCircle size={18} />
                <span>{q.hint}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={isEvaluated === null ? handleCheck : handleContinue}
            disabled={!selected && isEvaluated === null}
            className={`ml-auto px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider ${
              isEvaluated === true 
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_4px_0_rgb(6,95,70)]' 
                : isEvaluated === false 
                  ? 'bg-rose-600 text-white' 
                  : selected 
                    ? 'bg-blue-600 text-white shadow-[0_4px_0_rgb(30,58,138)]' 
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            {isEvaluated === null ? 'Check' : isEvaluated === true ? 'Claim +1 Heart' : 'Try Again'}
          </button>
        </div>
      </footer>
    </div>
  );
}
