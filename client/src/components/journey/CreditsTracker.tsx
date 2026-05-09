import React from "react";

interface CreditsTrackerProps {
  completedCredits: number;
  totalCredits: number;
}

export const CreditsTracker: React.FC<CreditsTrackerProps> = ({
  completedCredits,
  totalCredits,
}) => {
  const percentage = totalCredits > 0 ? Math.round((completedCredits / totalCredits) * 100) : 0;
  const remainingCredits = totalCredits - completedCredits;

  // SVG circle chart
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Credits Progress</h3>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40">
          {/* Background circle */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="8" fill="none" />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#10b981"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-gray-900">{percentage}%</p>
            <p className="text-sm text-gray-600">Complete</p>
          </div>
        </div>
      </div>

      {/* Credit breakdown */}
      <div className="space-y-3 border-t pt-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Completed</span>
          </div>
          <span className="font-semibold text-gray-900">{completedCredits} credits</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span className="text-gray-700">Remaining</span>
          </div>
          <span className="font-semibold text-gray-900">{remainingCredits} credits</span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-gray-700 font-medium">Total</span>
          <span className="text-xl font-bold text-gray-900">{totalCredits} credits</span>
        </div>
      </div>
    </div>
  );
};
