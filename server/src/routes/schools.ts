import { Router } from "express";
import { reviewsController } from "../controllers/reviewsController.js";
import { authenticateToken } from "../middleware/auth.js";

// Campus catalog data lives on the frontend (client/src/data/cunyCampuses.ts),
// so there are no GET /schools or GET /schools/:id endpoints. This router only
// serves the campus review endpoints, keyed by the frontend campus id.
const router = Router();

// Review routes
router.post("/:schoolId/reviews", authenticateToken, reviewsController.createReview);
router.get("/:schoolId/reviews", reviewsController.getSchoolReviews);
router.get("/reviews/user/:userId", authenticateToken, reviewsController.getUserReviews);
router.delete("/:schoolId/reviews/:reviewId", authenticateToken, reviewsController.deleteReview);

export default router;
