import React from "react";

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
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const handleStarClick = (index: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <button
          key={index}
          onClick={() => handleStarClick(index)}
          className={`${sizeMap[size]} transition ${
            index < rating
              ? "text-yellow-400 hover:text-yellow-500"
              : "text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500"
          } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
          disabled={readOnly}
          type="button"
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 self-center">
        {rating > 0 ? `${rating}.0 / 5.0` : "Not rated"}
      </span>
    </div>
  );
};
