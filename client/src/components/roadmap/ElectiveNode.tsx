import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import type { ElectiveNodeData } from "../../types/roadmap";
import { Semester } from "../../types/roadmap";

interface ElectiveNodeProps {
  data: ElectiveNodeData;
  isConnectable: boolean;
}

export const ElectiveNode: React.FC<ElectiveNodeProps> = ({ data, isConnectable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.label);
  const [credits, setCredits] = useState(data.credits.toString());
  const [semester, setSemester] = useState(data.semester);

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="px-4 py-3 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-400 rounded-lg shadow-md w-48">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-2 py-1 border border-amber-300 rounded text-sm font-semibold"
            placeholder="Elective name"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              min="1"
              max="6"
              className="w-16 px-2 py-1 border border-amber-300 rounded text-sm"
              placeholder="Credits"
            />
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value as Semester)}
              className="flex-1 px-2 py-1 border border-amber-300 rounded text-sm"
            >
              {Object.values(Semester).map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSave}
            className="w-full px-2 py-1 bg-amber-600 text-white rounded text-sm font-medium hover:bg-amber-700 transition"
          >
            Save
          </button>
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)} className="cursor-pointer">
          <p className="font-semibold text-amber-900 text-sm">★ {title}</p>
          <p className="text-xs text-amber-700">
            {credits} Credits • {semester}
          </p>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
};
