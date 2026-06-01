import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactFlow, { Background, Controls, MiniMap, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";
import { ArrowLeft, Eye } from "lucide-react";
import RoadmapNode from "../components/roadmap/RoadmapNode";
import type { StoredRoadmap } from "../services/roadmapStore";
import * as roadmapService from "../services/roadmapService";
import type { RoadmapNodeData } from "../data/roadmapTemplates";

const nodeTypes = { roadmap: RoadmapNode };

const SharedRoadmapPage = () => {
  const { token = "" } = useParams();
  const [roadmap, setRoadmap] = useState<StoredRoadmap | null>(null);

  useEffect(() => {
    (async () => {
      const r = await roadmapService.getRoadmapByShareToken(token ?? "");
      setRoadmap(r);
    })();
  }, [token]);

  const nodes: Node<RoadmapNodeData>[] = useMemo(() => roadmap?.nodes ?? [], [roadmap]);
  const edges: Edge[] = useMemo(() => roadmap?.edges ?? [], [roadmap]);

  if (!roadmap) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Shared roadmap not found</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
          This share link doesn't match any roadmap on this device. Shared roadmaps are stored
          locally — the original author must open this link in the same browser, or you can{" "}
          <Link to="/roadmap-builder" className="text-blue-600 dark:text-blue-300 hover:underline">
            create your own
          </Link>
          .
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold"
        >
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
      </div>
    );
  }

  const totalCredits = nodes.reduce((s, n) => s + (n.data.credits ?? 0), 0);
  const completedCredits = nodes
    .filter((n) => n.data.status === "complete")
    .reduce((s, n) => s + (n.data.credits ?? 0), 0);

  return (
    <div className="bg-hero-gradient min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
              <Eye className="h-3 w-3" /> Read-only share
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold">{roadmap.title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Last updated {new Date(roadmap.updatedAt).toLocaleDateString()} · {completedCredits}/
              {totalCredits} credits complete
            </p>
          </div>
        </div>

        <div
          className="card-surface rounded-2xl shadow-sm overflow-hidden"
          style={{ height: "75vh" }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            defaultEdgeOptions={{ style: { stroke: "#94a3b8", strokeWidth: 2 } }}
          >
            <Background gap={20} size={1} color="#cbd5e1" />
            <MiniMap pannable zoomable />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default SharedRoadmapPage;
