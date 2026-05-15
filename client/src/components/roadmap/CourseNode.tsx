import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import type { CourseNodeData } from "../../types/roadmap";
import { Semester } from "../../types/roadmap";

interface CourseNodeProps {
  data: CourseNodeData;
  isConnectable: boolean;
}

export const CourseNode: React.FC<CourseNodeProps> = ({ data, isConnectable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.label);
  const [credits, setCredits] = useState(data.credits.toString());
  const [semester, setSemester] = useState(data.semester);

  const handleSave = () => {
    // Update parent node data through React Flow's event system
    // For now, we'll just close editing mode
    setIsEditing(false);
  };

  return (
    <div className="px-4 py-3 bg-linear-to-br from-blue-50 to-blue-100 border-2 border-blue-400 rounded-lg shadow-md w-48">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-2 py-1 border border-blue-300 rounded text-sm font-semibold"
            placeholder="Course name"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              min="1"
              max="6"
              className="w-16 px-2 py-1 border border-blue-300 rounded text-sm"
              placeholder="Credits"
            />
            <select
              title="Select semester for course"
              value={semester}
              onChange={(e) => setSemester(e.target.value as Semester)}
              className="flex-1 px-2 py-1 border border-blue-300 rounded text-sm"
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
            className="w-full px-2 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)} className="cursor-pointer">
          <p className="font-semibold text-blue-900 text-sm">{title}</p>
          <p className="text-xs text-blue-700">
            {credits} Credits • {semester}
          </p>
          {data.notes && <p className="text-xs text-blue-600 mt-1">{data.notes}</p>}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
};
