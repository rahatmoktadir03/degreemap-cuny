import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { advisorService } from "../services/advisorService";

export const advisorController = {
  // Get list of students
  async getStudents(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const students = await advisorService.getStudents(req.user.id);
      res.json({ success: true, data: students });
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Failed to fetch students" });
    }
  },

  // Get roadmaps for a specific student
  async getStudentRoadmaps(req: AuthenticatedRequest, res: Response) {
    try {
      const { studentId } = req.params;

      if (!studentId) {
        return res.status(400).json({ error: "Student ID is required" });
      }

      const roadmaps = await advisorService.getStudentRoadmaps(studentId);
      res.json({ success: true, data: roadmaps });
    } catch (error) {
      console.error("Error fetching student roadmaps:", error);
      res.status(500).json({ error: "Failed to fetch roadmaps" });
    }
  },

  // Add comment to a roadmap node
  async addComment(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { roadmapId } = req.params;
      const { nodeId, comment } = req.body;

      if (!roadmapId || !nodeId || !comment) {
        return res.status(400).json({ error: "Roadmap ID, Node ID, and comment are required" });
      }

      const result = await advisorService.addComment(roadmapId, nodeId, req.user.id, comment);

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ error: "Failed to add comment" });
    }
  },

  // Get comments for a roadmap
  async getRoadmapComments(req: AuthenticatedRequest, res: Response) {
    try {
      const { roadmapId } = req.params;

      if (!roadmapId) {
        return res.status(400).json({ error: "Roadmap ID is required" });
      }

      const comments = await advisorService.getRoadmapComments(roadmapId);
      res.json({ success: true, data: comments });
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  },
};
