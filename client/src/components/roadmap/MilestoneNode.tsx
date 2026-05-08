import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import type { MilestoneNodeData } from '../../types/roadmap';

interface MilestoneNodeProps {
  data: MilestoneNodeData;
  isConnectable: boolean;
}

export const MilestoneNode: React.FC<MilestoneNodeProps> = ({ data, isConnectable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.label);
  const [description, setDescription] = useState(data.description || '');

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="px-4 py-3 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-400 rounded-lg shadow-md w-48">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-2 py-1 border border-purple-300 rounded text-sm font-semibold"
            placeholder="Milestone name"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-2 py-1 border border-purple-300 rounded text-sm h-16"
            placeholder="Description"
          />
          <button
            onClick={handleSave}
            className="w-full px-2 py-1 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700 transition"
          >
            Save
          </button>
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)} className="cursor-pointer">
          <p className="font-semibold text-purple-900 text-sm">🎯 {title}</p>
          {description && <p className="text-xs text-purple-700 mt-1">{description}</p>}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
};
