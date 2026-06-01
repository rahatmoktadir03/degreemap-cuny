import type { Edge, Node } from "reactflow";
import { semesterLabel, type Term } from "./semester";

export type RoadmapNodeStatus = "planned" | "in-progress" | "complete";
export type RoadmapNodeType = "course" | "milestone" | "elective" | "goal";

export interface RoadmapNodeData {
  label: string;
  credits?: number;
  // Canonical, orderable term/year. `semester` is the derived display label,
  // kept for backward compatibility with roadmaps saved before this model.
  term?: Term;
  year?: number;
  semester?: string;
  notes?: string;
  status: RoadmapNodeStatus;
  type: RoadmapNodeType;
}

export interface RoadmapTemplate {
  id: string;
  title: string;
  campus: string;
  summary: string;
  totalCredits: number;
  nodes: Node<RoadmapNodeData>[];
  edges: Edge[];
}

const node = (
  id: string,
  type: RoadmapNodeType,
  label: string,
  x: number,
  y: number,
  credits?: number,
  term?: Term,
  year?: number
): Node<RoadmapNodeData> => ({
  id,
  type: "roadmap",
  position: { x, y },
  data: {
    label,
    credits,
    term,
    year,
    semester: semesterLabel(term, year),
    status: "planned",
    type,
  },
});

const edge = (source: string, target: string): Edge => ({
  id: `${source}-${target}`,
  source,
  target,
  animated: false,
});

// CS at Hunter sample template
const csNodes: Node<RoadmapNodeData>[] = [
  node("goal", "goal", "Graduate: BS CS @ Hunter", 0, 0),
  node("s1", "milestone", "Fall 2025", 0, 100),
  node("c1", "course", "CSCI 127 · Intro to CS", -200, 200, 3, "Fall", 2025),
  node("c2", "course", "MATH 150 · Calculus I", 0, 200, 4, "Fall", 2025),
  node("c3", "course", "ENG 120 · Expository Writing", 200, 200, 3, "Fall", 2025),
  node("s2", "milestone", "Spring 2026", 0, 320),
  node("c4", "course", "CSCI 135 · Software Design", -200, 420, 3, "Spring", 2026),
  node("c5", "course", "MATH 155 · Calculus II", 0, 420, 4, "Spring", 2026),
  node("c6", "elective", "Gen Ed Elective", 200, 420, 3, "Spring", 2026),
  node("s3", "milestone", "Fall 2026", 0, 540),
  node("c7", "course", "CSCI 235 · Discrete Structures", -200, 640, 3, "Fall", 2026),
  node("c8", "course", "CSCI 260 · Hardware Fundamentals", 0, 640, 3, "Fall", 2026),
  node("c9", "course", "STAT 213 · Statistics", 200, 640, 3, "Fall", 2026),
];

const csEdges: Edge[] = [
  edge("goal", "s1"),
  edge("s1", "c1"),
  edge("s1", "c2"),
  edge("s1", "c3"),
  edge("c1", "c4"),
  edge("c2", "c5"),
  edge("s2", "c4"),
  edge("s2", "c5"),
  edge("s2", "c6"),
  edge("c4", "c7"),
  edge("s3", "c7"),
  edge("s3", "c8"),
  edge("s3", "c9"),
];

// Nursing at Hunter
const nursingNodes: Node<RoadmapNodeData>[] = [
  node("g", "goal", "Graduate: BS Nursing", 0, 0),
  node("s1", "milestone", "Year 1", 0, 100),
  node("n1", "course", "BIO 120 · Human Biology", -200, 200, 4, "Fall", 2025),
  node("n2", "course", "ENG 120 · Writing I", 0, 200, 3, "Fall", 2025),
  node("n3", "course", "PSYCH 100 · General Psychology", 200, 200, 3, "Spring", 2026),
  node("s2", "milestone", "Year 2", 0, 320),
  node("n4", "course", "CHEM 102 · Chemistry", -200, 420, 4, "Fall", 2026),
  node("n5", "course", "BIO 230 · Anatomy", 0, 420, 4, "Fall", 2026),
  node("n6", "course", "NURS 200 · Foundations", 200, 420, 3, "Spring", 2027),
  node("s3", "milestone", "Clinical Years", 0, 540),
  node("n7", "course", "NURS 320 · Med-Surg I", -200, 640, 5, "Fall", 2027),
  node("n8", "course", "NURS 340 · Mental Health", 0, 640, 4, "Spring", 2028),
  node("n9", "milestone", "NCLEX-RN Prep", 200, 640),
];

const nursingEdges: Edge[] = [
  edge("g", "s1"),
  edge("s1", "n1"),
  edge("s1", "n2"),
  edge("s1", "n3"),
  edge("n1", "n4"),
  edge("n1", "n5"),
  edge("s2", "n4"),
  edge("s2", "n5"),
  edge("s2", "n6"),
  edge("n6", "n7"),
  edge("s3", "n7"),
  edge("s3", "n8"),
  edge("s3", "n9"),
];

// Business at Baruch
const bizNodes: Node<RoadmapNodeData>[] = [
  node("g", "goal", "Graduate: BBA Finance", 0, 0),
  node("s1", "milestone", "Freshman", 0, 100),
  node("b1", "course", "ENG 2100 · Writing I", -200, 200, 3, "Fall", 2025),
  node("b2", "course", "MTH 2003 · Pre-Calc", 0, 200, 3, "Fall", 2025),
  node("b3", "course", "ECO 1001 · Macro", 200, 200, 3, "Spring", 2026),
  node("s2", "milestone", "Sophomore", 0, 320),
  node("b4", "course", "ACC 2101 · Financial Acc", -200, 420, 3, "Fall", 2026),
  node("b5", "course", "STA 2000 · Statistics", 0, 420, 3, "Fall", 2026),
  node("b6", "course", "ECO 1002 · Micro", 200, 420, 3, "Spring", 2027),
  node("s3", "milestone", "Junior/Senior", 0, 540),
  node("b7", "course", "FIN 3000 · Corporate Finance", -200, 640, 3, "Fall", 2027),
  node("b8", "course", "FIN 4710 · Investments", 0, 640, 3, "Fall", 2028),
  node("b9", "elective", "Capstone / Internship", 200, 640, 3, "Spring", 2029),
];

const bizEdges: Edge[] = [
  edge("g", "s1"),
  edge("s1", "b1"),
  edge("s1", "b2"),
  edge("s1", "b3"),
  edge("b2", "b5"),
  edge("b4", "b7"),
  edge("s2", "b4"),
  edge("s2", "b5"),
  edge("s2", "b6"),
  edge("s3", "b7"),
  edge("s3", "b8"),
  edge("s3", "b9"),
];

export const roadmapTemplates: RoadmapTemplate[] = [
  {
    id: "tpl-cs-hunter",
    title: "BS Computer Science",
    campus: "Hunter College",
    summary: "Common first-year and core CS sequence for Hunter's BS in Computer Science.",
    totalCredits: 120,
    nodes: csNodes,
    edges: csEdges,
  },
  {
    id: "tpl-nursing-hunter",
    title: "BS Nursing (BSN)",
    campus: "Hunter College",
    summary: "Pre-nursing foundations through clinical year courses for Hunter's BSN.",
    totalCredits: 124,
    nodes: nursingNodes,
    edges: nursingEdges,
  },
  {
    id: "tpl-bba-baruch",
    title: "BBA Finance",
    campus: "Baruch College",
    summary: "Sample Baruch Zicklin BBA Finance track from freshman through senior year.",
    totalCredits: 124,
    nodes: bizNodes,
    edges: bizEdges,
  },
];

export const getTemplateById = (id: string) => roadmapTemplates.find((t) => t.id === id);
