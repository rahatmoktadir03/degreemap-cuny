import { supabase } from "./supabase";
import type { RoadmapNode, RoadmapEdge } from "../types/roadmap";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
}

export const roadmapService = {
  // Create a new roadmap
  async createRoadmap(title: string, description?: string) {
    try {
      const response = await fetch(`${API_URL}/api/roadmaps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          title,
          description,
          nodes: [],
          edges: [],
        }),
      });

      if (!response.ok) throw new Error("Failed to create roadmap");
      const data = await response.json();
      return { success: true, data } as ApiResponse<any>;
    } catch (error) {
      console.error("Error creating roadmap:", error);
      throw error;
    }
  },

  // Get all roadmaps for the current user
  async getUserRoadmaps() {
    try {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user?.id;

      if (!userId) throw new Error("User not authenticated");

      const response = await fetch(`${API_URL}/api/roadmaps/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.data.session?.access_token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch roadmaps");
      const data = await response.json();
      return { success: true, data } as ApiResponse<any[]>;
    } catch (error) {
      console.error("Error fetching roadmaps:", error);
      throw error;
    }
  },

  // Get a specific roadmap by ID
  async getRoadmap(roadmapId: string) {
    try {
      const session = await supabase.auth.getSession();

      const response = await fetch(`${API_URL}/api/roadmaps/detail/${roadmapId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.data.session?.access_token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch roadmap");
      return await response.json();
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      throw error;
    }
  },

  // Save/update roadmap with nodes and edges
  async saveRoadmap(
    roadmapId: string,
    title: string,
    nodes: RoadmapNode[],
    edges: RoadmapEdge[],
    description?: string
  ) {
    try {
      const session = await supabase.auth.getSession();

      const response = await fetch(`${API_URL}/api/roadmaps/${roadmapId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data.session?.access_token}`,
        },
        body: JSON.stringify({
          title,
          description,
          nodes,
          edges,
        }),
      });

      if (!response.ok) throw new Error("Failed to save roadmap");
      return await response.json();
    } catch (error) {
      console.error("Error saving roadmap:", error);
      throw error;
    }
  },

  // Delete a roadmap
  async deleteRoadmap(roadmapId: string) {
    try {
      const session = await supabase.auth.getSession();

      const response = await fetch(`${API_URL}/api/roadmaps/${roadmapId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.data.session?.access_token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete roadmap");
      return await response.json();
    } catch (error) {
      console.error("Error deleting roadmap:", error);
      throw error;
    }
  },

  // Get template roadmaps
  async getTemplateRoadmaps() {
    try {
      const response = await fetch(`${API_URL}/api/roadmaps/templates`, {
        method: "GET",
      });

      if (!response.ok) throw new Error("Failed to fetch templates");
      return await response.json();
    } catch (error) {
      console.error("Error fetching templates:", error);
      throw error;
    }
  },

  // Generate a share link for a roadmap
  async generateShareLink(roadmapId: string) {
    try {
      const session = await supabase.auth.getSession();

      const response = await fetch(`${API_URL}/api/roadmaps/share/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data.session?.access_token}`,
        },
        body: JSON.stringify({ roadmapId }),
      });

      if (!response.ok) throw new Error("Failed to generate share link");
      return await response.json();
    } catch (error) {
      console.error("Error generating share link:", error);
      throw error;
    }
  },

  // Copy share link to clipboard
  async copyShareLink(roadmapId: string) {
    try {
      const result = await this.generateShareLink(roadmapId);
      if (result.success && result.data?.shareUrl) {
        await navigator.clipboard.writeText(result.data.shareUrl);
        return { success: true, url: result.data.shareUrl };
      }
      throw new Error("Failed to generate share URL");
    } catch (error) {
      console.error("Error copying share link:", error);
      throw error;
    }
  },
};
