import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import { Award, CheckCircle2, Circle, Flag, GraduationCap, Target, TrendingUp } from "lucide-react";
import * as roadmapService from "../services/roadmapService";
import { useEffect, useState } from "react";
const milestonesPlan = [
    { label: "Enrolled at CUNY", done: true, term: "Fall 2024" },
    { label: "Completed 30 credits (Sophomore)", done: true, term: "Spring 2025" },
    { label: "Declared major", done: true, term: "Spring 2025" },
    { label: "Completed 60 credits (Junior)", done: false, term: "Fall 2025" },
    { label: "Apply for internship", done: false, term: "Spring 2026" },
    { label: "Completed 90 credits (Senior)", done: false, term: "Spring 2027" },
    { label: "Graduate 🎓", done: false, term: "Spring 2028" },
];
const STATUS_COLORS = {
    complete: "#10b981",
    "in-progress": "#3b82f6",
    planned: "#94a3b8",
    remaining: "#e2e8f0",
};
const DEGREE_TOTAL = 120;
const JourneyDashboardPage = () => {
    const [roadmaps, setRoadmaps] = useState([]);
    useEffect(() => {
        (async () => {
            const list = await roadmapService.listRoadmaps();
            setRoadmaps(list);
        })();
    }, []);
    const primary = roadmaps[0];
    const credits = useMemo(() => {
        const acc = { complete: 0, "in-progress": 0, planned: 0 };
        primary?.nodes.forEach((n) => {
            const c = n.data.credits ?? 0;
            if (!c)
                return;
            acc[n.data.status] += c;
        });
        return acc;
    }, [primary]);
    const earned = credits.complete;
    const inProgress = credits["in-progress"];
    const planned = credits.planned;
    const totalPlanned = earned + inProgress + planned;
    const remaining = Math.max(0, DEGREE_TOTAL - totalPlanned);
    const progressPct = Math.min(100, Math.round((earned / DEGREE_TOTAL) * 100));
    const pieData = [
        { name: "Complete", value: earned, color: STATUS_COLORS.complete },
        { name: "In progress", value: inProgress, color: STATUS_COLORS["in-progress"] },
        { name: "Planned", value: planned, color: STATUS_COLORS.planned },
        { name: "Remaining", value: remaining, color: STATUS_COLORS.remaining },
    ].filter((d) => d.value > 0);
    // Per-semester bar chart
    const bySemester = useMemo(() => {
        const map = new Map();
        primary?.nodes.forEach((n) => {
            const sem = n.data.semester;
            const c = n.data.credits ?? 0;
            if (!sem || !c)
                return;
            const key = `${sem}::${n.data.status}`;
            const prev = map.get(key);
            if (prev)
                prev.credits += c;
            else
                map.set(key, { semester: sem, credits: c, status: n.data.status });
        });
        // group by semester for chart
        const semesters = Array.from(new Set(Array.from(map.values()).map((v) => v.semester)));
        return semesters.map((sem) => {
            const entries = Array.from(map.values()).filter((e) => e.semester === sem);
            return {
                semester: sem,
                complete: entries.filter((e) => e.status === "complete").reduce((a, e) => a + e.credits, 0),
                progress: entries
                    .filter((e) => e.status === "in-progress")
                    .reduce((a, e) => a + e.credits, 0),
                planned: entries.filter((e) => e.status === "planned").reduce((a, e) => a + e.credits, 0),
            };
        });
    }, [primary]);
    const stats = [
        { label: "Credits earned", value: `${earned}`, suffix: `/ ${DEGREE_TOTAL}`, icon: TrendingUp },
        { label: "In progress", value: `${inProgress}`, suffix: "cr", icon: GraduationCap },
        {
            label: "Major",
            value: primary?.major ?? primary?.title ?? "BS CS",
            suffix: "",
            icon: Target,
        },
        { label: "Expected grad", value: "2028", suffix: "", icon: Flag },
    ];
    return (_jsx("div", { className: "bg-hero-gradient", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14", children: [_jsxs("div", { className: "animate-fade-in-up flex flex-col md:flex-row md:items-end md:justify-between gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300", children: "My Journey" }), _jsxs("h1", { className: "mt-1 text-3xl sm:text-4xl font-extrabold", children: ["Track your ", _jsx("span", { className: "text-gradient", children: "progress" })] }), _jsx("p", { className: "mt-2 text-slate-600 dark:text-slate-400", children: "Live numbers from your active roadmap." })] }), primary && (_jsxs(Link, { to: `/roadmap/${primary.id}`, className: "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-800 text-sm font-semibold", children: [_jsx(Award, { className: "h-4 w-4" }), " Open active roadmap"] }))] }), _jsxs("div", { className: "mt-8 grid lg:grid-cols-[1.3fr_1fr] gap-5", children: [_jsxs("div", { className: "card-surface rounded-2xl p-6 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "font-semibold", children: "Degree progress" }), _jsxs("p", { className: "text-2xl font-extrabold text-gradient", children: [progressPct, "%"] })] }), _jsx("div", { className: "mt-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: _jsx("div", { className: "h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 transition-all", style: { width: `${progressPct}%` } }) }), _jsxs("p", { className: "mt-2 text-xs text-slate-500 dark:text-slate-400", children: [earned, " of ", DEGREE_TOTAL, " credits earned \u00B7 ", inProgress, " in progress \u00B7 ", planned, " ", "planned"] }), bySemester.length > 0 && (_jsxs("div", { className: "mt-6", children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2", children: "Credits per semester" }), _jsx("div", { style: { width: "100%", height: 220 }, children: _jsx(ResponsiveContainer, { children: _jsxs(BarChart, { data: bySemester, children: [_jsx(XAxis, { dataKey: "semester", stroke: "#94a3b8", fontSize: 12 }), _jsx(YAxis, { stroke: "#94a3b8", fontSize: 12 }), _jsx(Tooltip, { contentStyle: {
                                                                background: "rgba(15,23,42,0.95)",
                                                                border: "1px solid rgba(255,255,255,0.1)",
                                                                borderRadius: 8,
                                                                color: "white",
                                                                fontSize: 12,
                                                            } }), _jsx(Bar, { dataKey: "complete", stackId: "a", fill: STATUS_COLORS.complete, radius: [0, 0, 0, 0] }), _jsx(Bar, { dataKey: "progress", stackId: "a", fill: STATUS_COLORS["in-progress"] }), _jsx(Bar, { dataKey: "planned", stackId: "a", fill: STATUS_COLORS.planned, radius: [6, 6, 0, 0] })] }) }) })] }))] }), _jsxs("div", { className: "card-surface rounded-2xl p-6 shadow-sm flex flex-col items-center", children: [_jsx("p", { className: "font-semibold self-start", children: "Credit breakdown" }), _jsxs("div", { style: { width: 240, height: 240 }, className: "relative", children: [_jsx(ResponsiveContainer, { children: _jsxs(PieChart, { children: [_jsx(Pie, { data: pieData.length ? pieData : [{ name: "No data", value: 1, color: "#e2e8f0" }], innerRadius: 70, outerRadius: 100, paddingAngle: 2, dataKey: "value", stroke: "none", children: (pieData.length ? pieData : [{ color: "#e2e8f0" }]).map((entry, i) => (_jsx(Cell, { fill: entry.color }, i))) }), _jsx(Tooltip, { formatter: (value, name) => [`${value} cr`, name], contentStyle: {
                                                            background: "rgba(15,23,42,0.95)",
                                                            border: "1px solid rgba(255,255,255,0.1)",
                                                            borderRadius: 8,
                                                            color: "white",
                                                            fontSize: 12,
                                                        } })] }) }), _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none", children: [_jsx("span", { className: "text-3xl font-extrabold", children: earned }), _jsx("span", { className: "text-xs text-slate-500 dark:text-slate-400", children: "earned cr" })] })] }), _jsxs("ul", { className: "mt-3 w-full space-y-1.5 text-xs", children: [pieData.map((d) => (_jsxs("li", { className: "flex items-center gap-2", children: [_jsx("span", { className: "inline-block w-2.5 h-2.5 rounded-sm", style: { background: d.color } }), _jsx("span", { className: "flex-1 text-slate-600 dark:text-slate-300", children: d.name }), _jsxs("span", { className: "font-semibold", children: [d.value, " cr"] })] }, d.name))), pieData.length === 0 && (_jsx("li", { className: "text-slate-500 italic", children: "No credits planned yet \u2014 open your roadmap to add courses." }))] })] })] }), _jsx("div", { className: "mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4", children: stats.map((s) => (_jsxs("div", { className: "card-surface rounded-2xl p-5 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: s.label }), _jsx(s.icon, { className: "h-4 w-4 text-blue-500" })] }), _jsxs("p", { className: "mt-2 text-2xl sm:text-3xl font-extrabold", children: [s.value, s.suffix && (_jsx("span", { className: "text-sm font-medium text-slate-500 dark:text-slate-400 ml-1", children: s.suffix }))] })] }, s.label))) }), _jsxs("div", { className: "mt-6 card-surface rounded-2xl p-6 shadow-sm", children: [_jsx("h2", { className: "text-lg font-bold mb-4", children: "Milestones" }), _jsx("ol", { className: "relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-5", children: milestonesPlan.map((m) => (_jsxs("li", { className: "ml-5", children: [_jsx("span", { className: `absolute -left-[11px] flex items-center justify-center w-5 h-5 rounded-full ${m.done
                                            ? "bg-emerald-500 text-white"
                                            : "bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600"}`, children: m.done ? (_jsx(CheckCircle2, { className: "h-4 w-4" })) : (_jsx(Circle, { className: "h-2.5 w-2.5 text-slate-400" })) }), _jsx("p", { className: "font-semibold", children: m.label }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: m.term })] }, m.label))) })] })] }) }));
};
export default JourneyDashboardPage;
