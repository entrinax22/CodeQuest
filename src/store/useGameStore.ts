import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { sounds } from '../lib/sound';

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
      unlockedAdvancedPathIds: ['web-dev'],
      studentPlusRenewalCount: 0,
      studentPlusPathLocked: false,
      role: 'user',

      setActivePath: (pathId: string) => {
        set({ activePathId: pathId });
      },

      setStudentPlusAdvancedPath: async (pathId: string): Promise<boolean> => {
        const { subscriptionTier, unlockedAdvancedPathIds, studentPlusRenewalCount } = get();
        const maxAllowed = 1 + studentPlusRenewalCount;
        const currentUnlocked = unlockedAdvancedPathIds && unlockedAdvancedPathIds.length > 0 
          ? unlockedAdvancedPathIds 
          : [get().unlockedAdvancedPathId || 'web-dev'];

        if (currentUnlocked.includes(pathId)) {
          set({ unlockedAdvancedPathId: pathId });
          sounds.playCorrect();
          return true;
        }

        if (subscriptionTier === 'student_plus' && currentUnlocked.length >= maxAllowed) {
          sounds.playWrong();
          alert(`You have reached your limit of ${maxAllowed} advanced path(s) for StudentPlus. Renew your StudentPlus subscription to unlock +1 more path!`);
          return false;
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
            .select('xp, hearts, streak, level, completed_lessons, username, league_id, weekly_xp, rank_change, is_pro, subscription_tier, subscription_expires_at, unlocked_advanced_path_id, student_plus_path_locked, role, career_goal, bio')
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
            
            // Cloud database profile is the authoritative source of truth for subscription tier & role
            const cloudTier = profileRecord.subscription_tier as SubscriptionTier | undefined;
            const resolvedSubTier: SubscriptionTier = cloudTier || 'basic';

            const resolvedIsPro = resolvedSubTier === 'student_plus' || resolvedSubTier === 'pro';
            const resolvedExpiresAt = profileRecord.subscription_expires_at || null;
            const resolvedAdvancedPath = profileRecord.unlocked_advanced_path_id || 'web-dev';
            const resolvedPathLocked = profileRecord.student_plus_path_locked !== undefined 
              ? Boolean(profileRecord.student_plus_path_locked) 
              : (resolvedAdvancedPath !== 'web-dev');

            // Compute hearts & timer
            let currentHearts = resolvedIsPro ? MAX_HEARTS : Math.max(0, Math.min(MAX_HEARTS, profileRecord.hearts ?? get().hearts ?? MAX_HEARTS));
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
            }

            const resolvedHearts = currentHearts;
            const resolvedLastLostAt = currentLostAt;
            const resolvedUsername = profileRecord.username || 'CodeExplorer';
            const resolvedCareerGoal = profileRecord.career_goal || 'Full-Stack Developer';
            const resolvedBio = profileRecord.bio || 'Leveling up my software engineering skills on CodeQuest Academy.';

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
              careerGoal: resolvedCareerGoal,
              bio: resolvedBio,
              isPro: resolvedIsPro,
              subscriptionTier: resolvedSubTier,
              subscriptionExpiresAt: resolvedExpiresAt,
              unlockedAdvancedPathId: resolvedAdvancedPath,
              studentPlusPathLocked: resolvedPathLocked,
              role: resolvedRole,
              isSyncing: false 
            });

            // Sync merged authoritative state back to Supabase via upsert
            try {
              await supabase.from('profiles').upsert([{
                id: userId,
                username: resolvedUsername,
                xp: resolvedXp,
                weekly_xp: resolvedWeeklyXp,
                league_id: resolvedLeague,
                level: resolvedLevel,
                completed_lessons: resolvedCompleted,
                hearts: resolvedHearts,
                streak: resolvedStreak,
                is_pro: resolvedIsPro,
                subscription_tier: resolvedSubTier,
                role: resolvedRole,
                career_goal: resolvedCareerGoal,
                bio: resolvedBio
              }]);
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
        const { completedLessons, streak, lastStreakDate, streakFreezesCount, addXp } = get();

        const today = getTodayDateStr();
        const yesterday = getYesterdayDateStr();

        let newStreak = streak;
        let newFreezes = streakFreezesCount;
        let newStreakDate = lastStreakDate;

        if (!lastStreakDate) {
          newStreak = Math.max(1, streak);
          newStreakDate = today;
        } else if (lastStreakDate === today) {
          // Already completed a lesson today; streak maintained!
          newStreakDate = today;
        } else if (lastStreakDate === yesterday) {
          // Day-to-day continuous streak
          newStreak = streak + 1;
          newStreakDate = today;
        } else {
          // Missed 1 or more days
          if (streakFreezesCount > 0) {
            newFreezes = streakFreezesCount - 1;
            newStreak = streak + 1;
            newStreakDate = today;
          } else {
            newStreak = 1;
            newStreakDate = today;
          }
        }

        const isNewCompletion = !completedLessons.includes(lessonId);
        const newCompleted = isNewCompletion ? [...completedLessons, lessonId] : completedLessons;

        set({ 
          completedLessons: newCompleted,
          streak: newStreak,
          lastStreakDate: newStreakDate,
          streakFreezesCount: newFreezes
        });
        
        await addXp(isNewCompletion ? 100 : 25);

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('profiles').upsert([{
                id: user.id,
                username: get().username || 'CodeExplorer',
                completed_lessons: newCompleted,
                streak: newStreak,
                xp: get().xp,
                weekly_xp: get().weeklyXp,
                level: get().level
              }]);

              try {
                await supabase.from('user_lesson_completions').upsert([{
                  user_id: user.id,
                  lesson_id: lessonId,
                  path_id: get().activePathId || 'web-dev',
                  xp_earned: isNewCompletion ? 100 : 25
                }], { onConflict: 'user_id,lesson_id' });
              } catch {
                // Optional granular log fallback
              }
            }
          } catch {
            // Ignore offline sync errors
          }
        }
      },

      recordPracticeCompletion: () => {
        set({ lastPracticeAt: Date.now() });
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
          unlockedAdvancedPathIds: ['web-dev'],
          unlockedAdvancedPathId: 'web-dev',
          studentPlusRenewalCount: 0,
        });

        sounds.playWrong();

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('profiles').update({
                is_pro: false,
                subscription_tier: 'basic',
                subscription_expires_at: null,
                unlocked_advanced_path_id: 'web-dev',
                unlocked_advanced_path_ids: ['web-dev'],
                student_plus_renewal_count: 0,
              }).eq('id', user.id);
            }
          } catch {}
        }
      },

      updateProfile: async (newUsername: string, newAvatar?: string, newCareerGoal?: string, newBio?: string) => {
        const updates: Partial<GameState> = { username: newUsername };
        if (newAvatar) updates.avatarIcon = newAvatar;
        if (newCareerGoal !== undefined) updates.careerGoal = newCareerGoal;
        if (newBio !== undefined) updates.bio = newBio;
        set(updates);

        if (supabase) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const payload: any = { username: newUsername };
              if (newCareerGoal !== undefined) payload.career_goal = newCareerGoal;
              if (newBio !== undefined) payload.bio = newBio;
              await supabase.from('profiles').update(payload).eq('id', user.id);
            }
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
