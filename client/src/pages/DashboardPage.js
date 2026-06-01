import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Calendar, Compass, GraduationCap, Plus, Save, Sparkles, Trash2, TrendingUp, } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { cunyCampuses } from "../data/cunyCampuses";
import * as roadmapService from "../services/roadmapService";
import { roadmapTemplates } from "../data/roadmapTemplates";
import toast from "react-hot-toast";
const DashboardPage = () => {
    const navigate = useNavigate();
    const { user, updateProfile } = useAuth();
    const name = (user?.email?.split("@")[0] ?? "student").replace(/\.|_/g, " ");
    const [roadmaps, setRoadmaps] = useState([]);
    const [school, setSchool] = useState(user?.user_metadata?.school ?? "");
    const [major, setMajor] = useState(user?.user_metadata?.major ?? "");
    const [savingProfile, setSavingProfile] = useState(false);
    const stats = useMemo(() => {
        const earned = roadmaps.reduce((acc, r) => acc +
            r.nodes
                .filter((n) => n.data.status === "complete")
                .reduce((a, n) => a + (n.data.credits ?? 0), 0), 0);
        const inProg = roadmaps.reduce((acc, r) => acc +
            r.nodes
                .filter((n) => n.data.status === "in-progress")
                .reduce((a, n) => a + (n.data.credits ?? 0), 0), 0);
        return [
            {
                label: "Credits earned",
                value: `${earned}`,
                trend: `+${inProg} in progress`,
                icon: GraduationCap,
            },
            { label: "Current GPA", value: "3.62", trend: "↑ from 3.55", icon: TrendingUp },
            {
                label: "Roadmaps",
                value: `${roadmaps.length}`,
                trend: roadmaps.length ? "Active plans" : "None yet",
                icon: BookOpen,
            },
            { label: "Next milestone", value: "60 cr", trend: "Junior status", icon: Sparkles },
        ];
    }, [roadmaps]);
    const handleRemove = async (id) => {
        try {
            if (roadmapService) {
                await roadmapService.deleteRoadmap?.(id);
            }
        }
        catch (err) {
            // ignore
        }
        const list = await roadmapService.listRoadmaps();
        setRoadmaps(list);
        toast.success("Roadmap removed");
    };
    // load roadmaps
    useEffect(() => {
        (async () => {
            const list = await roadmapService.listRoadmaps();
            setRoadmaps(list);
        })();
    }, []);
    const handleProfileSave = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            await updateProfile({ school, major });
            toast.success("Profile updated");
        }
        catch {
            toast.error("Could not update profile");
        }
        finally {
            setSavingProfile(false);
        }
    };
    return (_jsx("div", { className: "bg-hero-gradient", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-end md:justify-between gap-4 animate-fade-in-up", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300", children: "Dashboard" }), _jsxs("h1", { className: "mt-1 text-3xl sm:text-4xl font-extrabold", children: ["Welcome back, ", _jsx("span", { className: "text-gradient capitalize", children: name })] }), _jsx("p", { className: "mt-2 text-slate-600 dark:text-slate-400", children: school && major
                                        ? `${major} · ${school}`
                                        : "Add your school and major below to personalize your dashboard." })] }), _jsxs("button", { type: "button", onClick: () => navigate("/roadmap-builder"), className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-colors", children: [_jsx(Plus, { className: "h-4 w-4" }), " New roadmap"] })] }), _jsx("div", { className: "mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4", children: stats.map((s) => (_jsxs("div", { className: "card-surface rounded-2xl p-5 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: s.label }), _jsx(s.icon, { className: "h-4 w-4 text-blue-500" })] }), _jsx("p", { className: "mt-2 text-2xl sm:text-3xl font-extrabold", children: s.value }), _jsx("p", { className: "mt-1 text-xs text-emerald-600 dark:text-emerald-400", children: s.trend })] }, s.label))) }), _jsxs("div", { className: "mt-8 grid lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 card-surface rounded-2xl p-6 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-lg font-bold", children: "My roadmaps" }), _jsx(Link, { to: "/roadmap-builder", className: "text-sm font-semibold text-blue-600 dark:text-blue-300 hover:underline", children: "+ New" })] }), _jsxs("div", { className: "space-y-3", children: [roadmaps.length === 0 && (_jsxs("div", { className: "rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-6 text-center", children: [_jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: "You don't have any saved roadmaps yet." }), _jsxs("button", { type: "button", onClick: () => navigate("/roadmap-builder"), className: "mt-3 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold", children: [_jsx(Plus, { className: "h-4 w-4" }), " Start a roadmap"] })] })), roadmaps.map((r) => {
                                            const total = r.nodes.reduce((a, n) => a + (n.data.credits ?? 0), 0);
                                            const done = r.nodes
                                                .filter((n) => n.data.status === "complete")
                                                .reduce((a, n) => a + (n.data.credits ?? 0), 0);
                                            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                                            return (_jsxs("div", { className: "rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between hover:border-blue-400 transition-colors", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "font-semibold truncate", children: r.title }), _jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: ["Updated ", new Date(r.updatedAt).toLocaleDateString(), " \u00B7 ", done, "/", total, " cr"] }), _jsx("div", { className: "mt-2 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden max-w-xs", children: _jsx("div", { className: "h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500", style: { width: `${pct}%` } }) })] }), _jsxs("div", { className: "flex items-center gap-1 ml-3", children: [_jsx(Link, { to: `/roadmap/${r.id}`, className: "text-sm font-semibold text-blue-600 dark:text-blue-300 hover:underline px-2", children: "Open \u2192" }), _jsx("button", { type: "button", onClick: () => handleRemove(r.id), "aria-label": "Delete roadmap", className: "p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, r.id));
                                        })] }), _jsxs("div", { className: "mt-6", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2", children: "Start from a template" }), _jsx("div", { className: "grid sm:grid-cols-3 gap-2", children: roadmapTemplates.map((t) => (_jsxs(Link, { to: `/roadmap/${t.id}`, className: "rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 hover:border-blue-400 hover:shadow-sm transition", children: [_jsx("p", { className: "text-sm font-semibold", children: t.title }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: t.campus })] }, t.id))) })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("form", { onSubmit: handleProfileSave, className: "card-surface rounded-2xl p-6 shadow-sm", children: [_jsx("h2", { className: "text-lg font-bold", children: "Your profile" }), _jsxs("div", { className: "mt-3 space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400", children: "Home campus" }), _jsxs("select", { "aria-label": "Home campus", value: school, onChange: (e) => setSchool(e.target.value), children: [_jsx("option", { value: "", children: "\u2014 Select a campus \u2014" }), cunyCampuses.map((c) => (_jsx("option", { value: c.shortName, children: c.name }, c.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400", children: "Major / program" }), _jsx("input", { value: major, onChange: (e) => setMajor(e.target.value), placeholder: "e.g. BS Computer Science" })] }), _jsxs("button", { type: "submit", disabled: savingProfile, className: "w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-60", children: [_jsx(Save, { className: "h-3.5 w-3.5" }), " ", savingProfile ? "Saving..." : "Save profile"] })] })] }), _jsxs("div", { className: "card-surface rounded-2xl p-6 shadow-sm", children: [_jsx("h2", { className: "text-lg font-bold", children: "Quick links" }), _jsx("div", { className: "mt-4 space-y-2", children: [
                                                { label: "Explore campuses", icon: Compass, to: "/explore" },
                                                { label: "Track my journey", icon: Calendar, to: "/journey" },
                                                { label: "Advisor view", icon: GraduationCap, to: "/advisor" },
                                            ].map((l) => (_jsxs("button", { type: "button", onClick: () => navigate(l.to), className: "w-full inline-flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors", children: [_jsxs("span", { className: "inline-flex items-center gap-2 text-slate-700 dark:text-slate-200", children: [_jsx(l.icon, { className: "h-4 w-4 text-blue-500" }), " ", l.label] }), _jsx("span", { className: "text-slate-400", children: "\u2192" })] }, l.label))) })] })] })] })] }) }));
};
export default DashboardPage;
