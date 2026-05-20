import React, { useState } from "react";
import { X, Users, Calendar, Globe, PenTool } from "lucide-react";
import type { School } from "../types/school";
import { ReviewList } from "./ReviewList";
import { SchoolReviewForm } from "./SchoolReviewForm";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
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
          <Badge
            variant={
              school.type === "senior"
                ? "default"
                : school.type === "graduate"
                  ? "secondary"
                  : "outline"
            }
          >
            {school.type === "senior"
              ? "Senior College"
              : school.type === "graduate"
                ? "Graduate Institution"
                : "Community College"}
          </Badge>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Enrollment</p>
            </div>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {school.enrollment.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-secondary-600 dark:text-secondary-400" />
              <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Founded</p>
            </div>
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
              <Badge key={idx} variant="secondary" className="text-xs">
                {program}
              </Badge>
            ))}
          </div>
        </div>

        {/* Website Link */}
        <Button
          onClick={() => window.open(school.website, "_blank")}
          variant="default"
          className="w-full gap-2"
        >
          <Globe className="h-4 w-4" />
          Visit Campus Website
        </Button>

        {/* Reviews Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          {user && !showReviewForm && (
            <Button
              onClick={() => setShowReviewForm(true)}
              variant="outline"
              className="w-full mb-6 gap-2"
            >
              <PenTool className="h-4 w-4" />
              Write a Review
            </Button>
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
