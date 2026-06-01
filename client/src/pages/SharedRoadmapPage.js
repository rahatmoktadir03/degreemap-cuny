import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import { ArrowLeft, Eye } from "lucide-react";
import RoadmapNode from "../components/roadmap/RoadmapNode";
import * as roadmapService from "../services/roadmapService";
const nodeTypes = { roadmap: RoadmapNode };
const SharedRoadmapPage = () => {
    const { token = "" } = useParams();
    const [roadmap, setRoadmap] = useState(null);
    useEffect(() => {
        (async () => {
            const r = await roadmapService.getRoadmapByShareToken(token ?? "");
            setRoadmap(r);
        })();
    }, [token]);
    const nodes = useMemo(() => roadmap?.nodes ?? [], [roadmap]);
    const edges = useMemo(() => roadmap?.edges ?? [], [roadmap]);
    if (!roadmap) {
        return (_jsxs("div", { className: "max-w-3xl mx-auto px-4 py-20 text-center", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Shared roadmap not found" }), _jsxs("p", { className: "text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto", children: ["This share link doesn't match any roadmap on this device. Shared roadmaps are stored locally \u2014 the original author must open this link in the same browser, or you can", " ", _jsx(Link, { to: "/roadmap-builder", className: "text-blue-600 dark:text-blue-300 hover:underline", children: "create your own" }), "."] }), _jsxs(Link, { to: "/", className: "mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), " Back home"] })] }));
    }
    const totalCredits = nodes.reduce((s, n) => s + (n.data.credits ?? 0), 0);
    const completedCredits = nodes
        .filter((n) => n.data.status === "complete")
        .reduce((s, n) => s + (n.data.credits ?? 0), 0);
    return (_jsx("div", { className: "bg-hero-gradient min-h-[calc(100vh-4rem)]", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs(Link, { to: "/", className: "inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 mb-4", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), " Back home"] }), _jsx("div", { className: "flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5", children: _jsxs("div", { children: [_jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300", children: [_jsx(Eye, { className: "h-3 w-3" }), " Read-only share"] }), _jsx("h1", { className: "mt-2 text-3xl sm:text-4xl font-extrabold", children: roadmap.title }), _jsxs("p", { className: "text-sm text-slate-500 dark:text-slate-400 mt-1", children: ["Last updated ", new Date(roadmap.updatedAt).toLocaleDateString(), " \u00B7 ", completedCredits, "/", totalCredits, " credits complete"] })] }) }), _jsx("div", { className: "card-surface rounded-2xl shadow-sm overflow-hidden", style: { height: "75vh" }, children: _jsxs(ReactFlow, { nodes: nodes, edges: edges, nodeTypes: nodeTypes, fitView: true, nodesDraggable: false, nodesConnectable: false, elementsSelectable: false, defaultEdgeOptions: { style: { stroke: "#94a3b8", strokeWidth: 2 } }, children: [_jsx(Background, { gap: 20, size: 1, color: "#cbd5e1" }), _jsx(MiniMap, { pannable: true, zoomable: true }), _jsx(Controls, { showInteractive: false })] }) })] }) }));
};
export default SharedRoadmapPage;
