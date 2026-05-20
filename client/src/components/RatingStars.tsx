import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  onRatingChange,
  readOnly = false,
  size = "md",
}) => {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleStarClick = (index: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <button
            key={index}
            onClick={() => handleStarClick(index)}
            className={`transition ${
              index < rating
                ? "text-amber-400 hover:text-amber-500"
                : "text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500"
            } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            disabled={readOnly}
            type="button"
            aria-label={`Rate ${index + 1} stars`}
          >
            <Star className={`${sizeMap[size]} ${index < rating ? "fill-current" : ""}`} />
          </button>
        ))}
      </div>
      <span className="text-sm text-slate-600 dark:text-slate-400">
        {rating > 0 ? `${rating}.0 / 5.0` : "Not rated"}
      </span>
    </div>
  );
};
