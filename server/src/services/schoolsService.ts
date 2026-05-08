import { supabaseAdmin } from "../supabase/client.js";

export const getSchools = async () => {
  const { data, error } = await supabaseAdmin.from("schools").select("*");

  if (error) {
    throw error;
  }

  return data;
};

export const getSchoolById = async (id: string) => {
  const { data, error } = await supabaseAdmin.from("schools").select("*").eq("id", id).single();

  if (error) {
    console.error("Database error:", error);
    return null;
  }

  return data;
};
