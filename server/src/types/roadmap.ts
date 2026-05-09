// Node types enum
export type NodeType = "course" | "milestone" | "elective" | "careerGoal";

// Completion status
export const CompletionStatus = {
  Planned: "planned",
  InProgress: "in-progress",
  Completed: "completed",
} as const;

export type CompletionStatus = (typeof CompletionStatus)[keyof typeof CompletionStatus];

// Semester - using const instead of enum for ESM compatibility
export const Semester = {
  Fall: "Fall",
  Spring: "Spring",
  Summer: "Summer",
} as const;

export type Semester = (typeof Semester)[keyof typeof Semester];

// Node data interfaces
export interface CourseNodeData {
  label: string;
  credits: number;
  semester: Semester;
  notes?: string;
  status?: CompletionStatus;
}

export interface MilestoneNodeData {
  label: string;
  description?: string;
  status?: CompletionStatus;
}

export interface ElectiveNodeData {
  label: string;
  credits: number;
  semester: Semester;
  notes?: string;
  status?: CompletionStatus;
}

export interface CareerGoalNodeData {
  label: string;
  description?: string;
  status?: CompletionStatus;
}

export type RoadmapNodeData =
  | CourseNodeData
  | MilestoneNodeData
  | ElectiveNodeData
  | CareerGoalNodeData;

// React Flow Node and Edge types
export interface RoadmapNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: RoadmapNodeData;
}

export interface RoadmapEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  label?: string;
}

// Roadmap database record
export interface Roadmap {
  id: string;
  userId: string;
  title: string;
  description?: string;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  isTemplate: boolean;
  templateName?: string;
  shareId?: string;
  createdAt: string;
  updatedAt: string;
}
