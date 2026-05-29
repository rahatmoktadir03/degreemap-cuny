import { supabase } from "./supabase";
export const authService = {
    signUp: async (email, password, data) => {
        return supabase.auth.signUp({
            email,
            password,
            options: { data: data || {} },
        });
    },
    signIn: async (email, password) => {
        return supabase.auth.signInWithPassword({
            email,
            password,
        });
    },
    signOut: async () => {
        return supabase.auth.signOut();
    },
    getUser: async () => {
        return supabase.auth.getUser();
    },
    getSession: async () => {
        return supabase.auth.getSession();
    },
};
