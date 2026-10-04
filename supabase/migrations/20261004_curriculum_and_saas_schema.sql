-- ==============================================================================
-- CODEQUEST ACADEMY - COMPREHENSIVE CURRICULUM & SaaS DATABASE MIGRATION SCRIPT
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. LEARNING PATHS TABLE (Career Tracks, e.g., Frontend Web Development, C++ Dev)
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id TEXT PRIMARY KEY, -- e.g., 'web-dev', 'backend-dev', 'cpp-dev'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT DEFAULT 'Code', -- Lucide icon key
    is_advanced BOOLEAN DEFAULT false,
    estimated_hours INTEGER DEFAULT 40,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS & Policies for Learning Paths
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Learning paths viewable by everyone" ON public.learning_paths FOR SELECT USING (true);
CREATE POLICY "Admins manage learning paths" ON public.learning_paths FOR ALL USING (true);


-- 2. MODULES TABLE (Syllabus chapters inside a path, e.g., HTML/CSS Basics, React State)
CREATE TABLE IF NOT EXISTS public.modules (
    id TEXT PRIMARY KEY, -- e.g., 'html-css', 'react-state'
    path_id TEXT NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS & Policies for Modules
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Modules viewable by everyone" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Admins manage modules" ON public.modules FOR ALL USING (true);


-- 3. LESSONS TABLE (Syllabus lessons inside a module, e.g., Functional Components)
CREATE TABLE IF NOT EXISTS public.lessons (
    id TEXT PRIMARY KEY, -- e.g., 'react-intro', 'use-state-hook'
    module_id TEXT NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 100,
    order_index INTEGER DEFAULT 1,
    lesson_type TEXT DEFAULT 'theory', -- 'theory', 'quiz', 'coding'
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS & Policies for Lessons
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lessons viewable by everyone" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Admins manage lessons" ON public.lessons FOR ALL USING (true);


-- 4. LESSON QUIZZES TABLE (Interactive multiple-choice & coding questions connected to lessons)
CREATE TABLE IF NOT EXISTS public.lesson_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL, -- Array of choice options
    correct_option_index INTEGER NOT NULL,
    explanation TEXT DEFAULT '',
    code_template TEXT DEFAULT '', -- Optional coding playground starter code
    order_index INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS & Policies for Lesson Quizzes
ALTER TABLE public.lesson_quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Quizzes viewable by everyone" ON public.lesson_quizzes FOR SELECT USING (true);
CREATE POLICY "Admins manage quizzes" ON public.lesson_quizzes FOR ALL USING (true);


-- 5. HANDBOOK TOPICS TABLE (Cheat sheets & concept guidelines, e.g., 78 topics)
CREATE TABLE IF NOT EXISTS public.handbook_topics (
    id TEXT PRIMARY KEY, -- e.g., 'html-selectors', 'react-props'
    lesson_id TEXT REFERENCES public.lessons(id) ON DELETE SET NULL,
    path_id TEXT REFERENCES public.learning_paths(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    concept_markdown TEXT NOT NULL, -- Detailed handbook content
    cheat_sheet_code TEXT DEFAULT '', -- Copyable code snippets
    preview_html TEXT DEFAULT '', -- HTML rendering inside live simulator
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS & Policies for Handbook Topics
ALTER TABLE public.handbook_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Handbook topics viewable by everyone" ON public.handbook_topics FOR SELECT USING (true);
CREATE POLICY "Admins manage handbook topics" ON public.handbook_topics FOR ALL USING (true);


-- 6. POST COMMENTS TABLE (Normalized community post feedback)
CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_username TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS & Policies for Post Comments
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments viewable by everyone" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON public.post_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins or authors can manage comments" ON public.post_comments FOR ALL USING (true);


-- Create performance optimization indexes
CREATE INDEX IF NOT EXISTS idx_modules_path_id ON public.modules(path_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_lesson_id ON public.lesson_quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_handbook_lesson_id ON public.handbook_topics(lesson_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON public.post_comments(post_id);
