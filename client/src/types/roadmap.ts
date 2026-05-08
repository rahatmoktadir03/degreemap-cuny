import type { Node, Edge } from 'reactflow';

// Node types enum
export type NodeType = 'course' | 'milestone' | 'elective' | 'careerGoal';

// Semester enum - using const instead of enum for ESM compatibility
export const Semester = {
  Fall: 'Fall',
  Spring: 'Spring',
  Summer: 'Summer',
} as const;

export type Semester = typeof Semester[keyof typeof Semester];

// Node data interface - extended from React Flow Node
export interface CourseNodeData {
  label: string;
  credits: number;
  semester: Semester;
  notes?: string;
  completed?: boolean;
}

export interface MilestoneNodeData {
  label: string;
  description?: string;
  completed?: boolean;
}

export interface ElectiveNodeData {
  label: string;
  credits: number;
  semester: Semester;
  notes?: string;
  completed?: boolean;
}

export interface CareerGoalNodeData {
  label: string;
  description?: string;
  completed?: boolean;
}

export type RoadmapNodeData = CourseNodeData | MilestoneNodeData | ElectiveNodeData | CareerGoalNodeData;

// React Flow Node type
export type RoadmapNode = Node<RoadmapNodeData, NodeType>;

// React Flow Edge type
export type RoadmapEdge = Edge<{ animated?: boolean; label?: string }>;

// Roadmap database record
export interface Roadmap {
  id: string;
  userId: string;
  title: string;
  description?: string;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  isTemplate: boolean;
  templateName?: string; // e.g., "Computer Science", "Business Administration"
  createdAt: string;
  updatedAt: string;
}

// API request/response types
export interface CreateRoadmapRequest {
  title: string;
  description?: string;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

export interface UpdateRoadmapRequest {
  title?: string;
  description?: string;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

export interface RoadmapResponse {
  success: boolean;
  data?: Roadmap;
  error?: string;
}

export interface RoadmapsListResponse {
  success: boolean;
  data?: Roadmap[];
  error?: string;
}
