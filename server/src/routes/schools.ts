import { Router } from "express";
import { getAllSchools, getSchool } from "../controllers/schoolsController.js";
import { reviewsController } from "../controllers/reviewsController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// GET all schools
router.get("/", getAllSchools);

// Review routes
router.post("/:schoolId/reviews", authenticateToken, reviewsController.createReview);
router.get("/:schoolId/reviews", reviewsController.getSchoolReviews);
router.get("/reviews/user/:userId", authenticateToken, reviewsController.getUserReviews);
router.delete("/:schoolId/reviews/:reviewId", authenticateToken, reviewsController.deleteReview);

// GET school by ID (must be after review routes to avoid conflicts)
router.get("/:id", getSchool);

export default router;
