import { supabaseAdmin } from "../supabase/client.js";

// Reviews live in the `campus_reviews` table (see DATABASE_SETUP.sql).
// The legacy `reviews`/`school_id`/`comment` shape from earlier drafts is gone;
// we map `schoolId` → `campus_name` and `comment` → `review_text`.

export const reviewsService = {
  async createReview(
    schoolId: string,
    userId: string,
    rating: number,
    comment?: string,
    categories?: Record<string, number>
  ) {
    const { data, error } = await supabaseAdmin
      .from("campus_reviews")
      .insert({
        campus_name: schoolId,
        user_id: userId,
        rating,
        review_text: comment ?? null,
        categories: categories ?? {},
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSchoolReviews(schoolId: string) {
    const { data, error } = await supabaseAdmin
      .from("campus_reviews")
      .select("*")
      .eq("campus_name", schoolId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async getUserReviews(userId: string) {
    const { data, error } = await supabaseAdmin
      .from("campus_reviews")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async deleteReview(reviewId: string, userId: string) {
    const { error } = await supabaseAdmin
      .from("campus_reviews")
      .delete()
      .eq("id", reviewId)
      .eq("user_id", userId);

    if (error) throw error;
    return { success: true };
  },
};
