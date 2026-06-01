-- Non-destructive migration: add an optional GPA to profiles so students can
-- record their GPA (shown on the dashboard) and advisors can see it on the
-- roster. Safe to run multiple times.
--
-- Run in the Supabase SQL Editor after the earlier setup/migration scripts.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS gpa NUMERIC(3, 2) CHECK (gpa IS NULL OR (gpa >= 0 AND gpa <= 4));
