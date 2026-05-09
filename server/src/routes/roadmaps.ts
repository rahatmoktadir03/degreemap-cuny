import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { roadmapsController } from "../controllers/roadmapsController";

const router = Router();

// Public routes (must come before protected routes to avoid conflicts)
router.get("/public/:shareId", roadmapsController.getPublicRoadmap);
router.get("/templates", roadmapsController.getTemplateRoadmaps);

// Protected routes
router.post("/", authenticateToken, roadmapsController.createRoadmap);
router.post("/share/generate", authenticateToken, roadmapsController.generateShareLink);
router.get("/:userId", authenticateToken, roadmapsController.getUserRoadmaps);
router.get("/detail/:id", authenticateToken, roadmapsController.getRoadmap);
router.put("/:id", authenticateToken, roadmapsController.updateRoadmap);
router.delete("/:id", authenticateToken, roadmapsController.deleteRoadmap);

export default router;
