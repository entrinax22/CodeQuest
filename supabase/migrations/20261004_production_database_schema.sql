-- ==============================================================================
-- CODEQUEST ACADEMY - PRODUCTION DATABASE SCHEMA AUDIT & MIGRATION SCRIPT
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. PROFILES TABLE (User Accounts, Learning Stats, Subscription & Level)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    xp INTEGER DEFAULT 0,
    weekly_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    hearts INTEGER DEFAULT 5,
    streak INTEGER DEFAULT 1,
    last_streak_date DATE DEFAULT CURRENT_DATE,
    league_id TEXT DEFAULT 'bronze',
    rank_change TEXT DEFAULT 'none',
    career_goal TEXT DEFAULT 'Software Engineer',
    bio TEXT DEFAULT 'CodeQuest student mastering software engineering.',
    completed_lessons JSONB DEFAULT '[]'::jsonb,
    is_pro BOOLEAN DEFAULT false,
    subscription_tier TEXT DEFAULT 'basic', -- 'basic', 'student_plus', 'pro'
    subscription_expires_at TIMESTAMPTZ DEFAULT NULL,
    role TEXT DEFAULT 'user', -- 'admin', 'user'
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS & Policies for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- 2. POSTS TABLE (Global Student Social Feed)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    tag TEXT DEFAULT '💬 Status Update',
    tag_style TEXT DEFAULT 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    avatar_bg TEXT DEFAULT 'from-sky-400 to-indigo-600',
    cheers INTEGER DEFAULT 1,
    cheered_by_me BOOLEAN DEFAULT false,
    comments JSONB DEFAULT '[]'::jsonb,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS & Policies for Posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Posts are viewable by all users" ON public.posts;
CREATE POLICY "Posts are viewable by all users" 
ON public.posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
CREATE POLICY "Authenticated users can create posts" 
ON public.posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
CREATE POLICY "Users can update their own posts" 
ON public.posts FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
CREATE POLICY "Users can delete their own posts" 
ON public.posts FOR DELETE USING (true);


-- 3. FOLLOWS TABLE (Student Networking Connections)
CREATE TABLE IF NOT EXISTS public.follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(follower_id, following_id)
);

-- Enable RLS & Policies for Follows
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Follows are viewable by everyone" ON public.follows;
CREATE POLICY "Follows are viewable by everyone" 
ON public.follows FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their follow records" ON public.follows;
CREATE POLICY "Users can manage their follow records" 
ON public.follows FOR ALL USING (auth.uid() = follower_id);


-- 4. POST CHEERS TABLE (Individual Likes/Cheers Audit)
CREATE TABLE IF NOT EXISTS public.post_cheers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(post_id, user_id)
);

ALTER TABLE public.post_cheers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cheers viewable by all" ON public.post_cheers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can cheer" ON public.post_cheers FOR ALL USING (auth.uid() = user_id);


-- 5. LEAGUE REWARDS HISTORY TABLE (Weekly Evaluation Audit Log)
CREATE TABLE IF NOT EXISTS public.league_rewards_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    previous_league_id TEXT NOT NULL,
    new_league_id TEXT NOT NULL,
    rank_achieved INTEGER NOT NULL,
    rank_change TEXT NOT NULL,
    xp_awarded INTEGER NOT NULL,
    evaluated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.league_rewards_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own rewards history" ON public.league_rewards_history FOR SELECT USING (auth.uid() = user_id);


-- 6. ADMIN SETTINGS TABLE (Payment QR Configuration & System Variables)
CREATE TABLE IF NOT EXISTS public.admin_settings (
    id TEXT PRIMARY KEY, -- e.g., 'qr_config'
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin settings viewable by all authenticated users" ON public.admin_settings;
CREATE POLICY "Admin settings viewable by all authenticated users" 
ON public.admin_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert or update admin_settings" ON public.admin_settings;
CREATE POLICY "Admins can insert or update admin_settings" 
ON public.admin_settings FOR ALL USING (true);


-- 7. USER LESSON COMPLETIONS TABLE (Granular Progress Tracking)
CREATE TABLE IF NOT EXISTS public.user_lesson_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    path_id TEXT DEFAULT 'web-dev',
    xp_earned INTEGER DEFAULT 100,
    completed_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.user_lesson_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own completions" ON public.user_lesson_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own completions" ON public.user_lesson_completions FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 8. XP LEDGER TABLE (XP Transaction Audit Log)
CREATE TABLE IF NOT EXISTS public.xp_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    source TEXT DEFAULT 'lesson_completion', -- 'lesson_completion', 'daily_streak', 'practice_arena', 'league_reward'
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.xp_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own xp ledger" ON public.xp_ledger FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own xp ledger" ON public.xp_ledger FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 9. PAYMENT APPROVALS TABLE (GCash & Maya SaaS Subscription Proofs)
CREATE TABLE IF NOT EXISTS public.payment_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    method TEXT NOT NULL, -- 'gcash', 'maya'
    reference_number TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    tier TEXT NOT NULL, -- 'student_plus', 'pro'
    cycle TEXT DEFAULT 'monthly', -- 'monthly', 'yearly'
    proof_image TEXT DEFAULT '',
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.payment_approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own payments" ON public.payment_approvals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create payments" ON public.payment_approvals FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage payment approvals" ON public.payment_approvals FOR ALL USING (true);


-- Create performance indexes for speed
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON public.profiles(xp DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_weekly_xp ON public.profiles(weekly_xp DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_completions_user ON public.user_lesson_completions(user_id);
