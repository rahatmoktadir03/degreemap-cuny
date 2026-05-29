import { supabase } from "./supabase";

export const schoolsService = {
  getSchools: async () => {
    return supabase.from("schools").select("*");
  },

  getSchoolById: async (id: string) => {
    return supabase.from("schools").select("*").eq("id", id).single();
  },

  searchSchools: async (query: string) => {
    return supabase.from("schools").select("*").ilike("name", `%${query}%`);
  },
};
