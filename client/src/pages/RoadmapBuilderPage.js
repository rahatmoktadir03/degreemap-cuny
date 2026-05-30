import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactFlow, { Background, Controls, MiniMap, addEdge, applyEdgeChanges, applyNodeChanges, } from "reactflow";
import "reactflow/dist/style.css";
import toast from "react-hot-toast";
import { BookOpen, Check, Copy, Flag, Plus, Save, Sparkles, Target, Trash2, Trophy, } from "lucide-react";
import RoadmapNode from "../components/roadmap/RoadmapNode";
import { roadmapTemplates, getTemplateById, } from "../data/roadmapTemplates";
import { generateRoadmapId, generateShareToken, getRoadmap, saveRoadmap, } from "../services/roadmapStore";
const nodeTypes = { roadmap: RoadmapNode };
const newNode = (id, type, position) => ({
    id,
    type: "roadmap",
    position,
    data: {
        label: type === "course" ? "New Course" : type === "milestone" ? "New Milestone" : type === "elective" ? "Elective" : "Career Goal",
        credits: type === "course" || type === "elective" ? 3 : undefined,
        status: "planned",
        type,
    },
});
const typeButtons = [
    { type: "course", label: "Course", icon: BookOpen, cls: "bg-blue-500" },
    { type: "milestone", label: "Milestone", icon: Flag, cls: "bg-purple-500" },
    { type: "elective", label: "Elective", icon: Target, cls: "bg-amber-500" },
    { type: "goal", label: "Goal", icon: Trophy, cls: "bg-emerald-500" },
];
const statusOptions = ["planned", "in-progress", "complete"];
const RoadmapBuilderPage = () => {
    const navigate = useNavigate();
    const { id: routeId } = useParams();
    const [rfInstance, setRfInstance] = useState(null);
    const [roadmapId, setRoadmapId] = useState("");
    const [shareToken, setShareToken] = useState("");
    const [title, setTitle] = useState("My CUNY Roadmap");
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const nextIdRef = useRef(1);
    // Load existing roadmap or template, or start fresh
    useEffect(() => {
        if (!routeId) {
            setRoadmapId(generateRoadmapId());
            setShareToken(generateShareToken());
            setNodes([]);
            setEdges([]);
            return;
        }
        if (routeId.startsWith("tpl-")) {
            const tpl = getTemplateById(routeId);
            if (tpl) {
                setRoadmapId(generateRoadmapId());
                setShareToken(generateShareToken());
                setTitle(`${tpl.title} (from template)`);
                setNodes(tpl.nodes.map((n) => ({ ...n, position: { ...n.position } })));
                setEdges(tpl.edges.map((e) => ({ ...e })));
                toast.success(`Loaded template: ${tpl.title}`);
                return;
            }
        }
        const stored = getRoadmap(routeId);
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
        setShareToken(generateShareToken());
    }, [routeId]);
    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    const onConnect = useCallback((conn) => setEdges((eds) => addEdge({ ...conn, animated: false }, eds)), []);
    const addNodeOfType = (type) => {
        const id = `n-${Date.now().toString(36)}-${nextIdRef.current++}`;
        const pos = rfInstance
            ? rfInstance.screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
            : { x: Math.random() * 300, y: Math.random() * 300 };
        setNodes((nds) => [...nds, newNode(id, type, pos)]);
        setSelectedNodeId(id);
    };
    const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId) ?? null, [nodes, selectedNodeId]);
    const updateSelected = (patch) => {
        if (!selectedNodeId)
            return;
        setNodes((nds) => nds.map((n) => n.id === selectedNodeId ? { ...n, data: { ...n.data, ...patch } } : n));
    };
    const deleteSelected = () => {
        if (!selectedNodeId)
            return;
        setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
        setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
        setSelectedNodeId(null);
    };
    const handleSave = () => {
        if (!roadmapId)
            return;
        const roadmap = {
            id: roadmapId,
            title,
            shareToken,
            nodes,
            edges,
            updatedAt: new Date().toISOString(),
        };
        saveRoadmap(roadmap);
        if (!routeId || routeId.startsWith("tpl-")) {
            navigate(`/roadmap/${roadmapId}`, { replace: true });
        }
        toast.success("Roadmap saved");
    };
    const copyShareLink = async () => {
        const url = `${window.location.origin}/share/${shareToken}`;
        try {
            await navigator.clipboard.writeText(url);
            toast.success("Share link copied");
        }
        catch {
            toast.error("Copy failed — link: " + url);
        }
    };
    // Stats
    const totalCredits = useMemo(() => nodes.reduce((sum, n) => sum + (n.data.credits ?? 0), 0), [nodes]);
    const completedCredits = useMemo(() => nodes
        .filter((n) => n.data.status === "complete")
        .reduce((sum, n) => sum + (n.data.credits ?? 0), 0), [nodes]);
    return (_jsx("div", { className: "bg-hero-gradient min-h-[calc(100vh-4rem)]", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300", children: "Roadmap Builder" }), _jsx("input", { "aria-label": "Roadmap title", value: title, onChange: (e) => setTitle(e.target.value), className: "mt-1 text-2xl sm:text-3xl font-extrabold border-transparent! bg-transparent! p-0! focus:shadow-none! w-full" }), _jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-1", children: [totalCredits, " planned cr \u00B7 ", completedCredits, " completed cr \u00B7 drag the canvas, connect handles, and click a node to edit."] })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsxs("button", { type: "button", onClick: copyShareLink, className: "inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-800 text-sm font-semibold", children: [_jsx(Copy, { className: "h-4 w-4" }), " Share"] }), _jsxs("button", { type: "button", onClick: handleSave, className: "inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md", children: [_jsx(Save, { className: "h-4 w-4" }), " Save"] })] })] }), nodes.length === 0 && (_jsxs("div", { className: "card-surface rounded-2xl p-5 shadow-sm mb-5", children: [_jsxs("p", { className: "text-sm font-semibold inline-flex items-center gap-1.5", children: [_jsx(Sparkles, { className: "h-4 w-4 text-blue-500" }), " Start from a template"] }), _jsx("div", { className: "mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3", children: roadmapTemplates.map((t) => (_jsxs("button", { type: "button", onClick: () => navigate(`/roadmap/${t.id}`), className: "text-left rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-blue-400 hover:shadow-md transition-all", children: [_jsx("p", { className: "font-semibold", children: t.title }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: t.campus }), _jsx("p", { className: "mt-2 text-sm text-slate-600 dark:text-slate-300", children: t.summary })] }, t.id))) })] })), _jsxs("div", { className: "grid lg:grid-cols-[1fr_320px] gap-4", children: [_jsxs("div", { className: "card-surface rounded-2xl shadow-sm overflow-hidden", style: { height: "70vh" }, children: [_jsxs("div", { className: "flex items-center gap-2 px-3 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70", children: [_jsx("span", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1", children: "Add:" }), typeButtons.map((b) => (_jsxs("button", { type: "button", onClick: () => addNodeOfType(b.type), className: "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-400", children: [_jsx("span", { className: `inline-flex w-4 h-4 rounded-sm ${b.cls} items-center justify-center`, children: _jsx(b.icon, { className: "h-2.5 w-2.5 text-white" }) }), b.label] }, b.type))), _jsx("span", { className: "ml-auto text-xs text-slate-400 hidden sm:inline", children: "Drag nodes \u00B7 connect handles \u00B7 \u232B to delete selection" })] }), _jsxs(ReactFlow, { nodes: nodes, edges: edges, onNodesChange: onNodesChange, onEdgesChange: onEdgesChange, onConnect: onConnect, onInit: setRfInstance, onNodeClick: (_, n) => setSelectedNodeId(n.id), onPaneClick: () => setSelectedNodeId(null), nodeTypes: nodeTypes, fitView: true, defaultEdgeOptions: { style: { stroke: "#94a3b8", strokeWidth: 2 } }, children: [_jsx(Background, { gap: 20, size: 1, color: "#cbd5e1" }), _jsx(MiniMap, { pannable: true, zoomable: true, className: "bg-white! dark:bg-slate-800!" }), _jsx(Controls, {})] })] }), _jsxs("aside", { className: "card-surface rounded-2xl p-5 shadow-sm h-fit", children: [_jsx("h3", { className: "font-bold text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400", children: "Inspector" }), !selectedNode ? (_jsx("p", { className: "mt-2 text-sm text-slate-500 dark:text-slate-400", children: "Click a node on the canvas to edit it. Use the buttons above to add new nodes." })) : (_jsxs("div", { className: "mt-3 space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400", children: "Label" }), _jsx("input", { value: selectedNode.data.label, onChange: (e) => updateSelected({ label: e.target.value }), "aria-label": "Node label", placeholder: "Node label" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400", children: "Credits" }), _jsx("input", { type: "number", min: 0, max: 12, value: selectedNode.data.credits ?? 0, onChange: (e) => updateSelected({ credits: Number(e.target.value) }), "aria-label": "Credits", placeholder: "0" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400", children: "Semester" }), _jsx("input", { value: selectedNode.data.semester ?? "", onChange: (e) => updateSelected({ semester: e.target.value }), placeholder: "e.g. Fall 2025" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400", children: "Notes" }), _jsx("textarea", { rows: 2, value: selectedNode.data.notes ?? "", onChange: (e) => updateSelected({ notes: e.target.value }), "aria-label": "Notes", placeholder: "Optional notes" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1", children: "Status" }), _jsx("div", { className: "grid grid-cols-3 gap-1", children: statusOptions.map((s) => (_jsxs("button", { type: "button", onClick: () => updateSelected({ status: s }), className: `px-2 py-1.5 rounded-md text-xs font-semibold capitalize border transition-colors ${selectedNode.data.status === s
                                                            ? s === "complete"
                                                                ? "bg-emerald-500 text-white border-emerald-500"
                                                                : s === "in-progress"
                                                                    ? "bg-blue-500 text-white border-blue-500"
                                                                    : "bg-slate-600 text-white border-slate-600"
                                                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"}`, children: [s === "complete" && _jsx(Check, { className: "inline h-3 w-3 mr-1" }), s.replace("-", " ")] }, s))) })] }), _jsxs("button", { type: "button", onClick: deleteSelected, className: "w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/25", children: [_jsx(Trash2, { className: "h-4 w-4" }), " Delete node"] })] })), _jsxs("div", { className: "mt-5 pt-4 border-t border-slate-200 dark:border-slate-700", children: [_jsx("p", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2", children: "Quick add" }), _jsx("div", { className: "grid grid-cols-2 gap-1.5", children: typeButtons.map((b) => (_jsxs("button", { type: "button", onClick: () => addNodeOfType(b.type), className: "inline-flex items-center gap-1.5 justify-center px-2 py-1.5 rounded-md text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:border-blue-400", children: [_jsx(Plus, { className: "h-3 w-3" }), " ", b.label] }, b.type))) })] })] })] })] }) }));
};
export default RoadmapBuilderPage;
