import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../store/AuthContext";
import { apiFetch, apiEnabled } from "../services/apiClient";
const keyPrefix = "degreemap.roadmaps.item.";
const MigrateLocalRoadmapsPage = () => {
    const { user, isDemoMode } = useAuth();
    const [keys, setKeys] = useState([]);
    const [running, setRunning] = useState(false);
    useEffect(() => {
        const found = Object.keys(localStorage).filter((k) => k.startsWith(keyPrefix));
        setKeys(found);
    }, []);
    const doMigrate = async () => {
        if (!keys.length)
            return toast.info("No local roadmaps found");
        if (!apiEnabled)
            return toast.error("API not configured (VITE_API_URL)");
        if (!confirm(`Migrate ${keys.length} local roadmap(s) to server?`))
            return;
        if (!user && !confirm("You are not signed in — migrate anonymously?"))
            return;
        setRunning(true);
        const results = [];
        for (const k of keys) {
            try {
                const raw = localStorage.getItem(k);
                if (!raw)
                    continue;
                const roadmap = JSON.parse(raw);
                // Use apiFetch so auth header is attached when available
                const created = await apiFetch(`/api/roadmaps`, {
                    method: "POST",
                    body: JSON.stringify({
                        title: roadmap.title,
                        nodes: roadmap.nodes,
                        edges: roadmap.edges,
                    }),
                });
                results.push({ key: k, status: `ok (${created?.data?.id ?? "?"})` });
                // Optionally remove local copy after success — keep it for safety.
            }
            catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                results.push({ key: k, status: `failed: ${msg}` });
            }
        }
        setRunning(false);
        console.table(results);
        toast.success("Migration finished — check console for details");
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6", children: [_jsx("h1", { className: "text-2xl font-semibold mb-4", children: "Migrate Local Roadmaps" }), _jsx("p", { className: "mb-4", children: "This utility will copy roadmaps stored in your browser localStorage to the server." }), _jsxs("div", { className: "mb-4", children: [_jsx("strong", { children: "Detected local roadmap items:" }), " ", keys.length] }), _jsxs("div", { className: "space-x-2", children: [_jsx("button", { onClick: doMigrate, disabled: running || !keys.length || !apiEnabled, className: "px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60", children: running ? "Migrating…" : "Migrate to server now" }), !apiEnabled && (_jsx("span", { className: "text-sm text-amber-700 ml-3", children: "VITE_API_URL is not configured." })), isDemoMode && (_jsx("div", { className: "mt-3 text-sm text-slate-600", children: "You are in demo mode; migrations will attach to local demo accounts." }))] }), _jsx("div", { className: "mt-6", children: _jsxs("details", { children: [_jsx("summary", { className: "cursor-pointer", children: "How this works" }), _jsxs("div", { className: "mt-2 text-sm text-slate-600", children: ["The page reads localStorage keys starting with ", _jsx("code", { children: keyPrefix }), " and POSTs them to", _jsx("code", { children: " /api/roadmaps" }), ". The app will attach an Authorization token if you're signed in via Supabase."] })] }) })] }));
};
export default MigrateLocalRoadmapsPage;
