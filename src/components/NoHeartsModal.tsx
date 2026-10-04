import React, { useState, useEffect } from 'react';
import { Heart, Zap, Sparkles, Clock, ArrowRight, X, ShieldAlert, CheckCircle2, Crown, Infinity } from 'lucide-react';
import { useGameStore, HEART_REFILL_INTERVAL_MS, PRACTICE_COOLDOWN_MS, MAX_HEARTS } from '../store/useGameStore';
import { motion, AnimatePresence } from 'motion/react';

interface NoHeartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPractice?: () => void;
  isInsideLesson?: boolean;
  onQuitLesson?: () => void;
  onOpenSubscription?: () => void;
}

export default function NoHeartsModal({
  isOpen,
  onClose,
  onStartPractice,
  isInsideLesson,
  onQuitLesson,
  onOpenSubscription,
}: NoHeartsModalProps) {
  const { hearts, xp, buyHeartRefill, lastHeartLostAt, lastPracticeAt, checkHeartRefill, isPro } = useGameStore();
  const [timeLeftMs, setTimeLeftMs] = useState<number>(0);
  const [practiceCdMs, setPracticeCdMs] = useState<number>(0);
  const [refillError, setRefillError] = useState<string | null>(null);
  const [justRefilled, setJustRefilled] = useState(false);
  const prevHeartsRef = React.useRef(hearts);

  useEffect(() => {
    if (hearts > prevHeartsRef.current) {
      setJustRefilled(true);
      const timer = setTimeout(() => setJustRefilled(false), 3000);
      return () => clearTimeout(timer);
    }
    prevHeartsRef.current = hearts;
  }, [hearts]);

  useEffect(() => {
    if (!isOpen) return;

    const updateTimer = () => {
      checkHeartRefill();
      const state = useGameStore.getState();
      
      // Calculate practice cooldown
      if (state.lastPracticeAt) {
        const pElapsed = Date.now() - Number(state.lastPracticeAt);
        const pRemaining = Math.max(0, PRACTICE_COOLDOWN_MS - pElapsed);
        setPracticeCdMs(pRemaining);
      } else {
        setPracticeCdMs(0);
      }

      if (state.hearts >= MAX_HEARTS) {
        setTimeLeftMs(0);
        return;
      }
      const startTime = state.lastHeartLostAt ? Number(state.lastHeartLostAt) : Date.now();
      const elapsed = Math.max(0, Date.now() - startTime);
      const remainder = Math.max(0, HEART_REFILL_INTERVAL_MS - (elapsed % HEART_REFILL_INTERVAL_MS));
      setTimeLeftMs(remainder);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isOpen, checkHeartRefill]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeftMs / 60000);
  const seconds = Math.floor((timeLeftMs % 60000) / 1000);
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const heartsNeeded = Math.max(0, MAX_HEARTS - hearts);
  const totalRemainingMs = heartsNeeded === 0 ? 0 : timeLeftMs + (heartsNeeded - 1) * HEART_REFILL_INTERVAL_MS;
  const totalMinutes = Math.floor(totalRemainingMs / 60000);
  const totalSeconds = Math.floor((totalRemainingMs % 60000) / 1000);
  const totalFormatted = totalMinutes >= 60 
    ? `${Math.floor(totalMinutes / 60)}h ${(totalMinutes % 60).toString().padStart(2, '0')}m`
    : `${totalMinutes}m ${totalSeconds.toString().padStart(2, '0')}s`;

  const hasHealth = hearts > 0 || isPro;

  const handleRefillWithXp = async () => {
    setRefillError(null);
    if (xp < 150) {
      setRefillError(`You need 150 XP to refill. You currently have ${xp} XP.`);
      return;
    }
    const success = await buyHeartRefill();
    if (success) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative max-w-sm w-full bg-[#121316] border border-white/10 rounded-3xl p-6 sm:p-8 text-center shadow-2xl overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            hasHealth ? 'bg-emerald-500/20' : 'bg-red-500/20'
          }`} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-2 rounded-xl transition-colors hover:bg-white/5 cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Heart Status Icon */}
          <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
            {hasHealth ? (
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <Heart size={44} className="text-emerald-400 fill-emerald-400 animate-pulse" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.25)]">
                <Heart size={42} className="text-red-500 fill-red-500 animate-pulse" />
              </div>
            )}

            <div className={`absolute -bottom-1 -right-1 bg-black border-2 rounded-full p-1 ${
              hasHealth ? 'border-emerald-500 text-emerald-400' : 'border-red-500 text-red-500'
            }`}>
              {hasHealth ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
            </div>
          </div>

          {/* Heading */}
          <h3 className="text-2xl font-black text-white tracking-tight mb-2">
            {hasHealth ? 'Heart Ready!' : "You're Out of Hearts!"}
          </h3>
          <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-5">
            {hasHealth 
              ? `You currently have ${hearts} health hearts ready. You can resume your lessons!`
              : 'Mistakes cost health hearts. Upgrade to PRO for Infinite Hearts or refill with XP.'}
          </p>

          {/* PRO Unlimited Hearts Callout */}
          {!isPro && onOpenSubscription && (
            <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/15 to-orange-500/15 border border-amber-400/30 p-3.5 rounded-2xl mb-4 text-left flex items-center justify-between gap-2 shadow-lg">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-amber-950 flex items-center justify-center font-black shrink-0">
                  <Infinity size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-amber-300">CodeQuest PRO</span>
                    <span className="text-[8px] font-black uppercase bg-amber-400 text-amber-950 px-1 py-0.2 rounded">VIP</span>
                  </div>
                  <p className="text-[10px] text-white/60">Unlimited lives with zero wait times</p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenSubscription();
                }}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 font-black text-[11px] uppercase tracking-wider shadow-md shrink-0 cursor-pointer active:scale-95 transition-transform"
              >
                Get PRO
              </button>
            </div>
          )}

          {/* Refill Notification if heart just refreshed */}
          {justRefilled && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xs py-2 px-3 rounded-2xl mb-4 flex items-center justify-center gap-1.5 shadow-lg animate-pulse"
            >
              <Heart size={14} className="fill-emerald-400 text-emerald-400" />
              <span>+1 Heart Restored! Health updated.</span>
            </motion.div>
          )}

          {/* Refill Timer Box */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 text-left">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/40">
                    {hearts >= MAX_HEARTS ? 'Status' : 'Next Heart In'}
                  </p>
                  <p className="text-base font-black text-white font-mono">
                    {hearts >= MAX_HEARTS ? 'Full Health' : timeFormatted}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-sm font-black tabular-nums ${hasHealth ? 'text-emerald-400' : 'text-red-400'}`}>
                  {hearts} / {MAX_HEARTS}
                </span>
                <Heart size={16} className={hasHealth ? 'text-emerald-400 fill-emerald-400' : 'text-red-500 fill-red-500'} />
              </div>
            </div>

            {/* Total Refill Pace info */}
            <div className="flex items-center justify-between text-[11px] text-white/50 pt-0.5">
              <span>{hearts >= MAX_HEARTS ? 'All 5 hearts ready' : `Full 5 hearts in: ${totalFormatted}`}</span>
              <span className="text-sky-400 font-bold">12m/heart (1h full)</span>
            </div>
          </div>

          {/* Error notice if not enough XP */}
          {refillError && (
            <p className="text-red-400 text-xs font-semibold mb-4 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
              {refillError}
            </p>
          )}

          {/* Actions */}
          <div className="space-y-2.5">
            {/* If user has health, primary action is to Continue Learning */}
            {hasHealth ? (
              <button
                onClick={onClose}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-[0_4px_0_rgb(6,95,70)] active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue Learning</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <>
                {/* Instant XP Refill Button */}
                <button
                  onClick={handleRefillWithXp}
                  disabled={xp < 150}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    xp >= 150
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_0_rgb(30,58,138)] active:translate-y-1'
                      : 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  <Sparkles size={16} />
                  <span>Full Refill (150 XP)</span>
                </button>

                {/* Practice to Earn Heart Button */}
                {onStartPractice && (
                  <button
                    onClick={() => {
                      if (practiceCdMs === 0) {
                        onClose();
                        onStartPractice();
                      }
                    }}
                    disabled={practiceCdMs > 0}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      practiceCdMs === 0
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_4px_0_rgb(6,95,70)] active:translate-y-1 cursor-pointer'
                        : 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    <Zap size={16} className={practiceCdMs === 0 ? 'text-amber-300 fill-amber-300' : ''} />
                    <span>
                      {practiceCdMs > 0 
                        ? `Practice Cooldown (${Math.floor(practiceCdMs / 60000)}m ${Math.floor((practiceCdMs % 60000) / 1000).toString().padStart(2, '0')}s)`
                        : 'Practice Arena (+1 Heart)'}
                    </span>
                  </button>
                )}
              </>
            )}

            {/* If inside a lesson, option to quit cleanly */}
            {isInsideLesson && onQuitLesson && (
              <button
                onClick={onQuitLesson}
                className="w-full bg-white/5 hover:bg-white/10 text-white/60 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Quit Lesson
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
