-- DegreeMap Database Schema (canonical fresh install)
-- Run this SQL in the Supabase SQL Editor to set up the database.
-- For an existing project, run MIGRATION_2026-05-30.sql instead — it's additive
-- and won't drop data.
--
-- Updated 2026-05-30 to match controller code: adds `edges`, `is_template`,
-- `template_name`, `share_id` on roadmaps; relaxes `school_id` to nullable;
-- introduces `roadmap_comments`; adds `role` on profiles for advisor checks;
-- keeps `campus_reviews` (the canonical reviews table).

-- Optional: clean slate. Comment these out if you want to preserve data.
DROP TABLE IF EXISTS roadmap_comments CASCADE;
DROP TABLE IF EXISTS campus_reviews CASCADE;
DROP TABLE IF EXISTS journey_milestones CASCADE;
DROP TABLE IF EXISTS roadmaps CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 1. profiles ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  school TEXT,
  major TEXT,
  graduation_year INTEGER,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'advisor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS profiles_school_idx ON profiles(school);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles: read own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Profiles: read all if advisor" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('advisor', 'admin')
    )
  );

CREATE POLICY "Profiles: update own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Profiles: service-role insert" ON profiles
  FOR INSERT WITH CHECK (TRUE);

-- 2. roadmaps ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id TEXT,                        -- nullable: code doesn't always set it
  title TEXT NOT NULL,
  description TEXT,
  semesters INTEGER DEFAULT 8,
  nodes JSONB DEFAULT '[]'::jsonb,
  edges JSONB DEFAULT '[]'::jsonb,
  is_template BOOLEAN DEFAULT FALSE,
  template_name TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  share_id TEXT UNIQUE,
  share_token TEXT UNIQUE,               -- kept for backward compat
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS roadmaps_user_id_idx ON roadmaps(user_id);
CREATE INDEX IF NOT EXISTS roadmaps_school_id_idx ON roadmaps(school_id);
CREATE INDEX IF NOT EXISTS roadmaps_share_id_idx ON roadmaps(share_id);
CREATE INDEX IF NOT EXISTS roadmaps_share_token_idx ON roadmaps(share_token);
CREATE INDEX IF NOT EXISTS roadmaps_is_template_idx ON roadmaps(is_template);

ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Roadmaps: read own or public or template" ON roadmaps
  FOR SELECT USING (
    auth.uid() = user_id
    OR is_public = TRUE
    OR is_template = TRUE
    OR share_id IS NOT NULL
  );

CREATE POLICY "Roadmaps: advisor can read all" ON roadmaps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('advisor', 'admin')
    )
  );

CREATE POLICY "Roadmaps: insert own" ON roadmaps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Roadmaps: update own" ON roadmaps
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Roadmaps: delete own" ON roadmaps
  FOR DELETE USING (auth.uid() = user_id);

-- 3. roadmap_comments -------------------------------------------------------
CREATE TABLE IF NOT EXISTS roadmap_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  node_id TEXT,                          -- nullable: comment may be roadmap-wide
  advisor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS roadmap_comments_roadmap_idx ON roadmap_comments(roadmap_id);
CREATE INDEX IF NOT EXISTS roadmap_comments_advisor_idx ON roadmap_comments(advisor_id);

ALTER TABLE roadmap_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments: read if owner or commenter or advisor" ON roadmap_comments
  FOR SELECT USING (
    advisor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM roadmaps r WHERE r.id = roadmap_id AND r.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('advisor', 'admin')
    )
  );

CREATE POLICY "Comments: advisors can write" ON roadmap_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('advisor', 'admin')
    )
    AND advisor_id = auth.uid()
  );

CREATE POLICY "Comments: delete own" ON roadmap_comments
  FOR DELETE USING (advisor_id = auth.uid());

-- 4. journey_milestones -----------------------------------------------------
CREATE TABLE IF NOT EXISTS journey_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL,          -- 'course' | 'semester' | 'graduation'
  title TEXT NOT NULL,
  description TEXT,
  completion_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS milestones_user_id_idx ON journey_milestones(user_id);
CREATE INDEX IF NOT EXISTS milestones_completion_date_idx ON journey_milestones(completion_date);

ALTER TABLE journey_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Milestones: own only" ON journey_milestones
  FOR ALL USING (auth.uid() = user_id);

-- 5. campus_reviews ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS campus_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campus_name TEXT NOT NULL,             -- frontend campus id (e.g. 'hunter')
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  categories JSONB DEFAULT '{}'::jsonb,  -- {academics, campus, community, facilities}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS reviews_campus_idx ON campus_reviews(campus_name);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON campus_reviews(user_id);

ALTER TABLE campus_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews: read any" ON campus_reviews FOR SELECT USING (TRUE);
CREATE POLICY "Reviews: insert own" ON campus_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Reviews: update own" ON campus_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Reviews: delete own" ON campus_reviews FOR DELETE USING (auth.uid() = user_id);

-- Note: schools data lives on the frontend (src/data/cunyCampuses.ts). If you
-- want a server-side schools table, add it here.
