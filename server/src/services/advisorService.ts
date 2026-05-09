import { supabaseAdmin } from "../supabase/client.js";

export const advisorService = {
  // Get list of students for an advisor (would be based on advisor assignment in real app)
  async getStudents(advisorId: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("id, display_name, email:auth.users(email)")
        .neq("id", advisorId)
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  },

  // Get roadmaps for a specific student
  async getStudentRoadmaps(studentId: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from("roadmaps")
        .select("*")
        .eq("user_id", studentId)
        .eq("is_template", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching student roadmaps:", error);
      throw error;
    }
  },

  // Add comment to a node in a roadmap
  async addComment(roadmapId: string, nodeId: string, advisorId: string, comment: string) {
    try {
      const { data: roadmapData, error: roadmapError } = await supabaseAdmin
        .from("roadmaps")
        .select("nodes")
        .eq("id", roadmapId)
        .single();

      if (roadmapError) throw roadmapError;

      // For now, we'll store comments in a simple way
      // In a production app, you'd have a separate comments table
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
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  // Get comments for a roadmap
  async getRoadmapComments(roadmapId: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from("roadmap_comments")
        .select("*")
        .eq("roadmap_id", roadmapId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },
};
