import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { roadmapsController } from '../controllers/roadmapsController';

const router = Router();

// Create a new roadmap (protected)
router.post('/', authenticateToken, roadmapsController.createRoadmap);

// Get all template roadmaps (public)
router.get('/templates', roadmapsController.getTemplateRoadmaps);

// Get user's roadmaps (protected)
router.get('/:userId', authenticateToken, roadmapsController.getUserRoadmaps);

// Get a specific roadmap (protected)
router.get('/detail/:id', authenticateToken, roadmapsController.getRoadmap);

// Update a roadmap (protected)
router.put('/:id', authenticateToken, roadmapsController.updateRoadmap);

// Delete a roadmap (protected)
router.delete('/:id', authenticateToken, roadmapsController.deleteRoadmap);

export default router;
