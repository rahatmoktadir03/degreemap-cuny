export interface Roadmap {
  id: string;
  user_id: string;
  title: string;
  description: string;
  degree_program: string;
  school_id: string;
  created_at: string;
  updated_at: string;
  nodes: RoadmapNode[];
  shared_with: string[];
}

export interface RoadmapNode {
  id: string;
  type: "course" | "milestone" | "elective" | "goal";
  title: string;
  description: string;
  semester: number;
  credits: number;
  prerequisites: string[];
  position: { x: number; y: number };
}

export interface Career {
  id: string;
  title: string;
  description: string;
  roadmaps: Roadmap[];
}
