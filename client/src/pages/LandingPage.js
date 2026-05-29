import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { MapPin, Compass, Calendar, ArrowRight, Sparkles, Users, GraduationCap, CheckCircle2, Layers, Target, } from "lucide-react";
const features = [
    {
        icon: MapPin,
        title: "CUNY Explorer",
        description: "Browse all 25 CUNY campuses with quick filters by borough, school type, and notable programs.",
        accent: "from-blue-500 to-cyan-500",
    },
    {
        icon: Compass,
        title: "Roadmap Builder",
        description: "Drag-and-drop a visual, semester-by-semester degree plan with prerequisites tracked for you.",
        accent: "from-purple-500 to-pink-500",
    },
    {
        icon: Calendar,
        title: "My Journey",
        description: "Track credits earned, GPA, milestones, and graduation date with a clean progress dashboard.",
        accent: "from-emerald-500 to-teal-500",
    },
];
const benefits = [
    "Free to use for every CUNY student",
    "Works offline with a local demo mode",
    "Mobile-friendly, dark-mode-friendly",
    "Built with feedback from real students",
];
const LandingPage = () => {
    const navigate = useNavigate();
    return (_jsxs("div", { children: [_jsxs("section", { className: "relative overflow-hidden bg-hero-gradient", children: [_jsxs("div", { className: "absolute inset-0 -z-10 opacity-40 dark:opacity-30 pointer-events-none", children: [_jsx("div", { className: "absolute -top-20 -left-16 w-72 h-72 rounded-full bg-blue-300/40 blur-3xl animate-float" }), _jsx("div", { className: "absolute top-32 -right-16 w-80 h-80 rounded-full bg-purple-300/40 blur-3xl animate-float" })] }), _jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center", children: [_jsxs("span", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-semibold tracking-wide uppercase text-blue-600 dark:text-blue-300 backdrop-blur animate-fade-in-up", children: [_jsx(Sparkles, { className: "h-3.5 w-3.5" }), " Plan your future with confidence"] }), _jsxs("h1", { className: "mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight animate-fade-in-up", children: ["Map your CUNY ", _jsx("br", { className: "hidden sm:block" }), _jsx("span", { className: "text-gradient", children: "degree, visually." })] }), _jsx("p", { className: "mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 animate-fade-in-up", children: "DegreeMap helps CUNY students explore campuses, build degree roadmaps, and track every milestone \u2014 all in one beautiful place." }), _jsxs("div", { className: "mt-8 flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up", children: [_jsxs("button", { onClick: () => navigate("/register"), className: "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5", children: ["Get started \u2014 it's free ", _jsx(ArrowRight, { className: "h-4 w-4" })] }), _jsxs("button", { onClick: () => navigate("/explore"), className: "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60 backdrop-blur hover:bg-white dark:hover:bg-slate-800 font-semibold transition-colors", children: [_jsx(Compass, { className: "h-4 w-4" }), " Explore CUNY"] })] }), _jsx("div", { className: "mt-14 grid grid-cols-3 gap-6 max-w-3xl mx-auto", children: [
                                    { value: "25", label: "CUNY Campuses" },
                                    { value: "100%", label: "Visual Planning" },
                                    { value: "1K+", label: "Students Helped" },
                                ].map((s) => (_jsxs("div", { className: "card-surface rounded-2xl py-5 px-3 shadow-sm animate-fade-in-up", children: [_jsx("p", { className: "text-3xl sm:text-4xl font-extrabold text-gradient", children: s.value }), _jsx("p", { className: "text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1", children: s.label })] }, s.label))) })] })] }), _jsx("section", { className: "py-20 sm:py-24 bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center max-w-2xl mx-auto", children: [_jsx("p", { className: "text-sm font-semibold tracking-wide uppercase text-blue-600 dark:text-blue-400", children: "Everything in one place" }), _jsx("h2", { className: "mt-2 text-3xl sm:text-4xl font-bold", children: "The tools you actually need to graduate" }), _jsx("p", { className: "mt-3 text-slate-600 dark:text-slate-400", children: "Built for the realities of CUNY: many campuses, transfer credits, and a path that rarely fits a four-year template." })] }), _jsx("div", { className: "mt-12 grid grid-cols-1 md:grid-cols-3 gap-6", children: features.map((f) => (_jsxs("div", { className: "card-surface rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all", children: [_jsx("div", { className: `w-12 h-12 rounded-xl bg-gradient-to-br ${f.accent} text-white flex items-center justify-center mb-4 shadow-md`, children: _jsx(f.icon, { className: "h-6 w-6" }) }), _jsx("h3", { className: "text-lg font-bold", children: f.title }), _jsx("p", { className: "mt-2 text-sm text-slate-600 dark:text-slate-300", children: f.description })] }, f.title))) })] }) }), _jsx("section", { className: "py-20 sm:py-24", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold tracking-wide uppercase text-blue-600 dark:text-blue-400", children: "How it works" }), _jsx("h2", { className: "mt-2 text-3xl sm:text-4xl font-bold", children: "From confused to confident" }), _jsx("p", { className: "mt-3 text-slate-600 dark:text-slate-400 max-w-lg", children: "Three simple steps to a clear, achievable path to your CUNY degree." }), _jsx("ol", { className: "mt-8 space-y-5", children: [
                                        {
                                            icon: GraduationCap,
                                            title: "Pick your campus",
                                            body: "Browse 25 CUNY campuses with programs, majors, and key stats.",
                                        },
                                        {
                                            icon: Layers,
                                            title: "Plan your semesters",
                                            body: "Drop courses into a visual roadmap and see prerequisites flow automatically.",
                                        },
                                        {
                                            icon: Target,
                                            title: "Track your progress",
                                            body: "Watch credits, GPA, and milestones add up as you complete each term.",
                                        },
                                    ].map((step, idx) => (_jsxs("li", { className: "flex gap-4", children: [_jsx("div", { className: "shrink-0 w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300 flex items-center justify-center", children: _jsx(step.icon, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsxs("h3", { className: "font-semibold", children: [_jsxs("span", { className: "text-blue-600 dark:text-blue-400 mr-1", children: [String(idx + 1).padStart(2, "0"), "."] }), step.title] }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400 mt-1", children: step.body })] })] }, step.title))) })] }), _jsxs("div", { className: "card-surface rounded-3xl p-6 sm:p-8 shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-5", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400", children: "Sample roadmap" }), _jsx("h3", { className: "font-bold text-lg", children: "BS Computer Science \u00B7 Hunter" })] }), _jsx("span", { className: "text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300", children: "On track" })] }), _jsx("div", { className: "space-y-3", children: [
                                        { term: "Fall 2024", courses: ["CSCI 127", "MATH 150", "ENG 120"], status: "done" },
                                        {
                                            term: "Spring 2025",
                                            courses: ["CSCI 135", "MATH 155", "PHYS 110"],
                                            status: "done",
                                        },
                                        {
                                            term: "Fall 2025",
                                            courses: ["CSCI 235", "CSCI 260", "STAT 213"],
                                            status: "current",
                                        },
                                        {
                                            term: "Spring 2026",
                                            courses: ["CSCI 335", "CSCI 340", "Elective"],
                                            status: "future",
                                        },
                                    ].map((sem) => (_jsxs("div", { className: "rounded-xl border border-slate-200 dark:border-slate-700 p-3 flex items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold", children: sem.term }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: sem.courses.join(" · ") })] }), sem.status === "done" && (_jsx(CheckCircle2, { className: "h-5 w-5 text-emerald-500" })), sem.status === "current" && (_jsx("span", { className: "text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300", children: "Now" })), sem.status === "future" && (_jsx("span", { className: "text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300", children: "Planned" }))] }, sem.term))) })] })] }) }), _jsx("section", { className: "py-20 px-4", children: _jsxs("div", { className: "max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-10 sm:p-14 text-center text-white shadow-2xl", children: [_jsx("h2", { className: "text-3xl sm:text-4xl font-bold", children: "Ready to build your degree?" }), _jsx("p", { className: "mt-3 text-blue-100 max-w-xl mx-auto", children: "Join CUNY students planning their academic journey with visual roadmaps and campus insights." }), _jsx("ul", { className: "mt-6 grid sm:grid-cols-2 gap-y-2 gap-x-6 max-w-xl mx-auto text-left", children: benefits.map((b) => (_jsxs("li", { className: "flex items-center gap-2 text-sm text-blue-50", children: [_jsx(CheckCircle2, { className: "h-4 w-4 text-emerald-300" }), " ", b] }, b))) }), _jsxs("button", { onClick: () => navigate("/register"), className: "mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-colors", children: [_jsx(Users, { className: "h-4 w-4" }), " Start planning now ", _jsx(ArrowRight, { className: "h-4 w-4" })] })] }) }), _jsx("footer", { className: "border-t border-slate-200 dark:border-slate-800 py-10 px-4", children: _jsxs("div", { className: "max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-bold text-blue-600 dark:text-blue-400", children: "DegreeMap" }), _jsx("span", { children: "\u00B7" }), _jsx("span", { children: "Made for CUNY students" })] }), _jsxs("p", { children: ["\u00A9 ", new Date().getFullYear(), " DegreeMap. All rights reserved."] })] }) })] }));
};
export default LandingPage;
