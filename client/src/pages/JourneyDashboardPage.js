import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Award, CheckCircle2, Circle, Flag, Target, TrendingUp } from "lucide-react";
const milestones = [
    { label: "Enrolled at CUNY", done: true, term: "Fall 2024" },
    { label: "Completed 30 credits (Sophomore)", done: true, term: "Spring 2025" },
    { label: "Declared major", done: true, term: "Spring 2025" },
    { label: "Completed 60 credits (Junior)", done: false, term: "Fall 2025" },
    { label: "Apply for internship", done: false, term: "Spring 2026" },
    { label: "Completed 90 credits (Senior)", done: false, term: "Spring 2027" },
    { label: "Graduate 🎓", done: false, term: "Spring 2028" },
];
const stats = [
    { label: "Credits earned", value: "42", suffix: "/ 120", icon: TrendingUp },
    { label: "Current GPA", value: "3.62", suffix: "", icon: Award },
    { label: "Major", value: "BS CS", suffix: "", icon: Target },
    { label: "Expected grad", value: "2028", suffix: "", icon: Flag },
];
const JourneyDashboardPage = () => {
    const progress = Math.round((42 / 120) * 100);
    return (_jsx("div", { className: "bg-hero-gradient", children: _jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14", children: [_jsxs("div", { className: "animate-fade-in-up", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300", children: "My Journey" }), _jsxs("h1", { className: "mt-1 text-3xl sm:text-4xl font-extrabold", children: ["Track your ", _jsx("span", { className: "text-gradient", children: "progress" })] }), _jsx("p", { className: "mt-2 text-slate-600 dark:text-slate-400", children: "See where you are, what's next, and how far you've come." })] }), _jsxs("div", { className: "mt-8 card-surface rounded-2xl p-6 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "font-semibold", children: "Degree progress" }), _jsxs("p", { className: "text-2xl font-extrabold text-gradient", children: [progress, "%"] })] }), _jsx("div", { className: "mt-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: _jsx("div", { className: "h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 transition-all", style: { width: `${progress}%` } }) }), _jsx("p", { className: "mt-2 text-xs text-slate-500 dark:text-slate-400", children: "42 of 120 credits completed" })] }), _jsx("div", { className: "mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4", children: stats.map((s) => (_jsxs("div", { className: "card-surface rounded-2xl p-5 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: s.label }), _jsx(s.icon, { className: "h-4 w-4 text-blue-500" })] }), _jsxs("p", { className: "mt-2 text-2xl sm:text-3xl font-extrabold", children: [s.value, s.suffix && (_jsx("span", { className: "text-sm font-medium text-slate-500 dark:text-slate-400 ml-1", children: s.suffix }))] })] }, s.label))) }), _jsxs("div", { className: "mt-6 card-surface rounded-2xl p-6 shadow-sm", children: [_jsx("h2", { className: "text-lg font-bold mb-4", children: "Milestones" }), _jsx("ol", { className: "relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-5", children: milestones.map((m) => (_jsxs("li", { className: "ml-5", children: [_jsx("span", { className: `absolute -left-[11px] flex items-center justify-center w-5 h-5 rounded-full ${m.done
                                            ? "bg-emerald-500 text-white"
                                            : "bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600"}`, children: m.done ? (_jsx(CheckCircle2, { className: "h-4 w-4" })) : (_jsx(Circle, { className: "h-2.5 w-2.5 text-slate-400" })) }), _jsx("p", { className: `font-semibold ${m.done ? "text-slate-700 dark:text-slate-200" : "text-slate-900 dark:text-white"}`, children: m.label }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: m.term })] }, m.label))) })] })] }) }));
};
export default JourneyDashboardPage;
