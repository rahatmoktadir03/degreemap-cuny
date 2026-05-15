-- DegreeMap Database Schema
-- Run this SQL in Supabase SQL Editor to set up the database
-- This script creates all necessary tables and RLS policies

-- Drop existing tables (if needed) - comment out if you want to keep existing data
DROP TABLE IF EXISTS campus_reviews CASCADE;
DROP TABLE IF EXISTS journey_milestones CASCADE;
DROP TABLE IF EXISTS roadmaps CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  school TEXT,
  major TEXT,
  graduation_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for profiles
CREATE INDEX IF NOT EXISTS profiles_school_idx ON profiles(school);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can read their own profile
CREATE POLICY "Users can read their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Create policy: Users can update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policy: Service role can insert profiles (for signup)
CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT WITH CHECK (TRUE);

-- 2. Create roadmaps table
CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  semesters INTEGER DEFAULT 8,
  nodes JSONB DEFAULT '[]'::jsonb,
  is_public BOOLEAN DEFAULT FALSE,
  share_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for roadmaps
CREATE INDEX IF NOT EXISTS roadmaps_user_id_idx ON roadmaps(user_id);
CREATE INDEX IF NOT EXISTS roadmaps_school_id_idx ON roadmaps(school_id);
CREATE INDEX IF NOT EXISTS roadmaps_share_token_idx ON roadmaps(share_token);

-- Enable RLS for roadmaps
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;

-- Create policies for roadmaps
CREATE POLICY "Users can read their own roadmaps" ON roadmaps
  FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can insert their own roadmaps" ON roadmaps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roadmaps" ON roadmaps
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roadmaps" ON roadmaps
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Create journey_milestones table
CREATE TABLE IF NOT EXISTS journey_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL, -- 'course', 'semester', 'graduation'
  title TEXT NOT NULL,
  description TEXT,
  completion_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for milestones
CREATE INDEX IF NOT EXISTS milestones_user_id_idx ON journey_milestones(user_id);
CREATE INDEX IF NOT EXISTS milestones_completion_date_idx ON journey_milestones(completion_date);

-- Enable RLS for milestones
ALTER TABLE journey_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own milestones" ON journey_milestones
  FOR ALL USING (auth.uid() = user_id);

-- 4. Create reviews table for campus feedback
CREATE TABLE IF NOT EXISTS campus_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campus_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  categories JSONB DEFAULT '{}'::jsonb, -- {academics: 4, campus: 5, community: 4, facilities: 3}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS reviews_campus_idx ON campus_reviews(campus_name);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON campus_reviews(user_id);

-- Enable RLS for reviews
ALTER TABLE campus_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews" ON campus_reviews FOR SELECT USING (TRUE);
CREATE POLICY "Users can create their own reviews" ON campus_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON campus_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON campus_reviews FOR DELETE USING (auth.uid() = user_id);

-- Note: Schools table should already exist from the seed script
-- If it doesn't, create it:
-- CREATE TABLE IF NOT EXISTS schools (
--   id TEXT PRIMARY KEY,
--   name TEXT NOT NULL,
--   borough TEXT,
--   type TEXT,
--   description TEXT,
--   website TEXT,
--   contact_email TEXT,
--   contact_phone TEXT,
--   latitude NUMERIC,
--   longitude NUMERIC,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );
