import { supabaseAdmin } from "../supabase/client";
import { Roadmap, RoadmapNode, RoadmapEdge } from "../types/roadmap";

export const roadmapsService = {
  // Create a new roadmap
  async createRoadmap(
    userId: string,
    title: string,
    description?: string,
    nodes: RoadmapNode[] = [],
    edges: RoadmapEdge[] = []
  ) {
    try {
      const { data, error } = await supabaseAdmin
        .from("roadmaps")
        .insert({
          user_id: userId,
          title,
          description,
          nodes: JSON.stringify(nodes),
          edges: JSON.stringify(edges),
          is_template: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating roadmap:", error);
      throw error;
    }
  },

  // Get all roadmaps for a user
  async getUserRoadmaps(userId: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from("roadmaps")
        .select("*")
        .eq("user_id", userId)
        .eq("is_template", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching user roadmaps:", error);
      throw error;
    }
  },

  // Get a specific roadmap
  async getRoadmap(roadmapId: string, userId: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from("roadmaps")
        .select("*")
        .eq("id", roadmapId)
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      throw error;
    }
  },

  // Update a roadmap with new nodes and edges
  async updateRoadmap(
    roadmapId: string,
    userId: string,
    title: string,
    nodes: RoadmapNode[],
    edges: RoadmapEdge[],
    description?: string
  ) {
    try {
      const { data, error } = await supabaseAdmin
        .from("roadmaps")
        .update({
          title,
          description,
          nodes: JSON.stringify(nodes),
          edges: JSON.stringify(edges),
          updated_at: new Date().toISOString(),
        })
        .eq("id", roadmapId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating roadmap:", error);
      throw error;
    }
  },

  // Delete a roadmap
  async deleteRoadmap(roadmapId: string, userId: string) {
    try {
      const { error } = await supabaseAdmin
        .from("roadmaps")
        .delete()
        .eq("id", roadmapId)
        .eq("user_id", userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error deleting roadmap:", error);
      throw error;
    }
  },

  // Get template roadmaps
  async getTemplateRoadmaps() {
    try {
      const { data, error } = await supabaseAdmin
        .from("roadmaps")
        .select("*")
        .eq("is_template", true)
        .order("title", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching template roadmaps:", error);
      throw error;
    }
  },

  // Create a template roadmap
  async createTemplateRoadmap(
    title: string,
    templateName: string,
    description?: string,
    nodes: RoadmapNode[] = [],
    edges: RoadmapEdge[] = []
  ) {
    try {
      const { data, error } = await supabaseAdmin
        .from("roadmaps")
        .insert({
          user_id: null, // Templates don't belong to a specific user
          title,
          description,
          nodes: JSON.stringify(nodes),
          edges: JSON.stringify(edges),
          is_template: true,
          template_name: templateName,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating template roadmap:", error);
      throw error;
    }
  },

  // Get a roadmap by share_id (public endpoint)
  async getPublicRoadmap(shareId: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from("roadmaps")
        .select("id, title, description, nodes, edges, created_at, updated_at")
        .eq("share_id", shareId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching public roadmap:", error);
      throw error;
    }
  },

  // Generate a share ID for a roadmap (UUID)
  async generateShareId(roadmapId: string, userId: string): Promise<string> {
    try {
      // Generate a UUID for the share link
      const shareId = crypto.randomUUID();

      const { error } = await supabaseAdmin
        .from("roadmaps")
        .update({ share_id: shareId })
        .eq("id", roadmapId)
        .eq("user_id", userId);

      if (error) throw error;
      return shareId;
    } catch (error) {
      console.error("Error generating share ID:", error);
      throw error;
    }
  },
};
