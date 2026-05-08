/**
 * Supabase Schools Seed Script
 * Run this once to populate the schools table with all 25 CUNY institutions
 * Usage: npx ts-node --esm src/supabase/seed.ts
 */

import { supabaseAdmin } from "./client.js";
import { cunySchools } from "./schools.js";

async function seedSchools() {
  console.log("🌱 Starting to seed CUNY schools...");

  try {
    // Check if schools already exist
    const { data: existingSchools, error: fetchError } = await supabaseAdmin
      .from("schools")
      .select("id")
      .limit(1);

    if (fetchError) {
      console.error("❌ Error checking existing schools:", fetchError);
      return;
    }

    if (existingSchools && existingSchools.length > 0) {
      console.log("✅ Schools table already populated. Skipping seed to avoid duplicates.");
      return;
    }

    // Insert schools
    const { error: insertError } = await supabaseAdmin.from("schools").insert(cunySchools);

    if (insertError) {
      console.error("❌ Error inserting schools:", insertError);
      return;
    }

    console.log(`✅ Successfully seeded ${cunySchools.length} CUNY schools!`);
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

seedSchools();
