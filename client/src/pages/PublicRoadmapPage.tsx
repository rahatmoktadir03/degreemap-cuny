import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import type { Roadmap } from "../types/roadmap";
import { CourseNode } from "../components/roadmap/CourseNode";
import { MilestoneNode } from "../components/roadmap/MilestoneNode";
import { ElectiveNode } from "../components/roadmap/ElectiveNode";
import { CareerGoalNode } from "../components/roadmap/CareerGoalNode";

const nodeTypes = {
  course: CourseNode,
  milestone: MilestoneNode,
  elective: ElectiveNode,
  careerGoal: CareerGoalNode,
};

export const PublicRoadmapPage: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await fetch(`${API_URL}/api/roadmaps/public/${shareId}`);
        
        if (!response.ok) {
          throw new Error("Roadmap not found or has been deleted");
        }
        
        const data = await response.json();
        setRoadmap(data.data || data);
      } catch (err) {
        console.error("Error loading roadmap:", err);
        setError("Failed to load this roadmap. It may have been deleted or the link is invalid.");
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      fetchRoadmap();
    }
  }, [shareId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
            {error || "Roadmap not found"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            This roadmap link may have expired or been deleted. Please ask the owner to share it again.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-sky-600 dark:bg-sky-700 text-white rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition font-medium"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">📋 {roadmap.title}</h1>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">
              Shared Roadmap
              {roadmap.description && ` · ${roadmap.description}`}
            </p>
          </div>
          <a
            href="/"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm whitespace-nowrap"
          >
            ← Home
          </a>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-white dark:bg-gray-800 relative">
        <ReactFlow
          nodes={roadmap.nodes || []}
          edges={roadmap.edges || []}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Footer Info */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-3 text-xs lg:text-sm text-gray-600 dark:text-gray-400 flex justify-between items-center">
        <p>This is a read-only view of a shared roadmap</p>
        <p>{roadmap.nodes?.length || 0} nodes · {roadmap.edges?.length || 0} connections</p>
      </div>
    </div>
  );
};
