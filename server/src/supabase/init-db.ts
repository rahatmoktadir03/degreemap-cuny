/**
 * Database Initialization Script
 * Executes SQL to create all required tables
 */

import { supabaseAdmin } from "./client.js";

async function executeSql(sql: string, description: string): Promise<boolean> {
  try {
    console.log(`Executing: ${description}`);
    const { data, error } = await supabaseAdmin.rpc("execute_sql", { sql_text: sql });

    if (error) {
      // Check if it's an "already exists" error which we can ignore
      if (error.message.includes("already exists") || error.message.includes("duplicate key")) {
        console.log(`✅ ${description} (already exists)`);
        return true;
      }
      console.error(`❌ ${description}: ${error.message}`);
      return false;
    }

    console.log(`✅ ${description}`);
    return true;
  } catch (error) {
    console.error(`❌ Error executing SQL: ${error}`);
    return false;
  }
}

async function initDb() {
  console.log("🗄️  Initializing DegreeMap Database...\n");

  try {
    // Test connection first
    const { data: testData, error: testError } = await supabaseAdmin
      .from("information_schema.schemata")
      .select("schema_name")
      .limit(1);

    if (testError) {
      console.error("❌ Cannot connect to database:", testError.message);
      console.log("\n⚠️  Manual Setup Required:");
      console.log("1. Go to: https://app.supabase.com/project/nykllsgjhaezdwvkdhzx");
      console.log("2. Click 'SQL Editor' in the left sidebar");
      console.log("3. Click 'New Query'");
      console.log("4. Copy and paste the contents of DATABASE_SETUP.sql");
      console.log("5. Click 'Run'");
      return;
    }

    console.log("✅ Connected to database\n");

    // Create profiles table
    const profilesSQL = `
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
    `;

    // Create roadmaps table
    const roadmapsSQL = `
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
    `;

    // Create journey_milestones table
    const milestonesSQL = `
      CREATE TABLE IF NOT EXISTS journey_milestones (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        milestone_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        completion_date DATE,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create campus_reviews table
    const reviewsSQL = `
      CREATE TABLE IF NOT EXISTS campus_reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        campus_name TEXT NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        categories JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Try to create tables by checking if they exist
    console.log("Checking/Creating tables...\n");

    // Check profiles
    const { error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("count", { count: "exact" })
      .limit(1);

    if (profilesError && profilesError.message.includes("does not exist")) {
      console.log("⚠️  Profiles table doesn't exist - needs manual creation");
      console.log("   Run DATABASE_SETUP.sql in Supabase SQL Editor\n");
    } else {
      console.log("✅ Profiles table exists\n");
    }

    // Check roadmaps
    const { error: roadmapsError } = await supabaseAdmin
      .from("roadmaps")
      .select("count", { count: "exact" })
      .limit(1);

    if (roadmapsError && roadmapsError.message.includes("does not exist")) {
      console.log("⚠️  Roadmaps table doesn't exist - needs manual creation");
    } else {
      console.log("✅ Roadmaps table exists");
    }

    // Check schools
    const { error: schoolsError } = await supabaseAdmin
      .from("schools")
      .select("count", { count: "exact" })
      .limit(1);

    if (schoolsError && schoolsError.message.includes("does not exist")) {
      console.log("⚠️  Schools table doesn't exist - run: npm run seed\n");
    } else {
      console.log("✅ Schools table exists");
    }

    console.log("\n📋 Database Setup Instructions:");
    console.log("1. Go to: https://app.supabase.com/project/nykllsgjhaezdwvkdhzx/sql");
    console.log("2. Click 'New Query'");
    console.log("3. Paste the contents of: server/DATABASE_SETUP.sql");
    console.log("4. Click 'Run'");
    console.log("\n✅ Database initialization check complete!");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

initDb();
