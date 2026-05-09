import React from "react";
import type { School } from "../types/school";

interface SchoolSidebarProps {
  school: School | null;
  onClose: () => void;
}

const SchoolSidebar: React.FC<SchoolSidebarProps> = ({ school, onClose }) => {
  if (!school) return null;

  return (
    <div className="w-full lg:fixed lg:right-0 lg:top-0 lg:h-full lg:w-96 bg-white shadow-xl z-40 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
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
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm font-semibold mb-1">Enrollment</p>
            <p className="text-2xl font-bold text-primary-600">
              {school.enrollment.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm font-semibold mb-1">Founded</p>
            <p className="text-2xl font-bold text-secondary-600">{school.founded}</p>
          </div>
        </div>

        {/* Programs */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-gray-800">Programs Offered</h3>
          <div className="flex flex-wrap gap-2">
            {school.programs.map((program, idx) => (
              <span
                key={idx}
                className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
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
          className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition"
        >
          Visit Campus Website →
        </a>
      </div>
    </div>
  );
};

export default SchoolSidebar;
