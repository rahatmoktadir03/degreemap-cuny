import { supabaseAdmin } from "../supabase/client.js";

export const reviewsService = {
  // Create a review for a school
  async createReview(schoolId: string, userId: string, rating: number, comment?: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from("reviews")
        .insert({
          school_id: schoolId,
          user_id: userId,
          rating,
          comment: comment || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  },

  // Get all reviews for a school
  async getSchoolReviews(schoolId: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from("reviews")
        .select("*, user_id, school_id")
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },

  // Get a user's reviews
  async getUserReviews(userId: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from("reviews")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      throw error;
    }
  },

  // Delete a review
  async deleteReview(reviewId: string, userId: string) {
    try {
      const { error } = await supabaseAdmin
        .from("reviews")
        .delete()
        .eq("id", reviewId)
        .eq("user_id", userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  },
};
