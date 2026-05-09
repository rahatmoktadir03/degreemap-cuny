import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { reviewsService } from "../services/reviewsService.js";

export const reviewsController = {
  // Create a review for a school
  async createReview(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { schoolId } = req.params;
      const { rating, comment } = req.body;

      if (!schoolId) {
        return res.status(400).json({ error: "School ID is required" });
      }

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
      }

      const review = await reviewsService.createReview(schoolId, req.user.id, rating, comment);

      res.status(201).json({ success: true, data: review });
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ error: "Failed to create review" });
    }
  },

  // Get all reviews for a school
  async getSchoolReviews(req: AuthenticatedRequest, res: Response) {
    try {
      const { schoolId } = req.params;

      if (!schoolId) {
        return res.status(400).json({ error: "School ID is required" });
      }

      const reviews = await reviewsService.getSchoolReviews(schoolId);
      res.json({ success: true, data: reviews });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  },

  // Get user's reviews
  async getUserReviews(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const reviews = await reviewsService.getUserReviews(req.user.id);
      res.json({ success: true, data: reviews });
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      res.status(500).json({ error: "Failed to fetch user reviews" });
    }
  },

  // Delete a review
  async deleteReview(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { reviewId } = req.params;

      if (!reviewId) {
        return res.status(400).json({ error: "Review ID is required" });
      }

      await reviewsService.deleteReview(reviewId, req.user.id);
      res.json({ success: true, message: "Review deleted" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ error: "Failed to delete review" });
    }
  },
};
