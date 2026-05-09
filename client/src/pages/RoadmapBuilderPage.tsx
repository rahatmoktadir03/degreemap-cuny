import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
} from "reactflow";
import type { Connection } from "reactflow";
import "reactflow/dist/style.css";
import { useAuth } from "../store/AuthContext";
import { useNavigate } from "react-router-dom";
import { DarkModeToggle } from "../components/DarkModeToggle";
import { CourseNode } from "../components/roadmap/CourseNode";
import { MilestoneNode } from "../components/roadmap/MilestoneNode";
import { ElectiveNode } from "../components/roadmap/ElectiveNode";
import { CareerGoalNode } from "../components/roadmap/CareerGoalNode";
import type { RoadmapNode, RoadmapEdge, NodeType } from "../types/roadmap";
import { Semester } from "../types/roadmap";

const nodeTypes = {
  course: CourseNode,
  milestone: MilestoneNode,
  elective: ElectiveNode,
  careerGoal: CareerGoalNode,
};

const initialNodes: RoadmapNode[] = [
  {
    id: "1",
    type: "careerGoal",
    data: { label: "My Career Goal", description: "Define your career objective" },
    position: { x: 250, y: 0 },
  },
  {
    id: "2",
    type: "course",
    data: { label: "Introduction to CS", credits: 3, semester: Semester.Fall },
    position: { x: 100, y: 150 },
  },
  {
    id: "3",
    type: "course",
    data: { label: "Data Structures", credits: 4, semester: Semester.Spring },
    position: { x: 300, y: 150 },
  },
];

const initialEdges: RoadmapEdge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
];

export const RoadmapBuilderPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("My Academic Roadmap");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeType, setSelectedNodeType] = useState<NodeType>("course");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const nodeIdRef = useRef(4);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Handle connecting nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  // Add a new node
  const handleAddNode = useCallback(() => {
    const newNodeId = String(nodeIdRef.current++);
    const randomX = Math.random() * 400 + 100;
    const randomY = Math.random() * 300 + 200;

    let newNode: RoadmapNode;

    switch (selectedNodeType) {
      case "course":
        newNode = {
          id: newNodeId,
          type: "course",
          data: { label: "New Course", credits: 3, semester: Semester.Fall },
          position: { x: randomX, y: randomY },
        };
        break;
      case "milestone":
        newNode = {
          id: newNodeId,
          type: "milestone",
          data: { label: "New Milestone", description: "" },
          position: { x: randomX, y: randomY },
        };
        break;
      case "elective":
        newNode = {
          id: newNodeId,
          type: "elective",
          data: { label: "New Elective", credits: 3, semester: Semester.Spring },
          position: { x: randomX, y: randomY },
        };
        break;
      case "careerGoal":
        newNode = {
          id: newNodeId,
          type: "careerGoal",
          data: { label: "New Career Goal", description: "" },
          position: { x: randomX, y: randomY },
        };
        break;
    }

    setNodes((nds) => [...nds, newNode]);
  }, [selectedNodeType, setNodes]);

  // Delete selected node
  const handleDeleteNode = useCallback(() => {
    const selectedNode = nodes.find((node) => node.selected);
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) =>
        eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id)
      );
    }
  }, [nodes, setNodes, setEdges]);

  // Save roadmap (placeholder)
  const handleSave = () => {
    console.log("Saving roadmap:", {
      title,
      nodes,
      edges,
      userId: user?.id,
    });
    alert("Roadmap saved! (Integration coming next)");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Roadmap Builder</h1>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">Create your personalized academic path</p>
          </div>
          <div className="flex gap-2">
            <DarkModeToggle />
            <button
              onClick={() => navigate("/dashboard")}
              className="px-3 lg:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm lg:text-base whitespace-nowrap"
            >
              ← Back
            </button>
          </div>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold mb-4 text-sm lg:text-base"
          placeholder="Roadmap title"
        />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
        {/* Left Sidebar - Controls */}
        <div
          className={`lg:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-y-auto transition-all duration-300 ${
            sidebarOpen ? "block w-full lg:w-64 mb-4 lg:mb-0" : "hidden lg:block lg:w-64"
          }`}
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Node Types</h2>

          <div className="space-y-3 mb-6">
            {(["course", "milestone", "elective", "careerGoal"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedNodeType(type)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition ${
                  selectedNodeType === type
                    ? "bg-sky-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {type === "careerGoal"
                  ? "🎓 Career Goal"
                  : type === "course"
                    ? "📚 Course"
                    : type === "milestone"
                      ? "🎯 Milestone"
                      : "★ Elective"}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddNode}
            className="w-full px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition font-medium mb-3"
          >
            + Add Node
          </button>

          <button
            onClick={handleDeleteNode}
            className="w-full px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition font-medium mb-6"
          >
            🗑️ Delete Selected
          </button>

          <div className="border-t dark:border-gray-700 pt-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Instructions</h3>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
              <li>• Click a node to select it</li>
              <li>• Click a node to edit its details</li>
              <li>• Drag to connect nodes</li>
              <li>• Scroll to zoom, drag to pan</li>
              <li>• Use minimap to navigate</li>
            </ul>
          </div>
        </div>

        {/* Center - React Flow Canvas */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden relative flex flex-col">
          {/* Mobile Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden absolute top-4 left-4 z-10 bg-sky-600 dark:bg-sky-700 text-white p-2 rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition"
            title="Toggle controls"
          >
            ⚙️
          </button>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#aaa" gap={16} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>

      {/* Footer - Save */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition font-medium"
          >
            💾 Save Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};
