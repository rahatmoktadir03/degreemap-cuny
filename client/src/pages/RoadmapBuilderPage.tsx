import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import toast from "react-hot-toast";
import {
  BookOpen,
  Check,
  Copy,
  Flag,
  Plus,
  Save,
  Sparkles,
  Target,
  Trash2,
  Trophy,
} from "lucide-react";
import RoadmapNode from "../components/roadmap/RoadmapNode";
import {
  roadmapTemplates,
  type RoadmapNodeData,
  type RoadmapNodeStatus,
  type RoadmapNodeType,
  getTemplateById,
} from "../data/roadmapTemplates";
import { type StoredRoadmap } from "../services/roadmapStore";
import * as roadmapService from "../services/roadmapService";

const nodeTypes = { roadmap: RoadmapNode };

const newNode = (
  id: string,
  type: RoadmapNodeType,
  position: { x: number; y: number }
): Node<RoadmapNodeData> => ({
  id,
  type: "roadmap",
  position,
  data: {
    label:
      type === "course"
        ? "New Course"
        : type === "milestone"
          ? "New Milestone"
          : type === "elective"
            ? "Elective"
            : "Career Goal",
    credits: type === "course" || type === "elective" ? 3 : undefined,
    status: "planned",
    type,
  },
});

const typeButtons: { type: RoadmapNodeType; label: string; icon: typeof BookOpen; cls: string }[] =
  [
    { type: "course", label: "Course", icon: BookOpen, cls: "bg-blue-500" },
    { type: "milestone", label: "Milestone", icon: Flag, cls: "bg-purple-500" },
    { type: "elective", label: "Elective", icon: Target, cls: "bg-amber-500" },
    { type: "goal", label: "Goal", icon: Trophy, cls: "bg-emerald-500" },
  ];

const statusOptions: RoadmapNodeStatus[] = ["planned", "in-progress", "complete"];

const RoadmapBuilderPage = () => {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const [roadmapId, setRoadmapId] = useState<string>("");
  const [shareToken, setShareToken] = useState<string>("");
  const [title, setTitle] = useState("My CUNY Roadmap");
  const [nodes, setNodes] = useState<Node<RoadmapNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const nextIdRef = useRef(1);

  // Load existing roadmap or template, or start fresh
  useEffect(() => {
    if (!routeId) {
      setRoadmapId(roadmapService.generateRoadmapId());
      setShareToken(roadmapService.generateShareToken());
      setNodes([]);
      setEdges([]);
      return;
    }
    if (routeId.startsWith("tpl-")) {
      const tpl = getTemplateById(routeId);
      if (tpl) {
        setRoadmapId(roadmapService.generateRoadmapId());
        setShareToken(roadmapService.generateShareToken());
        setTitle(`${tpl.title} (from template)`);
        setNodes(tpl.nodes.map((n) => ({ ...n, position: { ...n.position } })));
        setEdges(tpl.edges.map((e) => ({ ...e })));
        toast.success(`Loaded template: ${tpl.title}`);
        return;
      }
    }
    (async () => {
      // Try server/local store via roadmapService
      const stored = await roadmapService.getRoadmap(routeId);
      if (stored) {
        setRoadmapId(stored.id);
        setShareToken(stored.shareToken);
        setTitle(stored.title);
        setNodes(stored.nodes);
        setEdges(stored.edges);
        return;
      }
      // Unknown id — treat as new
      setRoadmapId(routeId);
      setShareToken(roadmapService.generateShareToken());
    })();
  }, [routeId]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (conn: Connection) => setEdges((eds) => addEdge({ ...conn, animated: false }, eds)),
    []
  );

  const addNodeOfType = (type: RoadmapNodeType) => {
    const id = `n-${Date.now().toString(36)}-${nextIdRef.current++}`;
    const pos = rfInstance
      ? rfInstance.screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
      : { x: Math.random() * 300, y: Math.random() * 300 };
    setNodes((nds) => [...nds, newNode(id, type, pos)]);
    setSelectedNodeId(id);
  };

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId]
  );

  const updateSelected = (patch: Partial<RoadmapNodeData>) => {
    if (!selectedNodeId) return;
    setNodes((nds) =>
      nds.map((n) => (n.id === selectedNodeId ? { ...n, data: { ...n.data, ...patch } } : n))
    );
  };

  const deleteSelected = () => {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) =>
      eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId)
    );
    setSelectedNodeId(null);
  };

  const handleSave = async () => {
    if (!roadmapId) return;
    const roadmap: StoredRoadmap = {
      id: roadmapId,
      title,
      shareToken,
      nodes,
      edges,
      updatedAt: new Date().toISOString(),
    };
    try {
      const saved = await roadmapService.saveRoadmap(roadmap);
      // If server returned a new id, update route
      const newId = saved?.id ?? roadmapId;
      if (!routeId || routeId.startsWith("tpl-")) {
        navigate(`/roadmap/${newId}`, { replace: true });
      }
      setRoadmapId(newId);
      toast.success("Roadmap saved");
    } catch (err) {
      console.error(err);
      toast.error("Save failed — falling back to local save");
      // Fallback to local save
      await roadmapService.saveRoadmap(roadmap);
      toast.success("Roadmap saved locally");
    }
  };

  const copyShareLink = async () => {
    const url = `${window.location.origin}/share/${shareToken}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied");
    } catch {
      toast.error("Copy failed — link: " + url);
    }
  };

  // Stats
  const totalCredits = useMemo(
    () => nodes.reduce((sum, n) => sum + (n.data.credits ?? 0), 0),
    [nodes]
  );
  const completedCredits = useMemo(
    () =>
      nodes
        .filter((n) => n.data.status === "complete")
        .reduce((sum, n) => sum + (n.data.credits ?? 0), 0),
    [nodes]
  );

  return (
    <div className="bg-hero-gradient min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
              Roadmap Builder
            </p>
            <input
              aria-label="Roadmap title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 text-2xl sm:text-3xl font-extrabold border-transparent! bg-transparent! p-0! focus:shadow-none! w-full"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {totalCredits} planned cr · {completedCredits} completed cr · drag the canvas, connect
              handles, and click a node to edit.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyShareLink}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-800 text-sm font-semibold"
            >
              <Copy className="h-4 w-4" /> Share
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md"
            >
              <Save className="h-4 w-4" /> Save
            </button>
          </div>
        </div>

        {/* Templates strip — only shown when canvas is empty */}
        {nodes.length === 0 && (
          <div className="card-surface rounded-2xl p-5 shadow-sm mb-5">
            <p className="text-sm font-semibold inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-blue-500" /> Start from a template
            </p>
            <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {roadmapTemplates.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => navigate(`/roadmap/${t.id}`)}
                  className="text-left rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <p className="font-semibold">{t.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.campus}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t.summary}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Canvas + side panel */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-4">
          {/* Canvas */}
          <div
            className="card-surface rounded-2xl shadow-sm overflow-hidden"
            style={{ height: "70vh" }}
          >
            <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
                Add:
              </span>
              {typeButtons.map((b) => (
                <button
                  type="button"
                  key={b.type}
                  onClick={() => addNodeOfType(b.type)}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-400"
                >
                  <span
                    className={`inline-flex w-4 h-4 rounded-sm ${b.cls} items-center justify-center`}
                  >
                    <b.icon className="h-2.5 w-2.5 text-white" />
                  </span>
                  {b.label}
                </button>
              ))}
              <span className="ml-auto text-xs text-slate-400 hidden sm:inline">
                Drag nodes · connect handles · ⌫ to delete selection
              </span>
            </div>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setRfInstance}
              onNodeClick={(_, n) => setSelectedNodeId(n.id)}
              onPaneClick={() => setSelectedNodeId(null)}
              nodeTypes={nodeTypes}
              fitView
              defaultEdgeOptions={{ style: { stroke: "#94a3b8", strokeWidth: 2 } }}
            >
              <Background gap={20} size={1} color="#cbd5e1" />
              <MiniMap pannable zoomable className="bg-white! dark:bg-slate-800!" />
              <Controls />
            </ReactFlow>
          </div>

          {/* Inspector */}
          <aside className="card-surface rounded-2xl p-5 shadow-sm h-fit">
            <h3 className="font-bold text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Inspector
            </h3>
            {!selectedNode ? (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Click a node on the canvas to edit it. Use the buttons above to add new nodes.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Label
                  </label>
                  <input
                    value={selectedNode.data.label}
                    onChange={(e) => updateSelected({ label: e.target.value })}
                    aria-label="Node label"
                    placeholder="Node label"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Credits
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={12}
                      value={selectedNode.data.credits ?? 0}
                      onChange={(e) => updateSelected({ credits: Number(e.target.value) })}
                      aria-label="Credits"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Semester
                    </label>
                    <input
                      value={selectedNode.data.semester ?? ""}
                      onChange={(e) => updateSelected({ semester: e.target.value })}
                      placeholder="e.g. Fall 2025"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Notes
                  </label>
                  <textarea
                    rows={2}
                    value={selectedNode.data.notes ?? ""}
                    onChange={(e) => updateSelected({ notes: e.target.value })}
                    aria-label="Notes"
                    placeholder="Optional notes"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Status
                  </p>
                  <div className="grid grid-cols-3 gap-1">
                    {statusOptions.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => updateSelected({ status: s })}
                        className={`px-2 py-1.5 rounded-md text-xs font-semibold capitalize border transition-colors ${
                          selectedNode.data.status === s
                            ? s === "complete"
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : s === "in-progress"
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-slate-600 text-white border-slate-600"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {s === "complete" && <Check className="inline h-3 w-3 mr-1" />}
                        {s.replace("-", " ")}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={deleteSelected}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/25"
                >
                  <Trash2 className="h-4 w-4" /> Delete node
                </button>
              </div>
            )}
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                Quick add
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {typeButtons.map((b) => (
                  <button
                    type="button"
                    key={b.type}
                    onClick={() => addNodeOfType(b.type)}
                    className="inline-flex items-center gap-1.5 justify-center px-2 py-1.5 rounded-md text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:border-blue-400"
                  >
                    <Plus className="h-3 w-3" /> {b.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RoadmapBuilderPage;
