import React from "react";

interface ProgressCardProps {
  label: string;
  value: number;
  total: number;
  isPercentage?: boolean;
  color: "emerald" | "amber" | "blue" | "sky";
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  label,
  value,
  total,
  isPercentage,
  color,
}) => {
  const percentage = isPercentage ? value : Math.round((value / total) * 100);

  const colorClasses = {
    emerald: "from-emerald-500 to-green-600 text-emerald-50",
    amber: "from-amber-500 to-orange-600 text-amber-50",
    blue: "from-blue-500 to-indigo-600 text-blue-50",
    sky: "from-sky-500 to-blue-600 text-sky-50",
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg shadow p-6 text-white`}>
      <p className="text-sm font-medium opacity-90">{label}</p>
      <p className="text-4xl font-bold mt-2">
        {value}
        {isPercentage ? "%" : ""}
      </p>
      {!isPercentage && <p className="text-sm opacity-75 mt-1">of {total}</p>}
      <div className="mt-4 bg-white bg-opacity-20 rounded h-2">
        <div
          className="bg-white h-2 rounded transition-all"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
