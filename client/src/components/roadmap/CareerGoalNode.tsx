import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import type { CareerGoalNodeData } from "../../types/roadmap";

interface CareerGoalNodeProps {
  data: CareerGoalNodeData;
  isConnectable: boolean;
}

export const CareerGoalNode: React.FC<CareerGoalNodeProps> = ({ data, isConnectable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.label);
  const [description, setDescription] = useState(data.description || "");

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="px-4 py-3 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 rounded-lg shadow-md w-48">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-2 py-1 border border-green-300 rounded text-sm font-semibold"
            placeholder="Career goal"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-2 py-1 border border-green-300 rounded text-sm h-16"
            placeholder="Description"
          />
          <button
            onClick={handleSave}
            className="w-full px-2 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition"
          >
            Save
          </button>
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)} className="cursor-pointer">
          <p className="font-semibold text-green-900 text-sm">🎓 {title}</p>
          {description && <p className="text-xs text-green-700 mt-1">{description}</p>}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
};
