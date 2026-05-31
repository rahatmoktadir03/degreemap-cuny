import { supabaseAdmin } from "../supabase/client.js";

// NOTE: previous version selected `display_name` and `email:auth.users(email)`
// which neither exists as a column nor as a defined PostgREST relation.
// We now select the columns that actually live on `profiles` and join to
// `auth.users` via a separate admin call when we need the email.

export const advisorService = {
  async getStudents(advisorId: string) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, name, school, major, graduation_year, role, updated_at")
      .neq("id", advisorId)
      .eq("role", "student")
      .order("updated_at", { ascending: false })
      .limit(100);

    if (error) throw error;
    return data ?? [];
  },

  async getStudentRoadmaps(studentId: string) {
    const { data, error } = await supabaseAdmin
      .from("roadmaps")
      .select("*")
      .eq("user_id", studentId)
      .eq("is_template", false)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async addComment(roadmapId: string, nodeId: string | null, advisorId: string, comment: string) {
    // Make sure the roadmap exists before writing a comment.
    const { data: roadmap, error: roadmapErr } = await supabaseAdmin
      .from("roadmaps")
      .select("id")
      .eq("id", roadmapId)
      .single();

    if (roadmapErr || !roadmap) {
      throw new Error("Roadmap not found");
    }

    const { data, error } = await supabaseAdmin
      .from("roadmap_comments")
      .insert({
        roadmap_id: roadmapId,
        node_id: nodeId,
        advisor_id: advisorId,
        comment,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getRoadmapComments(roadmapId: string) {
    const { data, error } = await supabaseAdmin
      .from("roadmap_comments")
      .select("*")
      .eq("roadmap_id", roadmapId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async isAdvisor(userId: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error || !data) return false;
    return data.role === "advisor" || data.role === "admin";
  },
};
