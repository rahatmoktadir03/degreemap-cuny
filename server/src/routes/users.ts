import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/usersController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET user profile
router.get("/me", getProfile);

// UPDATE user profile
router.put("/me", updateProfile);

export default router;
