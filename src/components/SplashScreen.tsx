import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Terminal, Code2, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { sounds } from '../lib/sound';

interface SplashScreenProps {
  onFinish: () => void;
  minDurationMs?: number;
}

export default function SplashScreen({ onFinish, minDurationMs = 2000 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing CodeQuest Kernel...');
  const [isFading, setIsFading] = useState(false);
  const [showSkipBtn, setShowSkipBtn] = useState(false);

  // Keep onFinish ref fresh so component never restarts timer effect on parent re-renders
  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const hasFinishedRef = useRef(false);

  const handleFinish = useRef(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsFading(true);
    setTimeout(() => {
      onFinishRef.current?.();
    }, 400);
  });

  useEffect(() => {
    // Play splash audio chime on load
    const audioTimer = setTimeout(() => {
      try {
        sounds.playSplashChime();
      } catch {
        // Ignore audio policy errors
      }
    }, 150);

    // Reveal skip button if splash is visible for over 1.8s
    const skipTimer = setTimeout(() => {
      setShowSkipBtn(true);
    }, 1800);

    // Absolute fail-safe hard timeout: guarantee splash dismisses after 3 seconds max
    const safetyTimer = setTimeout(() => {
      handleFinish.current();
    }, 3000);

    const stages = [
      { pct: 25, msg: 'Connecting to Supabase Cloud...' },
      { pct: 55, msg: 'Loading Interactive Curriculum & Labs...' },
      { pct: 85, msg: 'Verifying Student Credentials & Progress...' },
      { pct: 100, msg: 'CodeQuest Engine Ready!' }
    ];

    let currentStage = 0;
    const stepMs = Math.max(300, Math.floor(minDurationMs / 4));

    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        const stage = stages[currentStage];
        setProgress(stage.pct);
        setStatusMessage(stage.msg);
        currentStage++;
      } else {
        clearInterval(interval);
        handleFinish.current();
      }
    }, stepMs);

    return () => {
      clearTimeout(audioTimer);
      clearTimeout(skipTimer);
      clearTimeout(safetyTimer);
      clearInterval(interval);
    };
  }, [minDurationMs]);

  return (
    <div 
      onClick={() => handleFinish.current()}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080E] text-white overflow-hidden transition-opacity duration-500 cursor-pointer ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-float-orb" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Grid Mesh Canvas Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.4) 1px, transparent 0)`,
          backgroundSize: '28px 28px'
        }}
      />

      <div className="relative flex flex-col items-center max-w-sm px-6 text-center space-y-8 z-10">
        {/* Futuristic Emblem Icon */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 blur-xl opacity-60 animate-pulse-glow" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#0F121E] border border-sky-500/30 shadow-2xl flex items-center justify-center text-sky-400 group">
            <div className="absolute inset-1 rounded-2xl bg-gradient-to-tr from-sky-500/10 via-indigo-500/10 to-transparent" />
            <Terminal size={48} className="text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
            <Sparkles size={20} className="absolute top-3 right-3 text-amber-400 animate-bounce" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/25 text-sky-300 text-[10px] font-black uppercase tracking-widest">
            <Zap size={12} className="fill-sky-400" />
            <span>Interactive Academy Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display">
            CodeQuest <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Academy</span>
          </h1>
          <p className="text-xs text-white/60 font-medium">
            Master Software Engineering Through Interactive Play
          </p>
        </div>

        {/* Progress Bar & Status */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-white/60 px-1">
            <span className="flex items-center gap-1.5">
              <Code2 size={13} className="text-sky-400" />
              <span>{statusMessage}</span>
            </span>
            <span className="text-sky-400 font-bold tabular-nums">{progress}%</span>
          </div>

          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(56,189,248,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Skip / Continue Button if delayed */}
        {showSkipBtn && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFinish.current();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white/90 text-xs font-bold transition-all animate-fade-in shadow-md"
          >
            <span>Tap to Continue</span>
            <ArrowRight size={14} />
          </button>
        )}

        {/* Trust Footer */}
        <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-white/40 font-mono">
          <ShieldCheck size={13} className="text-emerald-400" />
          <span>AES-256 Cloud Sync • Web Audio Engine Enabled</span>
        </div>
      </div>
    </div>
  );
}
