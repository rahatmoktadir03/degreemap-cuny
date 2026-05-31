import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { roadmapsController } from "../controllers/roadmapsController.js";

const router = Router();

// Public routes (must come before any protected `/:id`-shaped routes).
router.get("/public/:shareId", roadmapsController.getPublicRoadmap);
router.get("/templates", roadmapsController.getTemplateRoadmaps);

// Protected routes
router.post("/", authenticateToken, roadmapsController.createRoadmap);
router.post("/share/generate", authenticateToken, roadmapsController.generateShareLink);

// Current user's roadmaps. The legacy `GET /:userId` was an IDOR — any
// authenticated user could list any other user's roadmaps. Replaced with
// `/mine` keyed off the authenticated session.
router.get("/mine", authenticateToken, roadmapsController.getMyRoadmaps);

router.get("/detail/:id", authenticateToken, roadmapsController.getRoadmap);
router.put("/:id", authenticateToken, roadmapsController.updateRoadmap);
router.delete("/:id", authenticateToken, roadmapsController.deleteRoadmap);

export default router;
