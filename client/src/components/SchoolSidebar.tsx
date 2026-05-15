import React, { useState } from "react";
import type { School } from "../types/school";
import { ReviewList } from "./ReviewList";
import { SchoolReviewForm } from "./SchoolReviewForm";
import { useAuth } from "../store/AuthContext";

interface SchoolSidebarProps {
  school: School | null;
  onClose: () => void;
}

const SchoolSidebar: React.FC<SchoolSidebarProps> = ({ school, onClose }) => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (!school) return null;

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="w-full lg:fixed lg:right-0 lg:top-0 lg:h-full lg:w-96 bg-white dark:bg-gray-800 shadow-xl z-40 overflow-y-auto">
      {/* Header */}
      <div className="bg-linear-to-r from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800 p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">{school.name}</h2>
            <p className="text-secondary-100">{school.borough}</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:text-secondary-100 transition"
          >
            ✕
          </button>
        </div>
      </div>

      {/* School Image */}
      {school.image_url && (
        <img src={school.image_url} alt={school.name} className="w-full h-64 object-cover" />
      )}

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Type Badge */}
        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white ${
              school.type === "senior"
                ? "bg-primary-600"
                : school.type === "graduate"
                  ? "bg-secondary-600"
                  : "bg-blue-500"
            }`}
          >
            {school.type === "senior"
              ? "Senior College"
              : school.type === "graduate"
                ? "Graduate Institution"
                : "Community College"}
          </span>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">
              Enrollment
            </p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {school.enrollment.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">Founded</p>
            <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
              {school.founded}
            </p>
          </div>
        </div>

        {/* Programs */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">Programs Offered</h3>
          <div className="flex flex-wrap gap-2">
            {school.programs.map((program, idx) => (
              <span
                key={idx}
                className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 px-3 py-1 rounded-full text-sm font-medium"
              >
                {program}
              </span>
            ))}
          </div>
        </div>

        {/* Website Link */}
        <a
          href={school.website}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition"
        >
          Visit Campus Website →
        </a>

        {/* Reviews Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          {user && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="w-full mb-6 px-4 py-2 bg-sky-600 dark:bg-sky-700 text-white rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition font-medium text-sm"
            >
              ✍️ Write a Review
            </button>
          )}

          {showReviewForm && (
            <SchoolReviewForm
              schoolId={school.id}
              onReviewSubmitted={handleReviewSubmitted}
              onCancel={() => setShowReviewForm(false)}
            />
          )}

          <ReviewList key={refreshTrigger} schoolId={school.id} />
        </div>
      </div>
    </div>
  );
};

export default SchoolSidebar;
