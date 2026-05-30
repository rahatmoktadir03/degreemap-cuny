import { Handle, Position, type NodeProps } from "reactflow";
import { BookOpen, Flag, Target, Trophy } from "lucide-react";
import type { RoadmapNodeData, RoadmapNodeStatus, RoadmapNodeType } from "../../data/roadmapTemplates";

const typeStyles: Record<RoadmapNodeType, { icon: typeof BookOpen; label: string; ring: string; bg: string }> = {
  course: { icon: BookOpen, label: "Course", ring: "ring-blue-500", bg: "bg-blue-500" },
  milestone: { icon: Flag, label: "Milestone", ring: "ring-purple-500", bg: "bg-purple-500" },
  elective: { icon: Target, label: "Elective", ring: "ring-amber-500", bg: "bg-amber-500" },
  goal: { icon: Trophy, label: "Goal", ring: "ring-emerald-500", bg: "bg-emerald-500" },
};

const statusStyles: Record<RoadmapNodeStatus, string> = {
  planned: "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700",
  "in-progress":
    "bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/40",
  complete:
    "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/40",
};

const statusDot: Record<RoadmapNodeStatus, string> = {
  planned: "bg-slate-300 dark:bg-slate-600",
  "in-progress": "bg-blue-500",
  complete: "bg-emerald-500",
};

const RoadmapNode = ({ data, selected }: NodeProps<RoadmapNodeData>) => {
  const meta = typeStyles[data.type];
  const Icon = meta.icon;
  return (
    <div
      className={`relative rounded-xl border-2 px-3 py-2 shadow-sm min-w-[180px] ${statusStyles[data.status]} ${
        selected ? `ring-2 ${meta.ring}` : ""
      } transition-shadow hover:shadow-md`}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-400" />
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-white ${meta.bg}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight truncate text-slate-900 dark:text-slate-100">
            {data.label}
          </p>
          <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {meta.label}
            {data.credits ? ` · ${data.credits} cr` : ""}
            {data.semester ? ` · ${data.semester}` : ""}
          </p>
        </div>
        <span
          aria-label={data.status}
          title={data.status}
          className={`shrink-0 inline-block w-2.5 h-2.5 rounded-full ${statusDot[data.status]}`}
        />
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-slate-400" />
    </div>
  );
};

export default RoadmapNode;
