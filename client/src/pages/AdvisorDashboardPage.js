import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, MessageSquarePlus, Search, Trash2, Users, } from "lucide-react";
import { advisorStudents, getStudentById, } from "../data/advisorStudents";
const statusStyles = {
    on_track: {
        label: "On track",
        cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
        Icon: CheckCircle2,
    },
    at_risk: {
        label: "At risk",
        cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
        Icon: AlertCircle,
    },
    off_track: {
        label: "Off track",
        cls: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300 border-red-200 dark:border-red-500/30",
        Icon: AlertCircle,
    },
};
const commentsKey = (studentId) => `degreemap.advisor.comments.${studentId}`;
const RosterView = () => {
    const [query, setQuery] = useState("");
    const filtered = useMemo(() => advisorStudents.filter((s) => !query ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.major.toLowerCase().includes(query.toLowerCase()) ||
        s.campus.toLowerCase().includes(query.toLowerCase())), [query]);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "animate-fade-in-up", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300", children: "Advisor" }), _jsxs("h1", { className: "mt-1 text-3xl sm:text-4xl font-extrabold", children: ["Manage your ", _jsx("span", { className: "text-gradient", children: "student roster" })] }), _jsx("p", { className: "mt-2 text-slate-600 dark:text-slate-400", children: "Track each student's progress and quickly find who needs your attention." })] }), _jsx("div", { className: "mt-8 grid grid-cols-3 gap-4", children: [
                    { label: "Students", value: advisorStudents.length, color: "text-blue-600 dark:text-blue-300" },
                    {
                        label: "At risk",
                        value: advisorStudents.filter((s) => s.status === "at_risk").length,
                        color: "text-amber-600 dark:text-amber-300",
                    },
                    {
                        label: "Off track",
                        value: advisorStudents.filter((s) => s.status === "off_track").length,
                        color: "text-red-600 dark:text-red-300",
                    },
                ].map((s) => (_jsxs("div", { className: "card-surface rounded-2xl p-5 shadow-sm", children: [_jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: s.label }), _jsx("p", { className: `mt-2 text-3xl font-extrabold ${s.color}`, children: s.value })] }, s.label))) }), _jsxs("div", { className: "mt-6 card-surface rounded-2xl shadow-sm overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3", children: [_jsxs("div", { className: "relative flex-1 max-w-md", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" }), _jsx("input", { "aria-label": "Search students", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search by name, major, or campus", className: "pl-9!" })] }), _jsxs("span", { className: "text-sm text-slate-500 dark:text-slate-400 inline-flex items-center gap-1", children: [_jsx(Users, { className: "h-4 w-4" }), " ", filtered.length, " students"] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left font-semibold px-4 py-3", children: "Student" }), _jsx("th", { className: "text-left font-semibold px-4 py-3", children: "Major" }), _jsx("th", { className: "text-left font-semibold px-4 py-3", children: "Campus" }), _jsx("th", { className: "text-left font-semibold px-4 py-3", children: "Credits" }), _jsx("th", { className: "text-left font-semibold px-4 py-3", children: "GPA" }), _jsx("th", { className: "text-left font-semibold px-4 py-3", children: "Status" }), _jsx("th", { className: "px-4 py-3" })] }) }), _jsxs("tbody", { children: [filtered.map((s) => {
                                            const meta = statusStyles[s.status];
                                            return (_jsxs("tr", { className: "border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40", children: [_jsx("td", { className: "px-4 py-3 font-semibold", children: _jsx(Link, { to: `/advisor/${s.id}`, className: "hover:text-blue-600 dark:hover:text-blue-300", children: s.name }) }), _jsx("td", { className: "px-4 py-3 text-slate-600 dark:text-slate-300", children: s.major }), _jsx("td", { className: "px-4 py-3", children: s.campus }), _jsx("td", { className: "px-4 py-3", children: s.credits }), _jsx("td", { className: "px-4 py-3", children: s.gpa.toFixed(2) }), _jsx("td", { className: "px-4 py-3", children: _jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.cls}`, children: [_jsx(meta.Icon, { className: "h-3.5 w-3.5" }), " ", meta.label] }) }), _jsx("td", { className: "px-4 py-3 text-right", children: _jsx(Link, { to: `/advisor/${s.id}`, className: "text-sm font-semibold text-blue-600 dark:text-blue-300 hover:underline", children: "View \u2192" }) })] }, s.id));
                                        }), filtered.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "px-4 py-8 text-center text-slate-500", children: "No students match that search." }) }))] })] }) })] })] }));
};
const StudentDetailView = ({ studentId }) => {
    const student = getStudentById(studentId);
    const [comments, setComments] = useState([]);
    const [body, setBody] = useState("");
    useEffect(() => {
        if (!student)
            return;
        try {
            const raw = localStorage.getItem(commentsKey(student.id));
            setComments(raw ? JSON.parse(raw) : []);
        }
        catch {
            setComments([]);
        }
    }, [student]);
    if (!student) {
        return (_jsxs("div", { className: "text-center py-16", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Student not found" }), _jsxs(Link, { to: "/advisor", className: "mt-4 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), " Back to roster"] })] }));
    }
    const meta = statusStyles[student.status];
    const addComment = (e) => {
        e.preventDefault();
        if (!body.trim())
            return;
        const next = [
            { id: Math.random().toString(36).slice(2, 9), body: body.trim(), createdAt: new Date().toISOString() },
            ...comments,
        ];
        setComments(next);
        try {
            localStorage.setItem(commentsKey(student.id), JSON.stringify(next));
        }
        catch {
            /* ignore */
        }
        setBody("");
    };
    const removeComment = (id) => {
        const next = comments.filter((c) => c.id !== id);
        setComments(next);
        try {
            localStorage.setItem(commentsKey(student.id), JSON.stringify(next));
        }
        catch {
            /* ignore */
        }
    };
    return (_jsxs("div", { children: [_jsxs(Link, { to: "/advisor", className: "inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), " Back to roster"] }), _jsxs("div", { className: "mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-3", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl sm:text-4xl font-extrabold", children: student.name }), _jsxs("p", { className: "text-slate-500 dark:text-slate-400 text-sm", children: [student.major, " \u00B7 ", student.campus, " \u00B7 ", student.email] })] }), _jsxs("span", { className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${meta.cls}`, children: [_jsx(meta.Icon, { className: "h-3.5 w-3.5" }), " ", meta.label] })] }), _jsxs("div", { className: "mt-6 grid lg:grid-cols-3 gap-5", children: [_jsxs("div", { className: "lg:col-span-2 card-surface rounded-2xl p-6 shadow-sm", children: [_jsx("h2", { className: "text-lg font-bold mb-3", children: "Snapshot" }), _jsxs("dl", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("dt", { className: "text-slate-500 dark:text-slate-400", children: "Credits earned" }), _jsx("dd", { className: "text-2xl font-extrabold", children: student.credits })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-slate-500 dark:text-slate-400", children: "GPA" }), _jsx("dd", { className: "text-2xl font-extrabold", children: student.gpa.toFixed(2) })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-slate-500 dark:text-slate-400", children: "Expected graduation" }), _jsx("dd", { className: "font-semibold", children: student.expectedGrad })] }), _jsxs("div", { children: [_jsx("dt", { className: "text-slate-500 dark:text-slate-400", children: "Major" }), _jsx("dd", { className: "font-semibold", children: student.major })] })] }), _jsxs("div", { className: "mt-5", children: [_jsx("p", { className: "text-sm font-semibold text-slate-500 dark:text-slate-400", children: "Advisor notes" }), _jsx("p", { className: "mt-1 text-sm", children: student.notes })] })] }), _jsxs("div", { className: "card-surface rounded-2xl p-6 shadow-sm", children: [_jsxs("h2", { className: "text-lg font-bold mb-1 inline-flex items-center gap-1.5", children: [_jsx(MessageSquarePlus, { className: "h-4 w-4 text-blue-500" }), " Comments"] }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Stored locally for this device." }), _jsxs("form", { onSubmit: addComment, className: "mt-3 space-y-2", children: [_jsx("textarea", { rows: 3, value: body, onChange: (e) => setBody(e.target.value), placeholder: "Leave a note for follow-up...", "aria-label": "New comment" }), _jsx("button", { type: "submit", className: "w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold", children: "Post comment" })] }), _jsxs("div", { className: "mt-4 space-y-3 max-h-72 overflow-y-auto pr-1", children: [comments.length === 0 && (_jsx("p", { className: "text-xs italic text-slate-500 dark:text-slate-400", children: "No comments yet." })), comments.map((c) => (_jsxs("div", { className: "rounded-lg border border-slate-200 dark:border-slate-700 p-3", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx("p", { className: "text-sm whitespace-pre-line", children: c.body }), _jsx("button", { type: "button", "aria-label": "Delete comment", onClick: () => removeComment(c.id), className: "p-1 rounded text-slate-400 hover:text-red-500", children: _jsx(Trash2, { className: "h-3.5 w-3.5" }) })] }), _jsx("p", { className: "mt-1 text-[10px] text-slate-400", children: new Date(c.createdAt).toLocaleString() })] }, c.id)))] })] })] })] }));
};
const AdvisorDashboardPage = () => {
    const { studentId } = useParams();
    return (_jsx("div", { className: "bg-hero-gradient", children: _jsx("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14", children: studentId ? _jsx(StudentDetailView, { studentId: studentId }) : _jsx(RosterView, {}) }) }));
};
export default AdvisorDashboardPage;
