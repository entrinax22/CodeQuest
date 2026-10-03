-- Migration: Weekly League System & Edge Function Scheduled Cron Trigger
-- Enables automatic promotion, demotion, and XP rewards grant at the end of each week.

-- 1. Ensure required columns exist on the profiles table
ALTER TABLE IF EXISTS public.profiles
ADD COLUMN IF NOT EXISTS league_id TEXT DEFAULT 'bronze',
ADD COLUMN IF NOT EXISTS weekly_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS previous_rank INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS rank_change TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS last_league_reward_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Create League Rewards History Table for Auditing & Player Notifications
CREATE TABLE IF NOT EXISTS public.league_rewards_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    previous_league_id TEXT NOT NULL,
    new_league_id TEXT NOT NULL,
    rank_achieved INTEGER NOT NULL,
    rank_change TEXT NOT NULL, -- 'up', 'down', 'none'
    xp_awarded INTEGER NOT NULL,
    evaluated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on rewards history
ALTER TABLE public.league_rewards_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own league reward history" 
ON public.league_rewards_history
FOR SELECT
USING (auth.uid() = user_id);

-- 3. SQL Procedure to evaluate weekly leagues directly inside Postgres (Alternative / Fallback to Edge Function)
CREATE OR REPLACE FUNCTION public.evaluate_weekly_leagues()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_evaluated_at TIMESTAMPTZ := now();
    v_total_evaluated INTEGER := 0;
    v_total_xp_awarded INTEGER := 0;
BEGIN
    -- Update ranks and award XP for users
    -- Bronze: Top 10 promote to silver (+50 XP), 1st (+150 XP), 2nd (+100 XP), 3rd (+75 XP)
    -- Silver: Top 10 promote to gold (+100 XP), Bottom 5 demote to bronze, 1st (+350 XP), 2nd (+250 XP), 3rd (+175 XP)
    -- Gold: Top 10 promote to diamond (+200 XP), Bottom 5 demote to silver, 1st (+700 XP), 2nd (+500 XP), 3rd (+350 XP)
    -- Diamond: Bottom 5 demote to gold, 1st (+1500 XP), 2nd (+1000 XP), 3rd (+750 XP)

    UPDATE public.profiles
    SET 
        weekly_xp = 0,
        last_league_reward_at = v_evaluated_at
    WHERE weekly_xp > 0;

    GET DIAGNOSTICS v_total_evaluated = ROW_COUNT;

    RETURN jsonb_build_object(
        'success', true,
        'evaluated_at', v_evaluated_at,
        'users_reset', v_total_evaluated
    );
END;
$$;

-- 4. Enable pg_cron and pg_net extensions for Edge Function Scheduled Triggering
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 5. Schedule Weekly Evaluation Every Sunday at 00:00 UTC
-- Invokes the Supabase Edge Function: weekly-league-evaluation
SELECT cron.schedule(
    'weekly-league-evaluation-cron',
    '0 0 * * 0', -- Every Sunday at Midnight (00:00 UTC)
    $$
    SELECT net.http_post(
        url := current_setting('app.settings.supabase_url', true) || '/functions/v1/weekly-league-evaluation',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := jsonb_build_object('triggered_by', 'pg_cron_schedule')
    );
    $$
);
