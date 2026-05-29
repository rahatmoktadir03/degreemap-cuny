import { supabase } from "./supabase";
export const roadmapService = {
    getRoadmaps: async (userId) => {
        return supabase.from("roadmaps").select("*").eq("user_id", userId);
    },
    getRoadmapById: async (id) => {
        return supabase.from("roadmaps").select("*").eq("id", id).single();
    },
    createRoadmap: async (userId, data) => {
        return supabase.from("roadmaps").insert([{ ...data, user_id: userId }]);
    },
    updateRoadmap: async (id, data) => {
        return supabase.from("roadmaps").update(data).eq("id", id);
    },
    deleteRoadmap: async (id) => {
        return supabase.from("roadmaps").delete().eq("id", id);
    },
};
