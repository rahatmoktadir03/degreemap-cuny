import { supabase } from "./supabase";
export const schoolsService = {
    getSchools: async () => {
        return supabase.from("schools").select("*");
    },
    getSchoolById: async (id) => {
        return supabase.from("schools").select("*").eq("id", id).single();
    },
    searchSchools: async (query) => {
        return supabase.from("schools").select("*").ilike("name", `%${query}%`);
    },
};
