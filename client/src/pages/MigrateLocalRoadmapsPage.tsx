import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../store/AuthContext";
import { apiFetch, apiEnabled } from "../services/apiClient";

const keyPrefix = "degreemap.roadmaps.item.";

type MigrationResult = { key: string; ok: boolean; detail: string };

const MigrateLocalRoadmapsPage: React.FC = () => {
  const { user, isDemoMode } = useAuth();
  const [keys, setKeys] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<MigrationResult[]>([]);

  useEffect(() => {
    const found = Object.keys(localStorage).filter((k) => k.startsWith(keyPrefix));
    setKeys(found);
  }, []);

  const doMigrate = async () => {
    if (!keys.length) return toast("No local roadmaps found");
    if (!apiEnabled) return toast.error("API not configured (VITE_API_URL)");

    if (!confirm(`Migrate ${keys.length} local roadmap(s) to server?`)) return;
    if (!user && !confirm("You are not signed in — migrate anonymously?")) return;

    setRunning(true);
    setResults([]);
    const collected: MigrationResult[] = [];
    for (const k of keys) {
      try {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
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
        collected.push({
          key: k,
          ok: true,
          detail: `Saved as ${created?.data?.id ?? "new roadmap"}`,
        });
        // Optionally remove local copy after success — keep it for safety.
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        collected.push({ key: k, ok: false, detail: msg });
      }
    }
    setRunning(false);
    setResults(collected);
    const ok = collected.filter((r) => r.ok).length;
    const failed = collected.length - ok;
    if (failed === 0) toast.success(`Migrated ${ok} roadmap(s)`);
    else toast.error(`Migrated ${ok}, ${failed} failed`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Migrate Local Roadmaps</h1>
      <p className="mb-4">
        This utility will copy roadmaps stored in your browser localStorage to the server.
      </p>

      <div className="mb-4">
        <strong>Detected local roadmap items:</strong> {keys.length}
      </div>

      <div className="space-x-2">
        <button
          type="button"
          onClick={doMigrate}
          disabled={running || !keys.length || !apiEnabled}
          className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60"
        >
          {running ? "Migrating…" : "Migrate to server now"}
        </button>
        {!apiEnabled && (
          <span className="text-sm text-amber-700 ml-3">VITE_API_URL is not configured.</span>
        )}
        {isDemoMode && (
          <div className="mt-3 text-sm text-slate-600">
            You are in demo mode; migrations will attach to local demo accounts.
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">
            Results — {results.filter((r) => r.ok).length} migrated, {results.filter((r) => !r.ok).length}{" "}
            failed
          </h2>
          <ul className="space-y-1 text-sm">
            {results.map((r) => (
              <li
                key={r.key}
                className={r.ok ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}
              >
                {r.ok ? "✓" : "✗"} {r.key.replace(keyPrefix, "")} — {r.detail}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <details>
          <summary className="cursor-pointer">How this works</summary>
          <div className="mt-2 text-sm text-slate-600">
            The page reads localStorage keys starting with <code>{keyPrefix}</code> and POSTs them
            to
            <code> /api/roadmaps</code>. The app will attach an Authorization token if you're signed
            in via Supabase.
          </div>
        </details>
      </div>
    </div>
  );
};

export default MigrateLocalRoadmapsPage;
