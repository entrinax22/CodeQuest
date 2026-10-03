// @ts-nocheck
// Supabase Edge Function: weekly-league-evaluation
// Triggered on a weekly schedule (e.g. Every Sunday at 00:00 UTC via pg_cron or Supabase Scheduled Functions)
// Calculates rank changes, updates user's 'league_id' in profiles table, and grants XP rewards based on placement.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

interface LeagueConfig {
  id: string;
  name: string;
  order: number;
  promotionRankThreshold: number; // Top N users get promoted to next higher league
  demotionRankThreshold: number;  // Bottom N users get demoted to lower league
  rewards: {
    firstPlaceXp: number;
    secondPlaceXp: number;
    thirdPlaceXp: number;
    promotionXp: number;
    participationXp: number;
  };
}

const LEAGUES_CONFIG: Record<string, LeagueConfig> = {
  bronze: {
    id: 'bronze',
    name: 'Bronze League',
    order: 0,
    promotionRankThreshold: 10,
    demotionRankThreshold: 0, // Cannot demote from Bronze
    rewards: {
      firstPlaceXp: 150,
      secondPlaceXp: 100,
      thirdPlaceXp: 75,
      promotionXp: 50,
      participationXp: 20,
    },
  },
  silver: {
    id: 'silver',
    name: 'Silver League',
    order: 1,
    promotionRankThreshold: 10,
    demotionRankThreshold: 5,
    rewards: {
      firstPlaceXp: 350,
      secondPlaceXp: 250,
      thirdPlaceXp: 175,
      promotionXp: 100,
      participationXp: 35,
    },
  },
  gold: {
    id: 'gold',
    name: 'Gold League',
    order: 2,
    promotionRankThreshold: 10,
    demotionRankThreshold: 5,
    rewards: {
      firstPlaceXp: 700,
      secondPlaceXp: 500,
      thirdPlaceXp: 350,
      promotionXp: 200,
      participationXp: 50,
    },
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond League',
    order: 3,
    promotionRankThreshold: 0, // Top tier league
    demotionRankThreshold: 5,
    rewards: {
      firstPlaceXp: 1500,
      secondPlaceXp: 1000,
      thirdPlaceXp: 750,
      promotionXp: 400,
      participationXp: 100,
    },
  },
};

const LEAGUE_ORDER = ['bronze', 'silver', 'gold', 'diamond'];

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Supabase configuration missing (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });

    const evaluatedAt = new Date().toISOString();
    const evaluationResults: {
      league: string;
      totalUsers: number;
      promotions: string[];
      demotions: string[];
      rewardsGranted: { userId: string; username: string; xpAwarded: number; rank: number }[];
    }[] = [];

    let totalXpAwarded = 0;
    let totalPromotions = 0;
    let totalDemotions = 0;

    // Fetch all user profiles
    const { data: allProfiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id, username, xp, weekly_xp, league_id, streak')
      .order('xp', { ascending: false });

    if (fetchError) {
      throw new Error(`Failed to fetch profiles: ${fetchError.message}`);
    }

    if (!allProfiles || allProfiles.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No profiles found to evaluate.',
          evaluated_at: evaluatedAt,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Group users by current league (defaulting null/empty to 'bronze' or inferring from cumulative XP)
    const usersByLeague: Record<string, typeof allProfiles> = {
      bronze: [],
      silver: [],
      gold: [],
      diamond: [],
    };

    for (const profile of allProfiles) {
      let league = (profile.league_id || '').toLowerCase();
      if (!LEAGUES_CONFIG[league]) {
        // Infer default league from total XP if league_id is not set
        if ((profile.xp || 0) >= 5000) league = 'diamond';
        else if ((profile.xp || 0) >= 2500) league = 'gold';
        else if ((profile.xp || 0) >= 1000) league = 'silver';
        else league = 'bronze';
      }
      usersByLeague[league].push(profile);
    }

    // Process each league
    for (const leagueKey of LEAGUE_ORDER) {
      const config = LEAGUES_CONFIG[leagueKey];
      const leagueUsers = usersByLeague[leagueKey];

      // Sort users in this league by weekly_xp (fallback to total xp) descending
      leagueUsers.sort((a, b) => {
        const scoreA = (a.weekly_xp !== null && a.weekly_xp !== undefined) ? a.weekly_xp : (a.xp || 0);
        const scoreB = (b.weekly_xp !== null && b.weekly_xp !== undefined) ? b.weekly_xp : (b.xp || 0);
        return scoreB - scoreA;
      });

      const totalLeagueUsers = leagueUsers.length;
      const promotions: string[] = [];
      const demotions: string[] = [];
      const rewardsGranted: { userId: string; username: string; xpAwarded: number; rank: number }[] = [];

      for (let i = 0; i < leagueUsers.length; i++) {
        const user = leagueUsers[i];
        const rank = i + 1;
        let newLeague = leagueKey;
        let rankChange: 'up' | 'down' | 'none' = 'none';

        // 1. Calculate XP Reward based on rank
        let xpReward = config.rewards.participationXp;
        if (rank === 1) {
          xpReward = config.rewards.firstPlaceXp;
        } else if (rank === 2) {
          xpReward = config.rewards.secondPlaceXp;
        } else if (rank === 3) {
          xpReward = config.rewards.thirdPlaceXp;
        } else if (config.promotionRankThreshold > 0 && rank <= config.promotionRankThreshold) {
          xpReward = config.rewards.promotionXp;
        }

        // 2. Check Promotion
        if (config.promotionRankThreshold > 0 && rank <= config.promotionRankThreshold && config.order < 3) {
          const nextLeagueKey = LEAGUE_ORDER[config.order + 1];
          newLeague = nextLeagueKey;
          rankChange = 'up';
          promotions.push(user.id);
          totalPromotions++;
        }
        // 3. Check Demotion
        else if (
          config.demotionRankThreshold > 0 &&
          totalLeagueUsers >= 10 &&
          rank > (totalLeagueUsers - config.demotionRankThreshold) &&
          config.order > 0
        ) {
          const prevLeagueKey = LEAGUE_ORDER[config.order - 1];
          newLeague = prevLeagueKey;
          rankChange = 'down';
          demotions.push(user.id);
          totalDemotions++;
        }

        // 3. Update User Profile in Supabase
        const updatedTotalXp = (user.xp || 0) + xpReward;
        totalXpAwarded += xpReward;

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            league_id: newLeague,
            xp: updatedTotalXp,
            weekly_xp: 0, // Reset weekly counter for the new week
            previous_rank: rank,
            rank_change: rankChange,
            last_league_reward_at: evaluatedAt,
          })
          .eq('id', user.id);

        if (updateError) {
          console.error(`Error updating user ${user.id}:`, updateError);
        }

        // 4. Record Reward Event in league_rewards_history table
        await supabase
          .from('league_rewards_history')
          .insert({
            user_id: user.id,
            previous_league_id: leagueKey,
            new_league_id: newLeague,
            rank_achieved: rank,
            rank_change: rankChange,
            xp_awarded: xpReward,
            evaluated_at: evaluatedAt,
          })
          .catch(() => {
            // Ignore if table does not exist in bare Supabase projects
          });

        rewardsGranted.push({
          userId: user.id,
          username: user.username || 'Student',
          xpAwarded: xpReward,
          rank,
        });
      }

      evaluationResults.push({
        league: config.name,
        totalUsers: totalLeagueUsers,
        promotions,
        demotions,
        rewardsGranted,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Weekly league evaluation completed successfully.',
        evaluated_at: evaluatedAt,
        summary: {
          total_users_evaluated: allProfiles.length,
          total_promotions: totalPromotions,
          total_demotions: totalDemotions,
          total_xp_awarded: totalXpAwarded,
        },
        leagues: evaluationResults,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (err: any) {
    console.error('Error in weekly-league-evaluation function:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || 'Internal Server Error during weekly league evaluation',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
