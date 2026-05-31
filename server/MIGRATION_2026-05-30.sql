-- Non-destructive migration to bring an existing DegreeMap Supabase project
-- in line with the controller code. Safe to run multiple times.
--
-- Run AFTER the original DATABASE_SETUP.sql if you previously installed.
-- Adds missing columns + tables that the server code already expects.

-- profiles.role ------------------------------------------------------------
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student'
  CHECK (role IN ('student', 'advisor', 'admin'));

CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- roadmaps: new columns ----------------------------------------------------
ALTER TABLE roadmaps
  ALTER COLUMN school_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS edges JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS template_name TEXT,
  ADD COLUMN IF NOT EXISTS share_id TEXT;

-- Backfill share_id from legacy share_token where present
UPDATE roadmaps SET share_id = share_token WHERE share_id IS NULL AND share_token IS NOT NULL;

-- Unique index (allows nulls)
CREATE UNIQUE INDEX IF NOT EXISTS roadmaps_share_id_uidx ON roadmaps(share_id) WHERE share_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS roadmaps_is_template_idx ON roadmaps(is_template);

-- roadmap_comments ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS roadmap_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  node_id TEXT,
  advisor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS roadmap_comments_roadmap_idx ON roadmap_comments(roadmap_id);
CREATE INDEX IF NOT EXISTS roadmap_comments_advisor_idx ON roadmap_comments(advisor_id);

ALTER TABLE roadmap_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comments: read if owner or commenter or advisor" ON roadmap_comments;
CREATE POLICY "Comments: read if owner or commenter or advisor" ON roadmap_comments
  FOR SELECT USING (
    advisor_id = auth.uid()
    OR EXISTS (SELECT 1 FROM roadmaps r WHERE r.id = roadmap_id AND r.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('advisor', 'admin'))
  );

DROP POLICY IF EXISTS "Comments: advisors can write" ON roadmap_comments;
CREATE POLICY "Comments: advisors can write" ON roadmap_comments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('advisor', 'admin'))
    AND advisor_id = auth.uid()
  );

DROP POLICY IF EXISTS "Comments: delete own" ON roadmap_comments;
CREATE POLICY "Comments: delete own" ON roadmap_comments
  FOR DELETE USING (advisor_id = auth.uid());
