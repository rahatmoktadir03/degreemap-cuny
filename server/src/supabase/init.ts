/**
 * Supabase Database Initialization Script
 * Creates all necessary tables and functions for the DegreeMap app
 * Run this once to set up the database
 */

import { supabaseAdmin } from "./client.js";

async function initializeDatabase() {
  console.log("🗄️  Starting database initialization...");

  try {
    // Create profiles table
    console.log("Creating profiles table...");
    const { error: profilesError } = await supabaseAdmin.rpc("create_profiles_table", {});

    if (profilesError && !profilesError.message.includes("already exists")) {
      console.error("❌ Error creating profiles table:", profilesError);
    } else {
      console.log("✅ Profiles table ready");
    }

    // Test by checking if profiles table exists
    const { data: profilesTest, error: testError } = await supabaseAdmin
      .from("profiles")
      .select("count", { count: "exact" });

    if (testError) {
      if (testError.message.includes("does not exist")) {
        console.warn("⚠️  Profiles table does not exist. Creating via SQL...");

        // Create the table using raw SQL
        const createProfilesSQL = `
          CREATE TABLE IF NOT EXISTS profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT NOT NULL UNIQUE,
            name TEXT,
            avatar_url TEXT,
            bio TEXT,
            school TEXT,
            major TEXT,
            graduation_year INTEGER,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
          CREATE INDEX IF NOT EXISTS profiles_school_idx ON profiles(school);
        `;

        // For now, log the SQL that needs to be run
        console.log("📋 Please run the following SQL in Supabase SQL Editor:");
        console.log(createProfilesSQL);
      } else {
        console.error("❌ Error checking profiles table:", testError);
      }
    } else {
      console.log(`✅ Profiles table exists with ${profilesTest?.length || 0} records`);
    }

    // Create roadmaps table
    console.log("Checking roadmaps table...");
    const { data: roadmapsTest, error: roadmapsTestError } = await supabaseAdmin
      .from("roadmaps")
      .select("count", { count: "exact" })
      .limit(1);

    if (roadmapsTestError && roadmapsTestError.message.includes("does not exist")) {
      console.log("📋 Roadmaps table needs to be created");
      const createRoadmapsSQL = `
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

        CREATE INDEX IF NOT EXISTS roadmaps_user_id_idx ON roadmaps(user_id);
        CREATE INDEX IF NOT EXISTS roadmaps_school_id_idx ON roadmaps(school_id);
        CREATE INDEX IF NOT EXISTS roadmaps_share_token_idx ON roadmaps(share_token);
      `;
      console.log("📋 Please run the following SQL in Supabase SQL Editor:");
      console.log(createRoadmapsSQL);
    } else {
      console.log(`✅ Roadmaps table exists with ${roadmapsTest?.length || 0} records`);
    }

    console.log("✅ Database initialization check complete!");
    console.log("⚠️  If tables don't exist, please run the provided SQL in Supabase SQL Editor");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

initializeDatabase();
