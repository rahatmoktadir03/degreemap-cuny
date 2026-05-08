import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { roadmapsService } from '../services/roadmapsService';
import { RoadmapNode, RoadmapEdge } from '../types/roadmap';

export const roadmapsController = {
  // Create a new roadmap
  async createRoadmap(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { title, description, nodes, edges } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const roadmap = await roadmapsService.createRoadmap(
        req.user.id,
        title,
        description,
        nodes || [],
        edges || []
      );

      res.status(201).json({ success: true, data: roadmap });
    } catch (error) {
      console.error('Error creating roadmap:', error);
      res.status(500).json({ error: 'Failed to create roadmap' });
    }
  },

  // Get user's roadmaps
  async getUserRoadmaps(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const roadmaps = await roadmapsService.getUserRoadmaps(req.user.id);
      res.json({ success: true, data: roadmaps });
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      res.status(500).json({ error: 'Failed to fetch roadmaps' });
    }
  },

  // Get a specific roadmap
  async getRoadmap(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { id } = req.params;
      const roadmap = await roadmapsService.getRoadmap(id, req.user.id);

      if (!roadmap) {
        return res.status(404).json({ error: 'Roadmap not found' });
      }

      res.json({ success: true, data: roadmap });
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      res.status(500).json({ error: 'Failed to fetch roadmap' });
    }
  },

  // Update roadmap
  async updateRoadmap(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { id } = req.params;
      const { title, description, nodes, edges } = req.body;

      if (!title || !nodes || !edges) {
        return res.status(400).json({
          error: 'Title, nodes, and edges are required',
        });
      }

      const roadmap = await roadmapsService.updateRoadmap(
        id,
        req.user.id,
        title,
        nodes as RoadmapNode[],
        edges as RoadmapEdge[],
        description
      );

      res.json({ success: true, data: roadmap });
    } catch (error) {
      console.error('Error updating roadmap:', error);
      res.status(500).json({ error: 'Failed to update roadmap' });
    }
  },

  // Delete roadmap
  async deleteRoadmap(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { id } = req.params;
      await roadmapsService.deleteRoadmap(id, req.user.id);

      res.json({ success: true, message: 'Roadmap deleted' });
    } catch (error) {
      console.error('Error deleting roadmap:', error);
      res.status(500).json({ error: 'Failed to delete roadmap' });
    }
  },

  // Get template roadmaps (public endpoint)
  async getTemplateRoadmaps(req: AuthenticatedRequest, res: Response) {
    try {
      const templates = await roadmapsService.getTemplateRoadmaps();
      res.json({ success: true, data: templates });
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({ error: 'Failed to fetch templates' });
    }
  },
};
