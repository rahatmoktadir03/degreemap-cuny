import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { roadmapsService } from "../services/roadmapsService.js";

export const roadmapsController = {
  async createRoadmap(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      const { title, description, nodes, edges, schoolId } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, message: "Title is required" });
      }
      const roadmap = await roadmapsService.createRoadmap(
        req.user.id,
        title,
        description,
        nodes ?? [],
        edges ?? [],
        schoolId
      );
      res.status(201).json({ success: true, data: roadmap });
    } catch (error) {
      console.error("Error creating roadmap:", error);
      res.status(500).json({ success: false, message: "Failed to create roadmap" });
    }
  },

  async getMyRoadmaps(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      const roadmaps = await roadmapsService.getUserRoadmaps(req.user.id);
      res.json({ success: true, data: roadmaps });
    } catch (error) {
      console.error("Error fetching roadmaps:", error);
      res.status(500).json({ success: false, message: "Failed to fetch roadmaps" });
    }
  },

  async getRoadmap(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      const { id } = req.params;
      const roadmap = await roadmapsService.getRoadmap(id, req.user.id);
      if (!roadmap) {
        return res.status(404).json({ success: false, message: "Roadmap not found" });
      }
      res.json({ success: true, data: roadmap });
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      res.status(500).json({ success: false, message: "Failed to fetch roadmap" });
    }
  },

  async updateRoadmap(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      const { id } = req.params;
      const { title, description, nodes, edges, is_public } = req.body;
      if (
        title === undefined &&
        description === undefined &&
        nodes === undefined &&
        edges === undefined &&
        is_public === undefined
      ) {
        return res.status(400).json({
          success: false,
          message: "Provide at least one of: title, description, nodes, edges, is_public",
        });
      }
      const roadmap = await roadmapsService.updateRoadmap(id, req.user.id, {
        title,
        description,
        nodes,
        edges,
        is_public,
      });
      res.json({ success: true, data: roadmap });
    } catch (error) {
      console.error("Error updating roadmap:", error);
      res.status(500).json({ success: false, message: "Failed to update roadmap" });
    }
  },

  async deleteRoadmap(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      const { id } = req.params;
      await roadmapsService.deleteRoadmap(id, req.user.id);
      res.json({ success: true, message: "Roadmap deleted" });
    } catch (error) {
      console.error("Error deleting roadmap:", error);
      res.status(500).json({ success: false, message: "Failed to delete roadmap" });
    }
  },

  async getTemplateRoadmaps(_req: AuthenticatedRequest, res: Response) {
    try {
      const templates = await roadmapsService.getTemplateRoadmaps();
      res.json({ success: true, data: templates });
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ success: false, message: "Failed to fetch templates" });
    }
  },

  async getPublicRoadmap(req: AuthenticatedRequest, res: Response) {
    try {
      const { shareId } = req.params;
      if (!shareId) {
        return res.status(400).json({ success: false, message: "Share ID is required" });
      }
      const roadmap = await roadmapsService.getPublicRoadmap(shareId);
      if (!roadmap) {
        return res.status(404).json({ success: false, message: "Roadmap not found" });
      }
      res.json({ success: true, data: roadmap });
    } catch (error) {
      console.error("Error fetching public roadmap:", error);
      res.status(500).json({ success: false, message: "Failed to fetch roadmap" });
    }
  },

  async generateShareLink(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      const { roadmapId } = req.body;
      if (!roadmapId) {
        return res.status(400).json({ success: false, message: "Roadmap ID is required" });
      }
      const shareId = await roadmapsService.generateShareId(roadmapId, req.user.id);
      const shareUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/share/${shareId}`;
      res.json({ success: true, data: { shareId, shareUrl } });
    } catch (error) {
      console.error("Error generating share link:", error);
      res.status(500).json({ success: false, message: "Failed to generate share link" });
    }
  },
};
