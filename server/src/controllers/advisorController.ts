import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { advisorService } from "../services/advisorService.js";

const requireAdvisor = async (req: AuthenticatedRequest, res: Response): Promise<boolean> => {
  if (!req.user?.id) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return false;
  }
  const ok = await advisorService.isAdvisor(req.user.id);
  if (!ok) {
    res.status(403).json({ success: false, message: "Advisor role required" });
    return false;
  }
  return true;
};

export const advisorController = {
  async getStudents(req: AuthenticatedRequest, res: Response) {
    try {
      if (!(await requireAdvisor(req, res))) return;
      const students = await advisorService.getStudents(req.user!.id);
      res.json({ success: true, data: students });
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ success: false, message: "Failed to fetch students" });
    }
  },

  async getStudentRoadmaps(req: AuthenticatedRequest, res: Response) {
    try {
      if (!(await requireAdvisor(req, res))) return;
      const { studentId } = req.params;
      if (!studentId) {
        return res.status(400).json({ success: false, message: "Student ID is required" });
      }
      const roadmaps = await advisorService.getStudentRoadmaps(studentId);
      res.json({ success: true, data: roadmaps });
    } catch (error) {
      console.error("Error fetching student roadmaps:", error);
      res.status(500).json({ success: false, message: "Failed to fetch roadmaps" });
    }
  },

  async addComment(req: AuthenticatedRequest, res: Response) {
    try {
      if (!(await requireAdvisor(req, res))) return;
      const { roadmapId } = req.params;
      const { nodeId, comment } = req.body;
      if (!roadmapId || !comment) {
        return res.status(400).json({ success: false, message: "Roadmap ID and comment are required" });
      }
      const result = await advisorService.addComment(roadmapId, nodeId ?? null, req.user!.id, comment);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ success: false, message: "Failed to add comment" });
    }
  },

  async getRoadmapComments(req: AuthenticatedRequest, res: Response) {
    try {
      if (!(await requireAdvisor(req, res))) return;
      const { roadmapId } = req.params;
      if (!roadmapId) {
        return res.status(400).json({ success: false, message: "Roadmap ID is required" });
      }
      const comments = await advisorService.getRoadmapComments(roadmapId);
      res.json({ success: true, data: comments });
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ success: false, message: "Failed to fetch comments" });
    }
  },
};
