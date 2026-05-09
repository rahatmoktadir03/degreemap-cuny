import React, { useEffect, useState } from "react";
import { RatingStars } from "./RatingStars";

interface Review {
  id: string;
  userId: string;
  schoolId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  userEmail?: string;
}

interface ReviewListProps {
  schoolId: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({ schoolId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/schools/${schoolId}/reviews`
        );

        if (!response.ok) throw new Error("Failed to fetch reviews");

        const data = await response.json();
        const reviewData = data.data || [];
        setReviews(reviewData);

        if (reviewData.length > 0) {
          const avgRating =
            reviewData.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviewData.length;
          setAverageRating(Math.round(avgRating * 10) / 10);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [schoolId]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-400">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Student Reviews ({reviews.length})
        </h3>
        {reviews.length > 0 && (
          <div className="flex items-center gap-4">
            <div>
              <RatingStars rating={Math.round(averageRating)} readOnly size="lg" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Average rating based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No reviews yet. Be the first to share your experience!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const reviewDate = new Date(review.createdAt);
            const formattedDate = reviewDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={review.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {review.userEmail?.split("@")[0] || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
                  </div>
                  <RatingStars rating={review.rating} readOnly size="sm" />
                </div>
                {review.comment && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{review.comment}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
