import { supabaseAdmin } from "../supabase/client.js";

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Database error:", error);
    return null;
  }

  return data;
};

export const updateUserProfile = async (
  userId: string,
  updates: {
    name?: string;
    school?: string;
    major?: string;
    graduation_year?: number | null;
    gpa?: number | null;
  }
) => {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
