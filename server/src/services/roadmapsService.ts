import { supabaseAdmin } from "../supabase/client.js";
import { RoadmapNode, RoadmapEdge } from "../types/roadmap.js";

export const roadmapsService = {
  async createRoadmap(
    userId: string,
    title: string,
    description?: string,
    nodes: RoadmapNode[] = [],
    edges: RoadmapEdge[] = [],
    schoolId?: string
  ) {
    const { data, error } = await supabaseAdmin
      .from("roadmaps")
      .insert({
        user_id: userId,
        title,
        description,
        nodes,
        edges,
        is_template: false,
        school_id: schoolId ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserRoadmaps(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("roadmaps")
      .select("*")
      .eq("user_id", userId)
      .eq("is_template", false)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async getRoadmap(roadmapId: string, userId: string) {
    const { data, error } = await supabaseAdmin
      .from("roadmaps")
      .select("*")
      .eq("id", roadmapId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateRoadmap(
    roadmapId: string,
    userId: string,
    patch: {
      title?: string;
      description?: string;
      nodes?: RoadmapNode[];
      edges?: RoadmapEdge[];
      is_public?: boolean;
    }
  ) {
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (patch.title !== undefined) update.title = patch.title;
    if (patch.description !== undefined) update.description = patch.description;
    if (patch.nodes !== undefined) update.nodes = patch.nodes;
    if (patch.edges !== undefined) update.edges = patch.edges;
    if (patch.is_public !== undefined) update.is_public = patch.is_public;

    const { data, error } = await supabaseAdmin
      .from("roadmaps")
      .update(update)
      .eq("id", roadmapId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteRoadmap(roadmapId: string, userId: string) {
    const { error } = await supabaseAdmin
      .from("roadmaps")
      .delete()
      .eq("id", roadmapId)
      .eq("user_id", userId);

    if (error) throw error;
    return { success: true };
  },

  async getTemplateRoadmaps() {
    const { data, error } = await supabaseAdmin
      .from("roadmaps")
      .select("*")
      .eq("is_template", true)
      .order("title", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async createTemplateRoadmap(
    title: string,
    templateName: string,
    description?: string,
    nodes: RoadmapNode[] = [],
    edges: RoadmapEdge[] = []
  ) {
    const { data, error } = await supabaseAdmin
      .from("roadmaps")
      .insert({
        user_id: null,
        title,
        description,
        nodes,
        edges,
        is_template: true,
        template_name: templateName,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPublicRoadmap(shareId: string) {
    const { data, error } = await supabaseAdmin
      .from("roadmaps")
      .select("id, title, description, nodes, edges, created_at, updated_at")
      .eq("share_id", shareId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async generateShareId(roadmapId: string, userId: string): Promise<string> {
    const shareId = crypto.randomUUID();
    const { error } = await supabaseAdmin
      .from("roadmaps")
      .update({ share_id: shareId, is_public: true })
      .eq("id", roadmapId)
      .eq("user_id", userId);

    if (error) throw error;
    return shareId;
  },
};
