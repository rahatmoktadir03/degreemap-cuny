import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { advisorController } from "../controllers/advisorController";

const router = Router();

// Advisor routes (all protected)
router.get("/students", authenticateToken, advisorController.getStudents);
router.get("/students/:studentId/roadmaps", authenticateToken, advisorController.getStudentRoadmaps);
router.post("/roadmaps/:roadmapId/comments", authenticateToken, advisorController.addComment);
router.get("/roadmaps/:roadmapId/comments", authenticateToken, advisorController.getRoadmapComments);

export default router;
