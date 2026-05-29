import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Plus, X, GripVertical, Trash2, Save } from "lucide-react";
import toast from "react-hot-toast";
const seedSemesters = [
    {
        id: "s1",
        name: "Fall 2025",
        courses: [
            { id: "c1", code: "CSCI 127", title: "Intro to Computer Science", credits: 3 },
            { id: "c2", code: "MATH 150", title: "Calculus I", credits: 4 },
            { id: "c3", code: "ENG 120", title: "Expository Writing", credits: 3 },
        ],
    },
    {
        id: "s2",
        name: "Spring 2026",
        courses: [
            { id: "c4", code: "CSCI 135", title: "Software Design", credits: 3 },
            { id: "c5", code: "MATH 155", title: "Calculus II", credits: 4 },
        ],
    },
    {
        id: "s3",
        name: "Fall 2026",
        courses: [],
    },
];
const uid = () => Math.random().toString(36).slice(2, 9);
const RoadmapBuilderPage = () => {
    const [semesters, setSemesters] = useState(seedSemesters);
    const [newCourse, setNewCourse] = useState({});
    const totalCredits = useMemo(() => semesters.reduce((sum, s) => sum + s.courses.reduce((a, c) => a + c.credits, 0), 0), [semesters]);
    const addSemester = () => {
        setSemesters((prev) => [
            ...prev,
            { id: uid(), name: `Semester ${prev.length + 1}`, courses: [] },
        ]);
    };
    const removeSemester = (id) => setSemesters((prev) => prev.filter((s) => s.id !== id));
    const renameSemester = (id, name) => setSemesters((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
    const addCourse = (semId) => {
        const draft = newCourse[semId];
        if (!draft?.code?.trim() || !draft?.title?.trim()) {
            toast.error("Course code and title are required");
            return;
        }
        const credits = Number(draft.credits || 3);
        setSemesters((prev) => prev.map((s) => s.id === semId
            ? {
                ...s,
                courses: [
                    ...s.courses,
                    { id: uid(), code: draft.code.trim(), title: draft.title.trim(), credits },
                ],
            }
            : s));
        setNewCourse((prev) => ({ ...prev, [semId]: { code: "", title: "", credits: "3" } }));
    };
    const removeCourse = (semId, courseId) => setSemesters((prev) => prev.map((s) => s.id === semId ? { ...s, courses: s.courses.filter((c) => c.id !== courseId) } : s));
    const handleSave = () => {
        try {
            localStorage.setItem("degreemap.roadmap", JSON.stringify(semesters));
            toast.success("Roadmap saved");
        }
        catch {
            toast.error("Could not save");
        }
    };
    return (_jsx("div", { className: "bg-hero-gradient", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-end md:justify-between gap-4 animate-fade-in-up", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300", children: "Roadmap Builder" }), _jsxs("h1", { className: "mt-1 text-3xl sm:text-4xl font-extrabold", children: ["Build your ", _jsx("span", { className: "text-gradient", children: "degree path" })] }), _jsxs("p", { className: "mt-2 text-slate-600 dark:text-slate-400", children: ["Plan semester by semester. Total credits planned:", " ", _jsx("strong", { className: "text-slate-900 dark:text-white", children: totalCredits }), "."] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { type: "button", onClick: addSemester, className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-800 font-semibold transition-colors", children: [_jsx(Plus, { className: "h-4 w-4" }), " Add semester"] }), _jsxs("button", { type: "button", onClick: handleSave, className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-colors", children: [_jsx(Save, { className: "h-4 w-4" }), " Save"] })] })] }), _jsx("div", { className: "mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-5", children: semesters.map((sem) => {
                        const credits = sem.courses.reduce((a, c) => a + c.credits, 0);
                        const draft = newCourse[sem.id] ?? { code: "", title: "", credits: "3" };
                        return (_jsxs("div", { className: "card-surface rounded-2xl p-5 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("input", { "aria-label": "Semester name", placeholder: "Semester name", value: sem.name, onChange: (e) => renameSemester(sem.id, e.target.value), className: "font-bold text-lg border-transparent! bg-transparent! p-0! focus:shadow-none! focus:border-blue-500!" }), _jsx("button", { type: "button", onClick: () => removeSemester(sem.id), className: "p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors", "aria-label": "Remove semester", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }), _jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5", children: [sem.courses.length, " courses \u00B7 ", credits, " credits"] }), _jsxs("div", { className: "mt-4 space-y-2", children: [sem.courses.length === 0 && (_jsx("p", { className: "text-xs italic text-slate-400", children: "No courses yet." })), sem.courses.map((c) => (_jsxs("div", { className: "group flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2", children: [_jsx(GripVertical, { className: "h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" }), _jsx("div", { className: "flex-1 min-w-0", children: _jsxs("p", { className: "text-sm font-semibold truncate", children: [c.code, " ", _jsxs("span", { className: "text-slate-500 dark:text-slate-400 font-normal", children: ["\u00B7 ", c.title] })] }) }), _jsxs("span", { className: "text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0", children: [c.credits, " cr"] }), _jsx("button", { type: "button", onClick: () => removeCourse(sem.id, c.id), className: "opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-red-500 transition", "aria-label": "Remove course", children: _jsx(X, { className: "h-3.5 w-3.5" }) })] }, c.id)))] }), _jsxs("div", { className: "mt-4 grid grid-cols-12 gap-2", children: [_jsx("input", { value: draft.code, onChange: (e) => setNewCourse((prev) => ({
                                                ...prev,
                                                [sem.id]: { ...draft, code: e.target.value },
                                            })), placeholder: "CODE", className: "col-span-4 text-sm" }), _jsx("input", { value: draft.title, onChange: (e) => setNewCourse((prev) => ({
                                                ...prev,
                                                [sem.id]: { ...draft, title: e.target.value },
                                            })), placeholder: "Course title", className: "col-span-6 text-sm" }), _jsx("input", { value: draft.credits, onChange: (e) => setNewCourse((prev) => ({
                                                ...prev,
                                                [sem.id]: { ...draft, credits: e.target.value },
                                            })), placeholder: "cr", type: "number", min: 1, max: 6, className: "col-span-2 text-sm" }), _jsxs("button", { type: "button", onClick: () => addCourse(sem.id), className: "col-span-12 inline-flex items-center justify-center gap-1.5 mt-1 px-3 py-2 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors", children: [_jsx(Plus, { className: "h-3.5 w-3.5" }), " Add course"] })] })] }, sem.id));
                    }) })] }) }));
};
export default RoadmapBuilderPage;
