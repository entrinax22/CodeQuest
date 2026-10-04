import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { safeFetchSubscription, safeUpsertSubscription } from '../lib/subscriptionDb';
import { sounds } from '../lib/sound';
import { getPathMeta } from '../data/learningPaths';

// 12 minutes per heart -> 5 hearts = 60 minutes = 1 hour total refill time
export const HEART_REFILL_INTERVAL_MS = 12 * 60 * 1000;
export const PRACTICE_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes cooldown for practice arena
export const MAX_HEARTS = 5;

export type SubscriptionTier = 'basic' | 'student_plus' | 'pro' | 'free';
export type PlanCycle = 'monthly' | 'yearly';

const getTodayDateStr = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getYesterdayDateStr = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const safeParseArray = (val: any, fallback: string[] = []): string[] => {
  if (!val) return fallback;
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return fallback;
};

interface GameState {
  xp: number;
  weeklyXp: number;
  leagueId: 'bronze' | 'silver' | 'gold' | 'diamond';
  rankChange: 'up' | 'down' | 'none';
  hearts: number;
  streak: number;
  lastStreakDate: string | null;
  level: number;
  completedLessons: string[];
  lastHeartLostAt: number | null;
  lastPracticeAt: number | null;
  recordPracticeCompletion: () => void;
  username: string;
  avatarIcon: string;
  careerGoal: string;
  bio: string;
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
  setStudentPlusAdvancedPath: (pathId: string) => Promise<boolean>;
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
  updateProfile: (username: string, avatarIcon?: string, careerGoal?: string, bio?: string) => Promise<void>;
  toggleSound: () => void;
  resetStore: () => void;
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
      lastStreakDate: null,
      level: 1,
      completedLessons: [],
      lastHeartLostAt: null,
      lastPracticeAt: null,
      username: 'CodeExplorer',
      avatarIcon: '👾',
      careerGoal: 'Full-Stack Developer',
      bio: 'Leveling up my software engineering skills on CodeQuest Academy.',
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
      unlockedAdvancedPathIds: ['web-dev', 'python'],
      studentPlusRenewalCount: 0,
      studentPlusPathLocked: false,
      role: 'user',

      setActivePath: async (pathId: string) => {
        set({ activePathId: pathId });
        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('profiles').update({ active_path_id: pathId }).eq('id', user.id);
            }
          } catch {}
        }
      },

      setStudentPlusAdvancedPath: async (pathId: string): Promise<boolean> => {
        let liveTier: SubscriptionTier = get().subscriptionTier;
        let liveRenewalCount = get().studentPlusRenewalCount;
        let liveUnlockedPathIds = get().unlockedAdvancedPathIds || [];
        let userId: string | null = null;

        // 1. Fetch live profile and subscription directly from Supabase DB to verify current entitlement
        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              userId = user.id;

              // Fetch latest profile row
              const { data: profile } = await supabase
                .from('profiles')
                .select('subscription_tier, is_pro, student_plus_renewal_count, unlocked_advanced_path_ids, unlocked_advanced_path_id')
                .eq('id', user.id)
                .maybeSingle();

              // Fetch latest subscription row
              const subRecord = await safeFetchSubscription(user.id);

              if (subRecord && subRecord.tier) {
                liveTier = subRecord.tier as SubscriptionTier;
              } else if (profile?.subscription_tier) {
                liveTier = profile.subscription_tier as SubscriptionTier;
              } else if (profile?.is_pro) {
                liveTier = 'pro';
              }

              if (profile) {
                liveRenewalCount = profile.student_plus_renewal_count ?? liveRenewalCount;
                const dbPaths = safeParseArray(profile.unlocked_advanced_path_ids, []);
                liveUnlockedPathIds = Array.from(new Set(['web-dev', 'python', ...dbPaths]));
              }
            }
          } catch (err) {
            console.warn('Could not fetch live DB state for unlock validation:', err);
          }
        }

        // 2. Strict Database Verification: Basic / free tier users CANNOT unlock advance paths
        if (liveTier !== 'student_plus' && liveTier !== 'pro') {
          console.warn('[Unlock Guard] User subscription tier in database is basic. Unlocking rejected.');
          set({ subscriptionTier: 'basic', isPro: false });
          return false;
        }

        // If PRO tier in DB, all advance tracks are unlocked
        if (liveTier === 'pro') {
          set({
            subscriptionTier: 'pro',
            isPro: true,
            unlockedAdvancedPathId: pathId,
            activePathId: pathId
          });
          sounds.playCorrect();
          return true;
        }

        // 3. Compare DB unlocked paths with requested track for StudentPlus
        const maxAllowed = 1 + liveRenewalCount;
        const currentUnlockedAdvanced = liveUnlockedPathIds.filter(id => getPathMeta(id)?.isAdvancedTrack);

        let newUnlocked: string[];
        if (currentUnlockedAdvanced.includes(pathId)) {
          newUnlocked = liveUnlockedPathIds;
        } else if (currentUnlockedAdvanced.length < maxAllowed) {
          // Permanent / Lifetime unlock this track by adding it to their array
          newUnlocked = Array.from(new Set([...liveUnlockedPathIds, pathId]));
        } else {
          // Limit Reached: Previously unlocked paths are lifetime unlocked and cannot be swapped or locked again.
          // To unlock another advanced path, they must renew their StudentPlus plan to increase slots!
          alert(`🔒 Track Unlock Limit Reached:\n\nYou have already used your ${currentUnlockedAdvanced.length} available advanced path unlock(s).\n\nYour unlocked paths are lifetime unlocked for your account! To unlock "${getPathMeta(pathId)?.title || pathId}", please renew your StudentPlus subscription to get another advanced path unlock slot, or upgrade to CodeQuest PRO!`);
          return false;
        }

        // 4. Update local state
        set({
          subscriptionTier: 'student_plus',
          isPro: true,
          unlockedAdvancedPathIds: newUnlocked,
          unlockedAdvancedPathId: pathId,
          studentPlusPathLocked: true
        });
        sounds.playFanfare();

        // 5. Update database with new unlocked state
        if (supabase && userId) {
          try {
            const { error: profileErr } = await supabase.from('profiles').update({
              unlocked_advanced_path_id: pathId,
              unlocked_advanced_path_ids: newUnlocked,
              student_plus_path_locked: true,
              subscription_tier: liveTier
            }).eq('id', userId);

            if (profileErr) {
              console.warn('[Supabase Schema Notice] Could not update unlocked_advanced_path_id on profiles. Writing to subscriptions fallback.', profileErr.message);
              await safeUpsertSubscription(userId, {
                tier: liveTier,
                is_pro: true,
                username: get().username
              });
            }
          } catch (err) {
            console.warn('Failed to persist unlocked advanced path:', err);
          }
        }

        return true;
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
            .select('*')
            .eq('id', userId)
            .single();

          // Fallback if record query fails
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

          // 2. Fetch from separated subscriptions table if it exists
          const subscriptionRecord: any = await safeFetchSubscription(userId);

          if (!profileRecord) {
            // Initial row creation in Supabase for authenticated user if record doesn't exist yet
            const { data: authData } = await supabase.auth.getUser();
            const email = authData?.user?.email;
            const isAdminEmail = email === 'mark.entrina12@gmail.com';
            const initialRole: 'admin' | 'user' = isAdminEmail ? 'admin' : 'user';

            const newProfilePayload = {
              id: userId,
              username: get().username || 'CodeExplorer',
              xp: get().xp || 0,
              weekly_xp: get().weeklyXp || 0,
              streak: get().streak || 1,
              level: get().level || 1,
              hearts: get().hearts || 5,
              league_id: get().leagueId || 'bronze',
              career_goal: get().careerGoal || 'Full-Stack Developer',
              bio: get().bio || 'Leveling up my software engineering skills on CodeQuest Academy.',
              completed_lessons: get().completedLessons || [],
              role: initialRole
            };

            await supabase.from('profiles').upsert([newProfilePayload]);

            // Pre-populate default basic subscription entitlement in subscriptions table
            await safeUpsertSubscription(userId, { tier: 'basic', is_pro: false, cycle: 'monthly' });

            set({ role: initialRole, isSyncing: false });
            return;
          }

          if (profileRecord) {
            const localCompleted = get().completedLessons || [];
            const dbCompleted = Array.isArray(profileRecord.completed_lessons) ? profileRecord.completed_lessons : [];
            const resolvedCompleted = Array.from(new Set([...localCompleted, ...dbCompleted]));

            const localXp = get().xp || 0;
            const dbXp = profileRecord.xp ?? 0;
            const resolvedXp = Math.max(localXp, dbXp);

            const localWeeklyXp = get().weeklyXp || 0;
            const dbWeeklyXp = profileRecord.weekly_xp ?? 0;
            const resolvedWeeklyXp = Math.max(localWeeklyXp, dbWeeklyXp);

            const resolvedLevel = Math.floor(resolvedXp / 1000) + 1;
            const resolvedLeague = (profileRecord.league_id as any) || 'bronze';
            const resolvedRankChange = (profileRecord.rank_change as any) || 'none';

            const localStreak = get().streak || 1;
            const dbStreak = profileRecord.streak ?? 1;
            const resolvedStreak = Math.max(localStreak, dbStreak);
            
            // Cloud database profile/subscriptions is the authoritative source of truth for subscription tier & role
            const cloudTier = subscriptionRecord ? subscriptionRecord.tier : (profileRecord.subscription_tier as SubscriptionTier | undefined);
            const resolvedSubTier: SubscriptionTier = (cloudTier as SubscriptionTier) || 'basic';

            const resolvedIsPro = subscriptionRecord ? subscriptionRecord.is_pro : (resolvedSubTier === 'student_plus' || resolvedSubTier === 'pro' || profileRecord.is_pro);
            const resolvedExpiresAt = subscriptionRecord ? subscriptionRecord.expires_at : (profileRecord.subscription_expires_at || null);
            const resolvedCycle = subscriptionRecord ? subscriptionRecord.cycle : (profileRecord.subscription_plan_cycle || null);

            const resolvedAdvancedPath = profileRecord.unlocked_advanced_path_id || get().unlockedAdvancedPathId || 'web-dev';
            const resolvedPathLocked = profileRecord.student_plus_path_locked !== undefined 
              ? Boolean(profileRecord.student_plus_path_locked) 
              : (resolvedAdvancedPath !== 'web-dev');

            const resolvedActivePath = profileRecord.active_path_id || get().activePathId || 'web-dev';
            const resolvedStreakFreezes = profileRecord.streak_freezes_count ?? get().streakFreezesCount ?? 0;
            const resolvedDoubleXpUntil = profileRecord.double_xp_until ?? get().doubleXpUntil ?? null;
            const parsedDbUnlockedPaths = safeParseArray(profileRecord.unlocked_advanced_path_ids, []);
            const resolvedUnlockedAdvancedPathIds = Array.from(new Set([
              'web-dev',
              'python',
              ...parsedDbUnlockedPaths
            ]));
            const resolvedStudentPlusRenewalCount = profileRecord.student_plus_renewal_count ?? get().studentPlusRenewalCount ?? 0;
            const resolvedAvatarIcon = profileRecord.avatar_icon || profileRecord.avatar || get().avatarIcon || '👾';

            // Compute hearts & timer
            let currentHearts = resolvedIsPro ? MAX_HEARTS : Math.max(0, Math.min(MAX_HEARTS, profileRecord.hearts ?? get().hearts ?? MAX_HEARTS));
            let currentLostAt = profileRecord.last_heart_lost_at ? Number(profileRecord.last_heart_lost_at) : (get().lastHeartLostAt ? Number(get().lastHeartLostAt) : null);

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
            }

            const resolvedHearts = currentHearts;
            const resolvedLastLostAt = currentLostAt;
            const resolvedUsername = profileRecord.username || get().username || 'CodeExplorer';
            const resolvedCareerGoal = profileRecord.career_goal || get().careerGoal || 'Full-Stack Developer';
            const resolvedBio = profileRecord.bio || get().bio || 'Leveling up my software engineering skills on CodeQuest Academy.';

            const { data: authData } = await supabase.auth.getUser();
            const email = authData?.user?.email;
            const isAdminEmail = email === 'mark.entrina12@gmail.com';
            const resolvedRole: 'admin' | 'user' = isAdminEmail ? 'admin' : (profileRecord.role === 'admin' ? 'admin' : 'user');

            set({ 
              xp: resolvedXp, 
              weeklyXp: resolvedWeeklyXp,
              leagueId: resolvedLeague,
              rankChange: resolvedRankChange,
              hearts: resolvedHearts, 
              streak: resolvedStreak, 
              level: resolvedLevel,
              completedLessons: resolvedCompleted,
              lastHeartLostAt: resolvedLastLostAt,
              username: resolvedUsername,
              avatarIcon: resolvedAvatarIcon,
              careerGoal: resolvedCareerGoal,
              bio: resolvedBio,
              isPro: resolvedIsPro,
              subscriptionTier: resolvedSubTier,
              subscriptionExpiresAt: resolvedExpiresAt,
              subscriptionPlanCycle: resolvedCycle,
              unlockedAdvancedPathId: resolvedAdvancedPath,
              unlockedAdvancedPathIds: resolvedUnlockedAdvancedPathIds,
              studentPlusRenewalCount: resolvedStudentPlusRenewalCount,
              studentPlusPathLocked: resolvedPathLocked,
              activePathId: resolvedActivePath,
              streakFreezesCount: resolvedStreakFreezes,
              doubleXpUntil: resolvedDoubleXpUntil,
              role: resolvedRole,
              isSyncing: false 
            });

            // Sync merged authoritative state back to Supabase via upsert
            try {
              // 1. Update separate subscriptions table if it exists
              await safeUpsertSubscription(userId, {
                tier: resolvedSubTier,
                is_pro: resolvedIsPro,
                expires_at: resolvedExpiresAt,
                cycle: resolvedCycle || 'monthly'
              });

              // 2. Update profiles table with full fields or fallback to core fields
              const fullProfilePayload = {
                id: userId,
                username: resolvedUsername,
                avatar_icon: resolvedAvatarIcon,
                xp: resolvedXp,
                weekly_xp: resolvedWeeklyXp,
                league_id: resolvedLeague,
                level: resolvedLevel,
                completed_lessons: resolvedCompleted,
                hearts: resolvedHearts,
                last_heart_lost_at: resolvedLastLostAt,
                streak: resolvedStreak,
                is_pro: resolvedIsPro,
                subscription_tier: resolvedSubTier,
                role: resolvedRole,
                career_goal: resolvedCareerGoal,
                bio: resolvedBio,
                active_path_id: resolvedActivePath,
                streak_freezes_count: resolvedStreakFreezes,
                double_xp_until: resolvedDoubleXpUntil,
                student_plus_renewal_count: resolvedStudentPlusRenewalCount,
                unlocked_advanced_path_id: resolvedAdvancedPath,
                unlocked_advanced_path_ids: resolvedUnlockedAdvancedPathIds
              };

              const { error: upsertErr } = await supabase.from('profiles').upsert([fullProfilePayload]);
              if (upsertErr) {
                // Fallback to core columns existing on user DB table
                await supabase.from('profiles').update({
                  xp: resolvedXp,
                  weekly_xp: resolvedWeeklyXp,
                  level: resolvedLevel,
                  completed_lessons: resolvedCompleted,
                  hearts: resolvedHearts,
                  streak: resolvedStreak,
                  username: resolvedUsername,
                  bio: resolvedBio,
                  career_goal: resolvedCareerGoal
                }).eq('id', userId);
              }
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

      addXp: async (amount: number) => {
        let currentXp = get().xp;
        let currentWeeklyXp = get().weeklyXp || 0;
        let currentTier = get().subscriptionTier;
        let currentDoubleXp = get().doubleXpUntil;
        let userId: string | null = null;

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              userId = user.id;
              const { data: profile } = await supabase
                .from('profiles')
                .select('xp, weekly_xp, subscription_tier, double_xp_until')
                .eq('id', user.id)
                .maybeSingle();

              if (profile) {
                currentXp = Math.max(profile.xp ?? 0, currentXp);
                currentWeeklyXp = Math.max(profile.weekly_xp ?? 0, currentWeeklyXp);
                if (profile.subscription_tier) currentTier = profile.subscription_tier as SubscriptionTier;
                if (profile.double_xp_until) currentDoubleXp = profile.double_xp_until;
              }
            }
          } catch {}
        }

        const multiplier = currentTier === 'pro' 
          ? 2 
          : currentTier === 'student_plus' 
          ? 1.5 
          : (currentDoubleXp && currentDoubleXp > Date.now() ? 2 : 1);
        const grantedAmount = Math.round(amount * multiplier);

        const newXp = currentXp + grantedAmount;
        const newWeeklyXp = currentWeeklyXp + grantedAmount;
        const newLevel = Math.floor(newXp / 1000) + 1;

        set({ xp: newXp, weeklyXp: newWeeklyXp, level: newLevel });

        if (supabase && userId) {
          try {
            await supabase.from('profiles').update({ 
              xp: newXp, 
              weekly_xp: newWeeklyXp, 
              level: newLevel 
            }).eq('id', userId);
          } catch {}
        }
      },

      loseHeart: async () => {
        let currentHearts = get().hearts;
        let isUserPro = get().isPro;
        let userId: string | null = null;

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              userId = user.id;
              const { data: profile } = await supabase
                .from('profiles')
                .select('hearts, is_pro, subscription_tier')
                .eq('id', user.id)
                .maybeSingle();

              if (profile) {
                currentHearts = profile.hearts ?? currentHearts;
                isUserPro = profile.is_pro || profile.subscription_tier === 'pro' || profile.subscription_tier === 'student_plus';
              }
            }
          } catch {}
        }

        if (isUserPro) {
          set({ hearts: MAX_HEARTS, lastHeartLostAt: null });
          return;
        }

        const newHearts = Math.max(0, currentHearts - 1);
        const now = Date.now();
        const existingLostAt = get().lastHeartLostAt ? Number(get().lastHeartLostAt) : null;
        const newLastHeartLostAt = existingLostAt || now;

        set({ 
          hearts: newHearts, 
          lastHeartLostAt: newHearts < MAX_HEARTS ? newLastHeartLostAt : null 
        });

        if (supabase && userId) {
          try {
            await supabase.from('profiles').update({ 
              hearts: newHearts,
              last_heart_lost_at: newHearts < MAX_HEARTS ? newLastHeartLostAt : null
            }).eq('id', userId);
          } catch {}
        }
      },

      earnHeart: async () => {
        let currentHearts = get().hearts;
        let isUserPro = get().isPro;
        let userId: string | null = null;

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              userId = user.id;
              const { data: profile } = await supabase
                .from('profiles')
                .select('hearts, is_pro, subscription_tier')
                .eq('id', user.id)
                .maybeSingle();

              if (profile) {
                currentHearts = profile.hearts ?? currentHearts;
                isUserPro = profile.is_pro || profile.subscription_tier === 'pro' || profile.subscription_tier === 'student_plus';
              }
            }
          } catch {}
        }

        if (isUserPro || currentHearts >= MAX_HEARTS) {
          if (isUserPro) set({ hearts: MAX_HEARTS, lastHeartLostAt: null });
          return;
        }

        const newHearts = Math.min(MAX_HEARTS, currentHearts + 1);
        const existingLostAt = get().lastHeartLostAt ? Number(get().lastHeartLostAt) : null;
        const nextLostAt = newHearts >= MAX_HEARTS ? null : (existingLostAt || Date.now());

        set({ 
          hearts: newHearts, 
          lastHeartLostAt: nextLostAt
        });

        if (supabase && userId) {
          try {
            await supabase.from('profiles').update({ 
              hearts: newHearts,
              last_heart_lost_at: nextLostAt
            }).eq('id', userId);
          } catch {}
        }
      },

      refillHearts: async () => {
        set({ hearts: MAX_HEARTS, lastHeartLostAt: null });
        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('profiles').update({ hearts: MAX_HEARTS, last_heart_lost_at: null }).eq('id', user.id);
            }
          } catch {}
        }
      },

      completeLesson: async (lessonId: string) => {
        let currentCompleted = get().completedLessons || [];
        let currentStreak = get().streak || 1;
        let currentStreakDate = get().lastStreakDate;
        let currentFreezes = get().streakFreezesCount || 0;
        let userId: string | null = null;

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              userId = user.id;
              const { data: profile } = await supabase
                .from('profiles')
                .select('completed_lessons, streak, streak_freezes_count')
                .eq('id', user.id)
                .maybeSingle();

              if (profile) {
                const dbCompleted = Array.isArray(profile.completed_lessons) ? profile.completed_lessons : [];
                currentCompleted = Array.from(new Set([...currentCompleted, ...dbCompleted]));
                currentStreak = Math.max(profile.streak ?? 1, currentStreak);
                currentFreezes = profile.streak_freezes_count ?? currentFreezes;
              }
            }
          } catch {}
        }

        const today = getTodayDateStr();
        const yesterday = getYesterdayDateStr();

        let newStreak = currentStreak;
        let newFreezes = currentFreezes;
        let newStreakDate = currentStreakDate;

        if (!currentStreakDate) {
          newStreak = Math.max(1, currentStreak);
          newStreakDate = today;
        } else if (currentStreakDate === today) {
          newStreakDate = today;
        } else if (currentStreakDate === yesterday) {
          newStreak = currentStreak + 1;
          newStreakDate = today;
        } else {
          if (currentFreezes > 0) {
            newFreezes = currentFreezes - 1;
            newStreak = currentStreak + 1;
            newStreakDate = today;
          } else {
            newStreak = 1;
            newStreakDate = today;
          }
        }

        const isNewCompletion = !currentCompleted.includes(lessonId);
        const newCompleted = isNewCompletion ? [...currentCompleted, lessonId] : currentCompleted;

        set({ 
          completedLessons: newCompleted,
          streak: newStreak,
          lastStreakDate: newStreakDate,
          streakFreezesCount: newFreezes
        });
        
        await get().addXp(isNewCompletion ? 100 : 25);

        if (supabase && userId) {
          try {
            await supabase.from('profiles').update({
              completed_lessons: newCompleted,
              streak: newStreak,
              xp: get().xp,
              weekly_xp: get().weeklyXp,
              level: get().level,
              streak_freezes_count: newFreezes
            }).eq('id', userId);

            try {
              await supabase.from('user_lesson_completions').upsert([{
                user_id: userId,
                lesson_id: lessonId,
                path_id: get().activePathId || 'web-dev',
                xp_earned: isNewCompletion ? 100 : 25
              }], { onConflict: 'user_id,lesson_id' });
            } catch {}
          } catch {}
        }
      },

      recordPracticeCompletion: () => {
        set({ lastPracticeAt: Date.now() });
      },

      buyHeartRefill: async () => {
        let currentXp = get().xp;
        let currentHearts = get().hearts;
        let userId: string | null = null;

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              userId = user.id;
              const { data: profile } = await supabase
                .from('profiles')
                .select('xp, hearts')
                .eq('id', user.id)
                .maybeSingle();

              if (profile) {
                currentXp = profile.xp ?? currentXp;
                currentHearts = profile.hearts ?? currentHearts;
              }
            }
          } catch {}
        }

        if (currentHearts >= MAX_HEARTS) return false;
        if (currentXp >= 150) {
          const newXp = currentXp - 150;
          set({ 
            xp: newXp, 
            hearts: MAX_HEARTS, 
            lastHeartLostAt: null 
          });
          sounds.playCorrect();

          if (supabase && userId) {
            try {
              await supabase.from('profiles').update({ 
                xp: newXp, 
                hearts: MAX_HEARTS, 
                last_heart_lost_at: null 
              }).eq('id', userId);
            } catch {}
          }
          return true;
        }
        return false;
      },

      buyStreakFreeze: async () => {
        let currentXp = get().xp;
        let currentFreezes = get().streakFreezesCount || 0;
        let userId: string | null = null;

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              userId = user.id;
              const { data: profile } = await supabase
                .from('profiles')
                .select('xp, streak_freezes_count')
                .eq('id', user.id)
                .maybeSingle();

              if (profile) {
                currentXp = profile.xp ?? currentXp;
                currentFreezes = profile.streak_freezes_count ?? currentFreezes;
              }
            }
          } catch {}
        }

        if (currentFreezes >= 2) return false;
        if (currentXp >= 200) {
          const newXp = currentXp - 200;
          const newCount = currentFreezes + 1;
          set({ xp: newXp, streakFreezesCount: newCount });
          sounds.playCorrect();

          if (supabase && userId) {
            try {
              await supabase.from('profiles').update({ 
                xp: newXp, 
                streak_freezes_count: newCount 
              }).eq('id', userId);
            } catch {}
          }
          return true;
        }
        return false;
      },

      buyDoubleXpBoost: async () => {
        let currentXp = get().xp;
        let userId: string | null = null;

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              userId = user.id;
              const { data: profile } = await supabase
                .from('profiles')
                .select('xp')
                .eq('id', user.id)
                .maybeSingle();

              if (profile) {
                currentXp = profile.xp ?? currentXp;
              }
            }
          } catch {}
        }

        if (currentXp >= 250) {
          const newXp = currentXp - 250;
          const expiry = Date.now() + 30 * 60 * 1000;
          set({ xp: newXp, doubleXpUntil: expiry });
          sounds.playFanfare();

          if (supabase && userId) {
            try {
              await supabase.from('profiles').update({ 
                xp: newXp, 
                double_xp_until: expiry 
              }).eq('id', userId);
            } catch {}
          }
          return true;
        }
        return false;
      },

      // SaaS Pro Upgrade Handler
      upgradeToPro: async (tier: SubscriptionTier, planCycle: PlanCycle = 'yearly') => {
        let currentRenewalCount = get().studentPlusRenewalCount;
        let userId: string | null = null;

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              userId = user.id;
              const { data: profile } = await supabase
                .from('profiles')
                .select('student_plus_renewal_count')
                .eq('id', user.id)
                .maybeSingle();

              if (profile) {
                currentRenewalCount = profile.student_plus_renewal_count ?? currentRenewalCount;
              }
            }
          } catch {}
        }

        const expiryDate = new Date(Date.now() + (planCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString();
        const isPaid = tier === 'student_plus' || tier === 'pro';
        const freezesToGrant = tier === 'pro' ? 4 : tier === 'student_plus' ? 2 : 0;
        
        const isStudentPlusRenewal = tier === 'student_plus' && get().subscriptionTier === 'student_plus';
        const newRenewalCount = isStudentPlusRenewal ? currentRenewalCount + 1 : (tier === 'student_plus' ? 0 : currentRenewalCount);

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

        if (supabase && userId) {
          try {
            await safeUpsertSubscription(userId, {
              tier: tier,
              is_pro: isPaid,
              cycle: planCycle,
              expires_at: expiryDate
            });

            await supabase.from('profiles').update({
              is_pro: isPaid,
              subscription_tier: tier,
              subscription_expires_at: expiryDate,
              hearts: MAX_HEARTS,
              student_plus_renewal_count: newRenewalCount,
            }).eq('id', userId);
          } catch {}
        }
      },

      // Cancel Subscription Handler
      cancelSubscription: async () => {
        let userId: string | null = null;

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              userId = user.id;
            }
          } catch {}
        }

        set({
          isPro: false,
          subscriptionTier: 'basic',
          subscriptionPlanCycle: null,
          subscriptionExpiresAt: null,
          unlockedAdvancedPathIds: ['web-dev'],
          unlockedAdvancedPathId: 'web-dev',
          studentPlusRenewalCount: 0,
        });

        sounds.playWrong();

        if (supabase && userId) {
          try {
            await safeUpsertSubscription(userId, {
              tier: 'basic',
              is_pro: false,
              cycle: 'monthly',
              expires_at: null
            });

            await supabase.from('profiles').update({
              is_pro: false,
              subscription_tier: 'basic',
              subscription_expires_at: null,
              unlocked_advanced_path_id: 'web-dev',
              unlocked_advanced_path_ids: ['web-dev', 'python'],
              student_plus_renewal_count: 0,
            }).eq('id', userId);
          } catch {}
        }
      },

      updateProfile: async (newUsername: string, newAvatar?: string, newCareerGoal?: string, newBio?: string) => {
        let userId: string | null = null;

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              userId = user.id;
              const { data: profile } = await supabase
                .from('profiles')
                .select('username, avatar_icon, career_goal, bio')
                .eq('id', user.id)
                .maybeSingle();

              if (profile) {
                if (profile.username === newUsername && profile.avatar_icon === newAvatar && profile.career_goal === newCareerGoal && profile.bio === newBio) {
                  return; // No changes needed
                }
              }
            }
          } catch {}
        }

        const updates: Partial<GameState> = { username: newUsername };
        if (newAvatar) updates.avatarIcon = newAvatar;
        if (newCareerGoal !== undefined) updates.careerGoal = newCareerGoal;
        if (newBio !== undefined) updates.bio = newBio;
        set(updates);

        if (supabase && userId) {
          try {
            const payload: any = { username: newUsername };
            if (newAvatar) payload.avatar_icon = newAvatar;
            if (newCareerGoal !== undefined) payload.career_goal = newCareerGoal;
            if (newBio !== undefined) payload.bio = newBio;
            await supabase.from('profiles').update(payload).eq('id', userId);
          } catch {}
        }
      },

      resetStore: () => {
        set({
          xp: 0,
          weeklyXp: 0,
          leagueId: 'bronze',
          rankChange: 'none',
          hearts: MAX_HEARTS,
          streak: 1,
          lastStreakDate: null,
          level: 1,
          completedLessons: [],
          lastHeartLostAt: null,
          username: 'CodeExplorer',
          avatarIcon: '👾',
          careerGoal: 'Full-Stack Developer',
          bio: 'Leveling up my software engineering skills on CodeQuest Academy.',
          streakFreezesCount: 0,
          doubleXpUntil: null,
          activePathId: 'web-dev',
          isPro: false,
          subscriptionTier: 'basic',
          subscriptionPlanCycle: null,
          subscriptionExpiresAt: null,
          unlockedAdvancedPathId: 'web-dev',
          unlockedAdvancedPathIds: ['web-dev'],
          studentPlusRenewalCount: 0,
          studentPlusPathLocked: false,
          role: 'user',
        });
        localStorage.removeItem('codequest_is_admin');
        try {
          localStorage.removeItem('codequest-game-storage');
        } catch {}
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
