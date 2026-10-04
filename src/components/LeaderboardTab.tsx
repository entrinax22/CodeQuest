import React, { useState, useEffect } from 'react';
import { 
  Trophy, TrendingUp, TrendingDown, Minus, Crown, Timer, 
  Gift, Sparkles, CheckCircle2, Zap, Heart, Shield, Award,
  RefreshCw, ChevronRight, Check, Gem, Flame
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useGameStore } from '../store/useGameStore';
import { sounds } from '../lib/sound';
import PullToRefresh from './PullToRefresh';

interface LeaderboardUser {
  id: string;
  username: string;
  xp: number;
  weekly_xp?: number;
  rank: number;
  change: 'up' | 'down' | 'none';
  league_id?: string;
}

interface LeagueMeta {
  id: string;
  name: string;
  emoji: string;
  tierTag: string;
  minXp: number;
  maxXp: number;
  color: string;
  glowColor: string;
  bg: string;
  border: string;
  badgeBg: string;
  iconBg: string;
  pillColor: string;
  avatarRing: string;
  rewards: string;
  firstPrize: number;
  description: string;
}

const LEAGUES: LeagueMeta[] = [
  { 
    id: 'bronze',
    name: 'Bronze',
    emoji: '🥉',
    tierTag: 'Tier I Novice',
    minXp: 0, 
    maxXp: 999, 
    color: 'text-amber-400',
    glowColor: 'shadow-amber-900/40',
    bg: 'bg-gradient-to-br from-amber-600/25 via-amber-700/15 to-orange-950/40', 
    border: 'border-amber-500/40',
    badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    iconBg: 'from-amber-500 via-amber-600 to-amber-800 text-amber-100 border-amber-400/50',
    pillColor: 'text-amber-300',
    avatarRing: 'ring-amber-500/50',
    rewards: '100 XP + 1 Heart Refill',
    firstPrize: 150,
    description: 'The journey begins! Consistent coding habits unlock promotion to Silver.',
  },
  { 
    id: 'silver',
    name: 'Silver',
    emoji: '🥈',
    tierTag: 'Tier II Apprentice',
    minXp: 1000, 
    maxXp: 2499, 
    color: 'text-slate-200', 
    glowColor: 'shadow-slate-600/30',
    bg: 'bg-gradient-to-br from-slate-400/25 via-slate-600/15 to-cyan-950/30', 
    border: 'border-slate-300/40',
    badgeBg: 'bg-slate-300/15 text-slate-200 border-slate-300/30',
    iconBg: 'from-slate-300 via-slate-400 to-slate-600 text-slate-900 border-slate-200',
    pillColor: 'text-slate-200',
    avatarRing: 'ring-slate-300/50',
    rewards: '250 XP + 2 Heart Refills',
    firstPrize: 350,
    description: 'Sharpen your engineering speed and climb the ranks toward Gold.',
  },
  { 
    id: 'gold',
    name: 'Gold',
    emoji: '🥇',
    tierTag: 'Tier III Veteran',
    minXp: 2500, 
    maxXp: 4999, 
    color: 'text-yellow-300', 
    glowColor: 'shadow-yellow-500/30',
    bg: 'bg-gradient-to-br from-yellow-400/25 via-amber-500/15 to-orange-950/40', 
    border: 'border-yellow-400/50',
    badgeBg: 'bg-yellow-400/15 text-yellow-300 border-yellow-400/40',
    iconBg: 'from-yellow-300 via-amber-400 to-yellow-600 text-amber-950 border-yellow-200',
    pillColor: 'text-yellow-300',
    avatarRing: 'ring-yellow-400/50',
    rewards: '500 XP + 3 Hearts + 2X XP Potion',
    firstPrize: 700,
    description: 'Premier league of top developers. Top 10 ascend to the Diamond echelon.',
  },
  { 
    id: 'diamond',
    name: 'Diamond',
    emoji: '💎',
    tierTag: 'Tier IV Master',
    minXp: 5000, 
    maxXp: 999999, 
    color: 'text-cyan-300', 
    glowColor: 'shadow-cyan-500/40',
    bg: 'bg-gradient-to-br from-cyan-400/30 via-sky-500/20 to-indigo-950/50', 
    border: 'border-cyan-400/60 shadow-[0_0_35px_rgba(6,182,212,0.25)]',
    badgeBg: 'bg-cyan-400/20 text-cyan-200 border-cyan-400/50',
    iconBg: 'from-cyan-300 via-sky-400 to-indigo-600 text-white border-cyan-300',
    pillColor: 'text-cyan-300',
    avatarRing: 'ring-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.5)]',
    rewards: '1,000 XP + Full 5 Hearts + Diamond Crown',
    firstPrize: 1500,
    description: 'The pinnacle of CodeQuest mastery. Elite champions receive supreme rewards.',
  }
];

// Dynamic Badge Icon Renderer based on League ID
export const renderLeagueBadgeIcon = (id: string, size = 20, className = '') => {
  switch ((id || '').toLowerCase()) {
    case 'diamond':
      return <Gem size={size} className={`text-cyan-300 fill-cyan-400/20 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] ${className}`} />;
    case 'gold':
      return <Crown size={size} className={`text-yellow-300 fill-yellow-400/20 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)] ${className}`} />;
    case 'silver':
      return <Shield size={size} className={`text-slate-200 fill-slate-300/20 drop-shadow-[0_0_8px_rgba(226,232,240,0.6)] ${className}`} />;
    case 'bronze':
    default:
      return <Award size={size} className={`text-amber-400 fill-amber-500/20 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] ${className}`} />;
  }
};

export default function LeaderboardTab() {
  const { xp, weeklyXp, leagueId, rankChange, evaluateWeeklyLeagues, username } = useGameStore();
  
  // 1. Resolve user's explicit league tier from game store
  const activeLeagueId = (leagueId || '').toLowerCase();
  let calculatedLeagueIdx = LEAGUES.findIndex(l => l.id === activeLeagueId);
  
  // Fallback to XP range only if leagueId is unset or invalid
  if (calculatedLeagueIdx === -1) {
    calculatedLeagueIdx = LEAGUES.findIndex(l => xp >= l.minXp && xp <= l.maxXp);
    if (calculatedLeagueIdx === -1) calculatedLeagueIdx = 0;
  }

  const userLeagueIdx = calculatedLeagueIdx;
  const userLeagueMeta = LEAGUES[userLeagueIdx];

  const [currentLeague, setCurrentLeague] = useState(userLeagueIdx); 
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResultToast, setEvalResultToast] = useState<string | null>(null);
  const [rewardClaimed, setRewardClaimed] = useState<boolean>(() => {
    return username ? localStorage.getItem(`codequest_weekly_reward_claimed_${username}`) === 'true' : false;
  });

  // Keep currentLeague view in sync whenever user's leagueId changes
  useEffect(() => {
    setCurrentLeague(userLeagueIdx);
  }, [userLeagueIdx]);

  useEffect(() => {
    fetchLeaderboard();
  }, [currentLeague]);

  const fetchLeaderboard = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const activeLeagueConfig = LEAGUES[currentLeague];

    // Fetch profiles and strictly filter users that belong to active league tier
    const { data: allProfiles, error } = await supabase
      .from('profiles')
      .select('id, username, xp, weekly_xp, league_id, rank_change')
      .order('xp', { ascending: false })
      .limit(100);

    if (!error && allProfiles) {
      const matchingUsers = allProfiles.filter(u => {
        const uXp = u.xp || 0;
        const uLeague = (u.league_id || '').toLowerCase();

        // Compute ground-truth league tier based on XP
        let computedLeague = 'bronze';
        if (uXp >= 10000) computedLeague = 'diamond';
        else if (uXp >= 5000) computedLeague = 'platinum';
        else if (uXp >= 2500) computedLeague = 'gold';
        else if (uXp >= 1000) computedLeague = 'silver';
        else computedLeague = 'bronze';

        // 0 XP users are strictly Bronze; otherwise validate league_id
        const finalLeague = uXp === 0 ? 'bronze' : (uLeague || computedLeague);

        return finalLeague === activeLeagueConfig.id;
      });

      setUsers(matchingUsers.map((u, i) => ({
        ...u,
        rank: i + 1,
        change: (u.rank_change as any) || (Math.random() > 0.8 ? 'up' : Math.random() > 0.8 ? 'down' : 'none')
      })));
    }
    setLoading(false);
  };

  const handleClaimReward = async () => {
    sounds.playFanfare();
    setRewardClaimed(true);
    if (username) {
      localStorage.setItem(`codequest_weekly_reward_claimed_${username}`, 'true');
    }

    // Dynamic XP and Heart Refill Disbursement based on user's active league
    let rewardXp = 100;
    if (activeLeagueId === 'silver') rewardXp = 250;
    else if (activeLeagueId === 'gold') rewardXp = 500;
    else if (activeLeagueId === 'diamond') rewardXp = 1000;

    const store = useGameStore.getState();
    try {
      await store.addXp(rewardXp);
      await store.refillHearts();
    } catch (err) {
      console.error('Error claiming rewards:', err);
    }

    setEvalResultToast(`Claimed ${activeLeague.name} Rewards (+${rewardXp} XP & Hearts Refilled)! 🎉`);
    setTimeout(() => setEvalResultToast(null), 4000);
  };

  const handleTriggerWeeklyEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const res = await evaluateWeeklyLeagues();
      setEvalResultToast(res.message);
      await fetchLeaderboard();
    } catch (e: any) {
      setEvalResultToast(e.message || 'Weekly evaluation error');
    } finally {
      setIsEvaluating(false);
      setTimeout(() => setEvalResultToast(null), 5000);
    }
  };

  const activeLeague = LEAGUES[currentLeague];

  const handleRefreshLeaderboard = async () => {
    const sessionRes = await supabase?.auth.getSession();
    if (sessionRes?.data?.session?.user) {
      await useGameStore.getState().syncWithSupabase(sessionRes.data.session.user.id);
    }
    await fetchLeaderboard();
  };

  return (
    <PullToRefresh onRefresh={handleRefreshLeaderboard} label="league rankings">
      <div className="max-w-2xl lg:max-w-3xl mx-auto py-6 sm:py-8 px-2 sm:px-4 pb-28 text-left space-y-6 sm:space-y-7 animate-in fade-in duration-300">
        {/* Full-width Responsive Rectangular Toast Notification for Weekly Evaluation Results */}
        {evalResultToast && (
          <div className="fixed top-16 left-2 right-2 sm:left-4 sm:right-4 md:max-w-3xl md:mx-auto z-50 bg-[#181926]/98 text-sky-200 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-sky-400/40 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200 text-xs sm:text-sm font-bold leading-snug">
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles size={18} className="text-yellow-300 fill-yellow-300 shrink-0" />
              <span className="whitespace-normal break-words">{evalResultToast}</span>
            </div>
            <button onClick={() => setEvalResultToast(null)} className="text-sky-300/60 hover:text-sky-200 text-xs font-bold shrink-0 cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

      {/* User Current Tier Status Pill */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-3.5 sm:p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${userLeagueMeta.iconBg} border flex items-center justify-center shadow-sm shrink-0`}>
            {renderLeagueBadgeIcon(userLeagueMeta.id, 20)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900">{username || 'Developer'}</span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.2 rounded-full border ${userLeagueMeta.badgeBg}`}>
                {userLeagueMeta.name} League
              </span>
            </div>
            <p className="text-[11px] text-slate-500">{userLeagueMeta.tierTag} · {userLeagueMeta.rewards}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {rankChange === 'up' && (
            <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full animate-pulse">
              <TrendingUp size={12} />
              <span>Promoted!</span>
            </span>
          )}
          {rankChange === 'down' && (
            <span className="flex items-center gap-1 text-[10px] font-black uppercase text-rose-600 bg-rose-100 border border-rose-300 px-2.5 py-1 rounded-full">
              <TrendingDown size={12} />
              <span>Demoted</span>
            </span>
          )}
        </div>
      </div>

      {/* League Selection Segmented Tabs with Unique Badges */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl">
        {LEAGUES.map((league, idx) => {
          const isMyLeague = idx === userLeagueIdx;
          const isSelected = currentLeague === idx;
          return (
            <button
              key={league.name}
              onClick={() => setCurrentLeague(idx)}
              className={`flex-1 py-2 sm:py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex flex-col items-center gap-1 cursor-pointer relative ${
                isSelected 
                  ? `bg-white text-slate-900 shadow-sm border border-slate-200` 
                  : 'text-slate-400 hover:text-slate-800 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {renderLeagueBadgeIcon(league.id, 14)}
                <span className={isSelected ? 'text-slate-900 font-extrabold' : ''}>{league.name}</span>
              </div>
              {isMyLeague && (
                <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full border ${league.badgeBg}`}>
                  You
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active League Hero Card */}
      <div className="rounded-3xl p-5 sm:p-7 bg-[#0F172A] border border-slate-800 shadow-md relative overflow-hidden space-y-4 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Dynamic League Badge Crest */}
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr ${activeLeague.iconBg} border border-slate-700 flex items-center justify-center shadow-lg shrink-0 group-hover:scale-105 transition-transform`}>
              {renderLeagueBadgeIcon(activeLeague.id, 36)}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${activeLeague.badgeBg}`}>
                  {activeLeague.tierTag}
                </span>
                {currentLeague === userLeagueIdx && (
                  <span className="bg-sky-500/20 text-sky-300 border border-sky-400/40 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>Your Active League</span>
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-1 text-white">
                {activeLeague.name} League
              </h2>

              <div className="flex items-center gap-2 text-white/60 text-xs font-bold mt-1">
                <Timer size={14} className="text-white/50" />
                <span>Weekly Tournament closes Sunday 00:00 UTC</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center sm:flex-col gap-2 shrink-0">
            <div className="text-left sm:text-right bg-slate-800/80 border border-slate-700 px-4 py-2.5 rounded-2xl">
              <p className="text-[10px] font-black text-white/40 uppercase mb-0.5">Weekly XP</p>
              <p className="text-lg sm:text-xl font-black text-yellow-300 tabular-nums">
                {weeklyXp || 0} XP
              </p>
            </div>
          </div>
        </div>

        {/* League Tier Description & Rewards */}
        <p className="text-white/80 text-xs sm:text-sm font-normal">
          {activeLeague.description}
        </p>

        {/* League Rewards Description & Edge Function Trigger */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-white/40 block mb-0.5">
              Weekly Tournament Rewards ({activeLeague.name})
            </span>
            <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <Gift size={15} className="text-amber-400 shrink-0" />
              <span>{activeLeague.rewards}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Run Weekly Evaluation Trigger */}
            <button
              onClick={handleTriggerWeeklyEvaluation}
              disabled={isEvaluating}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 border border-white/15 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
              title="Runs the Supabase Edge Function to evaluate promotions, demotions, and grant XP rewards"
            >
              <RefreshCw size={13} className={isEvaluating ? 'animate-spin' : ''} />
              <span>{isEvaluating ? 'Evaluating...' : 'Evaluate Week'}</span>
            </button>

            {currentLeague === userLeagueIdx && (
              <div>
                {rewardClaimed ? (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black uppercase">
                    <CheckCircle2 size={14} />
                    <span>Claimed</span>
                  </span>
                ) : (
                  <button
                    onClick={handleClaimReward}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95 animate-bounce"
                  >
                    <Gift size={15} />
                    <span>Claim</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Promotion Zone Indicator */}
      <div className="flex items-center gap-2 px-2">
        <div className="flex-1 h-1 bg-emerald-500/30 rounded-full" />
        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
          <TrendingUp size={13} />
          <span>Promotion Zone (Top 10 Promote Up)</span>
        </span>
        <div className="flex-1 h-1 bg-emerald-500/30 rounded-full" />
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2.5">
        {loading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-16 bg-white border border-slate-200 rounded-2xl animate-pulse" />
          ))
        ) : (
          users.map((user) => {
            const isFirst = user.rank === 1;
            const isSecond = user.rank === 2;
            const isThird = user.rank === 3;
            const isMe = user.username === username || user.rank === 12;

            return (
              <div 
                key={user.id} 
                className={`
                  flex items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all border
                  ${isFirst ? 'bg-gradient-to-r from-amber-50 to-yellow-50/40 border-amber-200 shadow-sm' :
                    isSecond ? 'bg-gradient-to-r from-slate-100 to-slate-50/40 border-slate-200 shadow-sm' :
                    isThird ? 'bg-gradient-to-r from-orange-50 to-amber-50/40 border-orange-200 shadow-sm' :
                    isMe ? `ring-2 ring-sky-500/30 bg-sky-50 border-sky-300 shadow-sm` : 'bg-white border-slate-200 hover:bg-slate-50'}
                `}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-7 text-center font-black text-sm sm:text-base shrink-0">
                    {isFirst ? (
                      <Crown size={22} className="text-yellow-500 fill-yellow-500 mx-auto" />
                    ) : isSecond ? (
                      <span className="text-slate-400 font-black">2</span>
                    ) : isThird ? (
                      <span className="text-amber-600 font-black">3</span>
                    ) : (
                      <span className="text-slate-400">{user.rank}</span>
                    )}
                  </div>

                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md shrink-0 ${
                    isFirst ? 'bg-gradient-to-tr from-yellow-400 to-amber-500 text-black border border-yellow-300' :
                    isSecond ? 'bg-gradient-to-tr from-slate-300 to-slate-400 text-black border border-slate-200' :
                    isThird ? 'bg-gradient-to-tr from-amber-600 to-orange-700 text-white border border-amber-500' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {user.username?.[0]?.toUpperCase() || '?'}
                  </div>

                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{user.username || 'Mysterious Dev'}</h4>
                      {isMe && (
                        <span className="text-[9px] bg-sky-600 text-white font-black px-2 py-0.2 rounded-full uppercase shrink-0">
                          You
                        </span>
                      )}
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full border hidden sm:inline-flex items-center gap-1 shrink-0 ${activeLeague.badgeBg}`}>
                        {renderLeagueBadgeIcon(activeLeague.id, 10)}
                        <span>{activeLeague.name}</span>
                      </span>
                    </div>
                    <p className="text-[11px] font-black text-sky-600 uppercase tracking-wider tabular-nums mt-0.5">
                      {user.xp} XP
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {user.change === 'up' && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200">
                      <TrendingUp size={14} />
                      <span className="hidden sm:inline">Promoted</span>
                    </span>
                  )}
                  {user.change === 'down' && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-lg border border-rose-200">
                      <TrendingDown size={14} />
                      <span className="hidden sm:inline">Demoted</span>
                    </span>
                  )}
                  {user.change === 'none' && <Minus size={16} className="text-slate-300" />}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Demotion Zone Indicator */}
      <div className="flex items-center gap-2 px-2 pt-2">
        <div className="flex-1 h-1 bg-rose-500/30 rounded-full" />
        <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider flex items-center gap-1">
          <TrendingDown size={13} />
          <span>Demotion Zone (Bottom 5 Demote Down)</span>
        </span>
        <div className="flex-1 h-1 bg-rose-500/30 rounded-full" />
      </div>
    </div>
    </PullToRefresh>
  );
}
