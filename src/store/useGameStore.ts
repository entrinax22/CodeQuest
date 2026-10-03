import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { sounds } from '../lib/sound';

// 12 minutes per heart -> 5 hearts = 60 minutes = 1 hour total refill time
export const HEART_REFILL_INTERVAL_MS = 12 * 60 * 1000;
export const MAX_HEARTS = 5;

export type SubscriptionTier = 'basic' | 'student_plus' | 'pro' | 'free';
export type PlanCycle = 'monthly' | 'yearly';

interface GameState {
  xp: number;
  weeklyXp: number;
  leagueId: 'bronze' | 'silver' | 'gold' | 'diamond';
  rankChange: 'up' | 'down' | 'none';
  hearts: number;
  streak: number;
  level: number;
  completedLessons: string[];
  lastHeartLostAt: number | null;
  username: string;
  avatarIcon: string;
  soundEnabled: boolean;
  isSyncing: boolean;
  streakFreezesCount: number;
  doubleXpUntil: number | null;
  activePathId: string;
  role: 'admin' | 'user';
  
  // SaaS Subscription & Pro Features
  isPro: boolean;
  subscriptionTier: SubscriptionTier;
  subscriptionPlanCycle: PlanCycle | null;
  subscriptionExpiresAt: string | null;
  unlockedAdvancedPathId: string;
  unlockedAdvancedPathIds: string[];
  studentPlusRenewalCount: number;
  studentPlusPathLocked: boolean;

  setActivePath: (pathId: string) => void;
  setStudentPlusAdvancedPath: (pathId: string) => Promise<void>;
  setLeagueId: (leagueId: 'bronze' | 'silver' | 'gold' | 'diamond') => void;
  addXp: (amount: number) => Promise<void>;
  loseHeart: () => Promise<void>;
  earnHeart: () => Promise<void>;
  refillHearts: () => Promise<void>;
  checkHeartRefill: () => void;
  syncWithSupabase: (userId: string) => Promise<void>;
  completeLesson: (lessonId: string) => Promise<void>;
  buyHeartRefill: () => Promise<boolean>;
  buyStreakFreeze: () => Promise<boolean>;
  buyDoubleXpBoost: () => Promise<boolean>;
  upgradeToPro: (tier: SubscriptionTier, planCycle?: PlanCycle) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  updateProfile: (username: string, avatarIcon?: string) => Promise<void>;
  toggleSound: () => void;
  evaluateWeeklyLeagues: () => Promise<{
    promoted: boolean;
    demoted: boolean;
    previousLeague: string;
    newLeague: string;
    xpAwarded: number;
    message: string;
  }>;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      weeklyXp: 0,
      leagueId: 'bronze',
      rankChange: 'none',
      hearts: 5,
      streak: 1,
      level: 1,
      completedLessons: [],
      lastHeartLostAt: null,
      username: 'CodeExplorer',
      avatarIcon: '👾',
      soundEnabled: true,
      isSyncing: false,
      streakFreezesCount: 0,
      doubleXpUntil: null,
      activePathId: 'web-dev',
      
      // SaaS Subscriptions Default
      isPro: false,
      subscriptionTier: 'basic',
      subscriptionPlanCycle: null,
      subscriptionExpiresAt: null,
      unlockedAdvancedPathId: 'web-dev',
      unlockedAdvancedPathIds: ['web-dev'],
      studentPlusRenewalCount: 0,
      studentPlusPathLocked: false,
      role: 'user',

      setActivePath: (pathId: string) => {
        set({ activePathId: pathId });
      },

      setStudentPlusAdvancedPath: async (pathId: string) => {
        const { subscriptionTier, unlockedAdvancedPathIds, studentPlusRenewalCount } = get();
        const maxAllowed = 1 + studentPlusRenewalCount;
        const currentUnlocked = unlockedAdvancedPathIds && unlockedAdvancedPathIds.length > 0 
          ? unlockedAdvancedPathIds 
          : [get().unlockedAdvancedPathId || 'web-dev'];

        if (currentUnlocked.includes(pathId)) {
          set({ unlockedAdvancedPathId: pathId });
          sounds.playCorrect();
          return;
        }

        if (subscriptionTier === 'student_plus' && currentUnlocked.length >= maxAllowed) {
          sounds.playWrong();
          alert(`You have reached your limit of ${maxAllowed} advanced path(s) for StudentPlus. Renew your StudentPlus subscription to unlock +1 more path!`);
          return;
        }

        const newUnlocked = Array.from(new Set([...currentUnlocked, pathId]));
        set({ 
          unlockedAdvancedPathIds: newUnlocked, 
          unlockedAdvancedPathId: pathId, 
          studentPlusPathLocked: true 
        });
        sounds.playFanfare();

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('profiles').update({
                unlocked_advanced_path_id: pathId,
                unlocked_advanced_path_ids: newUnlocked,
                student_plus_path_locked: true,
              }).eq('id', user.id);
            }
          } catch {}
        }
      },

      setLeagueId: (leagueId: 'bronze' | 'silver' | 'gold' | 'diamond') => {
        set({ leagueId });
      },

      checkHeartRefill: () => {
        if (get().isPro) {
          // Pro members always have maximum/infinite hearts
          if (get().hearts < MAX_HEARTS) {
            set({ hearts: MAX_HEARTS, lastHeartLostAt: null });
          }
          return;
        }

        const { hearts, lastHeartLostAt } = get();
        if (hearts >= MAX_HEARTS) {
          if (lastHeartLostAt !== null) {
            set({ lastHeartLostAt: null });
          }
          return;
        }

        const now = Date.now();
        let currentTimerStart = lastHeartLostAt ? Number(lastHeartLostAt) : null;
        if (!currentTimerStart || isNaN(currentTimerStart) || currentTimerStart > now) {
          set({ lastHeartLostAt: now });
          return;
        }

        const elapsed = now - currentTimerStart;
        // 500ms grace buffer so that as soon as the timer reaches 0:00, the refill triggers immediately
        const heartsToRegenerate = Math.floor((elapsed + 500) / HEART_REFILL_INTERVAL_MS);

        if (heartsToRegenerate > 0) {
          const newHearts = Math.min(MAX_HEARTS, hearts + heartsToRegenerate);
          const remainderTime = (elapsed + 500) % HEART_REFILL_INTERVAL_MS;
          const nextLostAt = newHearts >= MAX_HEARTS ? null : now - remainderTime;

          set({
            hearts: newHearts,
            lastHeartLostAt: nextLostAt,
          });

          // Sync with cloud if user is logged in
          const client = supabase;
          if (client) {
            client.auth.getUser().then(({ data: { user } }) => {
              if (user) {
                client.from('profiles').update({ hearts: newHearts }).eq('id', user.id);
              }
            }).catch(() => {});
          }
        }
      },

      syncWithSupabase: async (userId: string) => {
        if (!supabase) return;
        set({ isSyncing: true });
        
        try {
          let { data, error } = await supabase
            .from('profiles')
            .select('xp, hearts, streak, level, completed_lessons, username, league_id, weekly_xp, rank_change, is_pro, subscription_tier, subscription_expires_at, unlocked_advanced_path_id, student_plus_path_locked, role')
            .eq('id', userId)
            .single();

          // Fallback if some columns have not yet been added to Supabase table
          let profileRecord: any = data;
          if (error) {
            const fallback = await supabase
              .from('profiles')
              .select('xp, hearts, streak, level, username')
              .eq('id', userId)
              .single();
            profileRecord = fallback.data ? { ...fallback.data, completed_lessons: [] } : null;
            error = fallback.error;
          }

          if (profileRecord && !error) {
            const mergedCompleted = Array.from(new Set([
              ...get().completedLessons,
              ...(profileRecord.completed_lessons || [])
            ]));
            const resolvedXp = Math.max(get().xp, profileRecord.xp || 0);
            const resolvedLevel = Math.max(get().level, Math.floor(resolvedXp / 1000) + 1);
            const resolvedWeeklyXp = profileRecord.weekly_xp !== undefined && profileRecord.weekly_xp !== null 
              ? profileRecord.weekly_xp 
              : get().weeklyXp;
            const resolvedLeague = (profileRecord.league_id as any) || get().leagueId || 'bronze';
            const resolvedRankChange = (profileRecord.rank_change as any) || get().rankChange || 'none';
            
            // Robust subscription tier resolution: prioritize active local paid tier
            let resolvedSubTier: SubscriptionTier = 'basic';
            const cloudTier = profileRecord.subscription_tier as SubscriptionTier | undefined;
            const localTier = get().subscriptionTier;
            const cloudIsPro = profileRecord.is_pro !== undefined ? Boolean(profileRecord.is_pro) : false;
            const localIsPro = get().isPro;

            if (localTier && localTier !== 'basic' && localTier !== 'free') {
              resolvedSubTier = localTier;
            } else if (cloudTier && cloudTier !== 'basic' && cloudTier !== 'free') {
              resolvedSubTier = cloudTier;
            } else if (localIsPro || cloudIsPro) {
              resolvedSubTier = 'student_plus';
            } else {
              resolvedSubTier = 'basic';
            }

            const resolvedIsPro = resolvedSubTier === 'student_plus' || resolvedSubTier === 'pro';
            const resolvedExpiresAt = profileRecord.subscription_expires_at || get().subscriptionExpiresAt;
            const resolvedAdvancedPath = profileRecord.unlocked_advanced_path_id || get().unlockedAdvancedPathId || 'web-dev';
            const resolvedPathLocked = profileRecord.student_plus_path_locked !== undefined 
              ? Boolean(profileRecord.student_plus_path_locked) 
              : (resolvedAdvancedPath !== 'web-dev');

            // Compute hearts: local regenerated hearts must NOT be wiped out by stale cloud 0
            let currentHearts = resolvedIsPro ? MAX_HEARTS : Math.max(get().hearts, profileRecord.hearts ?? 0);
            let currentLostAt = get().lastHeartLostAt ? Number(get().lastHeartLostAt) : null;

            if (resolvedIsPro) {
              currentHearts = MAX_HEARTS;
              currentLostAt = null;
            } else if (currentHearts < MAX_HEARTS && currentLostAt) {
              const elapsed = Date.now() - currentLostAt;
              const regen = Math.floor((elapsed + 500) / HEART_REFILL_INTERVAL_MS);
              if (regen > 0) {
                currentHearts = Math.min(MAX_HEARTS, currentHearts + regen);
                currentLostAt = currentHearts >= MAX_HEARTS 
                  ? null 
                  : currentLostAt + (regen * HEART_REFILL_INTERVAL_MS);
              }
            } else if (currentHearts >= MAX_HEARTS) {
              currentLostAt = null;
            } else if (!currentLostAt) {
              currentLostAt = Date.now();
            }

            const resolvedHearts = currentHearts;
            const resolvedLastLostAt = currentLostAt;
            const resolvedUsername = profileRecord.username || get().username || 'CodeExplorer';

            const { data: authData } = await supabase.auth.getUser();
            const email = authData?.user?.email;
            const isAdminEmail = email === 'mark.entrina12@gmail.com';
            const resolvedRole: 'admin' | 'user' = isAdminEmail ? 'admin' : (profileRecord.role || get().role || 'user');

            set({ 
              xp: resolvedXp, 
              weeklyXp: resolvedWeeklyXp,
              leagueId: resolvedLeague,
              rankChange: resolvedRankChange,
              hearts: resolvedHearts, 
              streak: Math.max(get().streak, profileRecord.streak || 1), 
              level: resolvedLevel,
              completedLessons: mergedCompleted,
              lastHeartLostAt: resolvedLastLostAt,
              username: resolvedUsername,
              isPro: resolvedIsPro,
              subscriptionTier: resolvedSubTier,
              subscriptionExpiresAt: resolvedExpiresAt,
              unlockedAdvancedPathId: resolvedAdvancedPath,
              studentPlusPathLocked: resolvedPathLocked,
              role: resolvedRole,
              isSyncing: false 
            });

            // Update cloud if local had more progress
            try {
              await supabase.from('profiles').update({
                xp: resolvedXp,
                weekly_xp: resolvedWeeklyXp,
                league_id: resolvedLeague,
                level: resolvedLevel,
                completed_lessons: mergedCompleted,
                hearts: resolvedHearts,
                is_pro: resolvedIsPro,
                subscription_tier: resolvedSubTier,
                role: resolvedRole,
              }).eq('id', userId);
            } catch {
              // Ignore background update errors
            }
          } else {
            set({ isSyncing: false });
          }
        } catch {
          set({ isSyncing: false });
        }
      },

      addXp: async (amount) => {
        const tier = get().subscriptionTier;
        const multiplier = tier === 'pro' 
          ? 2 
          : tier === 'student_plus' 
          ? 1.5 
          : (get().doubleXpUntil && get().doubleXpUntil! > Date.now() ? 2 : 1);
        const grantedAmount = Math.round(amount * multiplier);

        const newXp = get().xp + grantedAmount;
        const newWeeklyXp = (get().weeklyXp || 0) + grantedAmount;
        const newLevel = Math.floor(newXp / 1000) + 1;
        set({ xp: newXp, weeklyXp: newWeeklyXp, level: newLevel });

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('profiles').update({ 
                xp: newXp, 
                weekly_xp: newWeeklyXp, 
                level: newLevel 
              }).eq('id', user.id);
            }
          } catch {
            // Ignore offline/unconfigured updates
          }
        }
      },

      loseHeart: async () => {
        // StudentPlus and Pro members have Infinite Hearts!
        if (get().isPro) {
          return;
        }

        const currentHearts = get().hearts;
        const newHearts = Math.max(0, currentHearts - 1);
        const now = Date.now();
        const existingLostAt = get().lastHeartLostAt ? Number(get().lastHeartLostAt) : null;
        const newLastHeartLostAt = existingLostAt || now;

        set({ 
          hearts: newHearts, 
          lastHeartLostAt: newHearts < MAX_HEARTS ? newLastHeartLostAt : null 
        });

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('profiles').update({ hearts: newHearts }).eq('id', user.id);
            }
          } catch {
            // Ignore offline/unconfigured updates
          }
        }
      },

      earnHeart: async () => {
        if (get().isPro) {
          set({ hearts: MAX_HEARTS, lastHeartLostAt: null });
          return;
        }

        const currentHearts = get().hearts;
        if (currentHearts >= MAX_HEARTS) return;

        const newHearts = Math.min(MAX_HEARTS, currentHearts + 1);
        const existingLostAt = get().lastHeartLostAt ? Number(get().lastHeartLostAt) : null;
        set({ 
          hearts: newHearts, 
          lastHeartLostAt: newHearts >= MAX_HEARTS ? null : (existingLostAt || Date.now())
        });

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('profiles').update({ hearts: newHearts }).eq('id', user.id);
            }
          } catch {
            // Ignore offline updates
          }
        }
      },

      refillHearts: async () => {
        set({ hearts: MAX_HEARTS, lastHeartLostAt: null });
        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('profiles').update({ hearts: MAX_HEARTS }).eq('id', user.id);
            }
          } catch {}
        }
      },

      completeLesson: async (lessonId: string) => {
        const { completedLessons, xp, streak, addXp } = get();
        if (!completedLessons.includes(lessonId)) {
          const newCompleted = [...completedLessons, lessonId];
          const newStreak = streak + 1;
          set({ 
            completedLessons: newCompleted,
            streak: newStreak
          });
          
          await addXp(100);

          if (supabase) {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                await supabase.from('profiles').update({
                  completed_lessons: newCompleted,
                  streak: newStreak
                }).eq('id', user.id);
              }
            } catch {
              // Ignore offline sync errors
            }
          }
        } else {
          // Practice completion awards standard practice XP
          await addXp(25);
        }
      },

      buyHeartRefill: async () => {
        const { xp, hearts } = get();
        if (hearts >= MAX_HEARTS) return false;
        if (xp >= 150) {
          const newXp = xp - 150;
          set({ 
            xp: newXp, 
            hearts: MAX_HEARTS, 
            lastHeartLostAt: null 
          });
          sounds.playCorrect();

          if (supabase) {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                await supabase.from('profiles').update({ xp: newXp, hearts: MAX_HEARTS }).eq('id', user.id);
              }
            } catch {}
          }
          return true;
        }
        return false;
      },

      buyStreakFreeze: async () => {
        const { xp, streakFreezesCount } = get();
        if (streakFreezesCount >= 2) return false;
        if (xp >= 200) {
          const newXp = xp - 200;
          const newCount = streakFreezesCount + 1;
          set({ xp: newXp, streakFreezesCount: newCount });
          sounds.playCorrect();

          if (supabase) {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                await supabase.from('profiles').update({ xp: newXp }).eq('id', user.id);
              }
            } catch {}
          }
          return true;
        }
        return false;
      },

      buyDoubleXpBoost: async () => {
        const { xp } = get();
        if (xp >= 250) {
          const newXp = xp - 250;
          // 30 minutes boost = 30 * 60 * 1000 ms
          const expiry = Date.now() + 30 * 60 * 1000;
          set({ xp: newXp, doubleXpUntil: expiry });
          sounds.playFanfare();

          if (supabase) {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                await supabase.from('profiles').update({ xp: newXp }).eq('id', user.id);
              }
            } catch {}
          }
          return true;
        }
        return false;
      },

      // SaaS Pro Upgrade Handler
      upgradeToPro: async (tier: SubscriptionTier, planCycle: PlanCycle = 'yearly') => {
        const expiryDate = new Date(Date.now() + (planCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString();

        const isPaid = tier === 'student_plus' || tier === 'pro';
        const freezesToGrant = tier === 'pro' ? 4 : tier === 'student_plus' ? 2 : 0;
        
        const isStudentPlusRenewal = tier === 'student_plus';
        const newRenewalCount = isStudentPlusRenewal ? get().studentPlusRenewalCount + 1 : get().studentPlusRenewalCount;

        set({
          isPro: isPaid,
          subscriptionTier: tier,
          subscriptionPlanCycle: planCycle,
          subscriptionExpiresAt: expiryDate,
          hearts: MAX_HEARTS,
          lastHeartLostAt: null,
          streakFreezesCount: Math.max(get().streakFreezesCount, freezesToGrant),
          studentPlusRenewalCount: newRenewalCount,
        });

        sounds.playFanfare();

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('profiles').update({
                is_pro: isPaid,
                subscription_tier: tier,
                subscription_expires_at: expiryDate,
                hearts: MAX_HEARTS,
                student_plus_renewal_count: newRenewalCount,
              }).eq('id', user.id);
            }
          } catch {}
        }
      },

      // Cancel Subscription Handler
      cancelSubscription: async () => {
        set({
          isPro: false,
          subscriptionTier: 'basic',
          subscriptionPlanCycle: null,
          subscriptionExpiresAt: null,
        });

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('profiles').update({
                is_pro: false,
                subscription_tier: 'basic',
                subscription_expires_at: null,
              }).eq('id', user.id);
            }
          } catch {}
        }
      },

      updateProfile: async (newUsername: string, newAvatar?: string) => {
        const updates: Partial<GameState> = { username: newUsername };
        if (newAvatar) updates.avatarIcon = newAvatar;
        set(updates);

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('profiles').update({ username: newUsername }).eq('id', user.id);
            }
          } catch {}
        }
      },

      evaluateWeeklyLeagues: async () => {
        const LEAGUE_ORDER = ['bronze', 'silver', 'gold', 'diamond'];
        const REWARD_TABLE: Record<string, { promotionXp: number; maintainXp: number; demoteXp: number }> = {
          bronze: { promotionXp: 50, maintainXp: 20, demoteXp: 10 },
          silver: { promotionXp: 100, maintainXp: 35, demoteXp: 15 },
          gold: { promotionXp: 200, maintainXp: 50, demoteXp: 25 },
          diamond: { promotionXp: 400, maintainXp: 100, demoteXp: 50 },
        };

        const currentWeeklyXp = get().weeklyXp || 0;
        const currentLeague = get().leagueId || 'bronze';

        // Check if user already had their weekly cycle evaluated and has 0 weekly XP
        if (currentWeeklyXp === 0) {
          return {
            promoted: false,
            demoted: false,
            previousLeague: currentLeague,
            newLeague: currentLeague,
            xpAwarded: 0,
            message: `Your league standing is already up to date (${currentLeague.toUpperCase()} League). Complete lessons to earn Weekly XP for the next tournament cycle!`
          };
        }

        // 1. Try triggering remote Supabase Edge Function first
        if (supabase) {
          try {
            const { data, error } = await supabase.functions.invoke('weekly-league-evaluation', {
              body: { triggered_by: 'client_request' }
            });
            if (!error && data?.success) {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                await get().syncWithSupabase(user.id);
              }
              sounds.playFanfare();
              return {
                promoted: data.summary?.total_promotions > 0,
                demoted: data.summary?.total_demotions > 0,
                previousLeague: get().leagueId,
                newLeague: get().leagueId,
                xpAwarded: data.summary?.total_xp_awarded || 100,
                message: 'Supabase Edge Function executed! Weekly ranks and XP rewards updated.'
              };
            }
          } catch (err) {
            console.warn('Edge function invoke fallback to local calculation:', err);
          }
        }

        // 2. Local Fallback Simulation (Only runs when weeklyXp > 0)
        const currentOrder = LEAGUE_ORDER.indexOf(currentLeague);
        
        let newLeague = currentLeague;
        let rankChange: 'up' | 'down' | 'none' = 'none';
        let xpReward = REWARD_TABLE[currentLeague]?.maintainXp || 50;

        // Promotion condition (e.g. earned >= 100 XP this week)
        if (currentWeeklyXp >= 100 && currentOrder < 3) {
          newLeague = LEAGUE_ORDER[currentOrder + 1] as any;
          rankChange = 'up';
          xpReward = REWARD_TABLE[currentLeague]?.promotionXp || 100;
        } else if (currentWeeklyXp < 30 && currentOrder > 0 && Math.random() > 0.8) {
          newLeague = LEAGUE_ORDER[currentOrder - 1] as any;
          rankChange = 'down';
          xpReward = REWARD_TABLE[currentLeague]?.demoteXp || 20;
        }

        const newXp = get().xp + xpReward;
        const newLevel = Math.floor(newXp / 1000) + 1;

        set({
          leagueId: newLeague as any,
          rankChange,
          xp: newXp,
          level: newLevel,
          weeklyXp: 0, // Reset weekly XP to 0 so it cannot be evaluated again until new XP is earned
        });

        sounds.playFanfare();

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('profiles').update({
                league_id: newLeague,
                xp: newXp,
                weekly_xp: 0,
                level: newLevel,
                rank_change: rankChange
              }).eq('id', user.id);
            }
          } catch {}
        }

        return {
          promoted: rankChange === 'up',
          demoted: rankChange === 'down',
          previousLeague: currentLeague,
          newLeague,
          xpAwarded: xpReward,
          message: rankChange === 'up' 
            ? `🎉 Promoted to ${newLeague.toUpperCase()} League! Earned +${xpReward} XP reward.`
            : `🏆 Weekly evaluation completed. Granted +${xpReward} XP reward.`
        };
      },

      toggleSound: () => {
        set({ soundEnabled: !get().soundEnabled });
      },
    }),
    {
      name: 'codequest_gamestate',
      partialize: (state) => ({
        xp: state.xp,
        weeklyXp: state.weeklyXp,
        leagueId: state.leagueId,
        rankChange: state.rankChange,
        hearts: state.hearts,
        streak: state.streak,
        level: state.level,
        completedLessons: state.completedLessons,
        lastHeartLostAt: state.lastHeartLostAt,
        username: state.username,
        avatarIcon: state.avatarIcon,
        soundEnabled: state.soundEnabled,
        streakFreezesCount: state.streakFreezesCount,
        doubleXpUntil: state.doubleXpUntil,
        isPro: state.isPro,
        subscriptionTier: state.subscriptionTier,
        subscriptionPlanCycle: state.subscriptionPlanCycle,
        subscriptionExpiresAt: state.subscriptionExpiresAt,
        unlockedAdvancedPathId: state.unlockedAdvancedPathId,
      }),
    }
  )
);
