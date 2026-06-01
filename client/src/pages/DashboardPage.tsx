import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Compass,
  GraduationCap,
  Plus,
  Save,
  Sparkles,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { cunyCampuses } from "../data/cunyCampuses";
import * as roadmapService from "../services/roadmapService";
import { roadmapTemplates } from "../data/roadmapTemplates";
import toast from "react-hot-toast";
import type { StoredRoadmap } from "../services/roadmapStore";
import type { RoadmapNodeData } from "../data/roadmapTemplates";
import type { Node as RFNode } from "reactflow";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const name = (user?.email?.split("@")[0] ?? "student").replace(/\.|_/g, " ");

  const [roadmaps, setRoadmaps] = useState<StoredRoadmap[]>([]);
  const [school, setSchool] = useState((user?.user_metadata?.school as string) ?? "");
  const [major, setMajor] = useState((user?.user_metadata?.major as string) ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const stats = useMemo(() => {
    const earned = roadmaps.reduce(
      (acc, r: StoredRoadmap) =>
        acc +
        r.nodes
          .filter((n: RFNode<RoadmapNodeData>) => n.data.status === "complete")
          .reduce((a: number, n: RFNode<RoadmapNodeData>) => a + (n.data.credits ?? 0), 0),
      0
    );
    const inProg = roadmaps.reduce(
      (acc, r: StoredRoadmap) =>
        acc +
        r.nodes
          .filter((n: RFNode<RoadmapNodeData>) => n.data.status === "in-progress")
          .reduce((a: number, n: RFNode<RoadmapNodeData>) => a + (n.data.credits ?? 0), 0),
      0
    );
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

  const handleRemove = async (id: string) => {
    try {
      if (roadmapService) {
        await roadmapService.deleteRoadmap?.(id as string);
      }
    } catch (err) {
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

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({ school, major });
      toast.success("Profile updated");
    } catch {
      toast.error("Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="bg-hero-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 animate-fade-in-up">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
              Dashboard
            </p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold">
              Welcome back, <span className="text-gradient capitalize">{name}</span>
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {school && major
                ? `${major} · ${school}`
                : "Add your school and major below to personalize your dashboard."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/roadmap-builder")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-colors"
          >
            <Plus className="h-4 w-4" /> New roadmap
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card-surface rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">{s.label}</p>
                <s.icon className="h-4 w-4 text-blue-500" />
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold">{s.value}</p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">{s.trend}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          {/* Roadmaps */}
          <div className="lg:col-span-2 card-surface rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">My roadmaps</h2>
              <Link
                to="/roadmap-builder"
                className="text-sm font-semibold text-blue-600 dark:text-blue-300 hover:underline"
              >
                + New
              </Link>
            </div>

            <div className="space-y-3">
              {roadmaps.length === 0 && (
                <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-6 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    You don't have any saved roadmaps yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/roadmap-builder")}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
                  >
                    <Plus className="h-4 w-4" /> Start a roadmap
                  </button>
                </div>
              )}

              {roadmaps.map((r: StoredRoadmap) => {
                const total = r.nodes.reduce(
                  (a: number, n: RFNode<RoadmapNodeData>) => a + (n.data.credits ?? 0),
                  0
                );
                const done = r.nodes
                  .filter((n: RFNode<RoadmapNodeData>) => n.data.status === "complete")
                  .reduce((a: number, n: RFNode<RoadmapNodeData>) => a + (n.data.credits ?? 0), 0);
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div
                    key={r.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between hover:border-blue-400 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{r.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Updated {new Date(r.updatedAt).toLocaleDateString()} · {done}/{total} cr
                      </p>
                      <div className="mt-2 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden max-w-xs">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-3">
                      <Link
                        to={`/roadmap/${r.id}`}
                        className="text-sm font-semibold text-blue-600 dark:text-blue-300 hover:underline px-2"
                      >
                        Open →
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemove(r.id)}
                        aria-label="Delete roadmap"
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Templates */}
            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                Start from a template
              </p>
              <div className="grid sm:grid-cols-3 gap-2">
                {roadmapTemplates.map((t) => (
                  <Link
                    to={`/roadmap/${t.id}`}
                    key={t.id}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 hover:border-blue-400 hover:shadow-sm transition"
                  >
                    <p className="text-sm font-semibold">{t.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.campus}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Profile + quick links */}
          <div className="space-y-6">
            <form onSubmit={handleProfileSave} className="card-surface rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold">Your profile</h2>
              <div className="mt-3 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Home campus
                  </label>
                  <select
                    aria-label="Home campus"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                  >
                    <option value="">— Select a campus —</option>
                    {cunyCampuses.map((c) => (
                      <option key={c.id} value={c.shortName}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Major / program
                  </label>
                  <input
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="e.g. BS Computer Science"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-60"
                >
                  <Save className="h-3.5 w-3.5" /> {savingProfile ? "Saving..." : "Save profile"}
                </button>
              </div>
            </form>

            <div className="card-surface rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold">Quick links</h2>
              <div className="mt-4 space-y-2">
                {[
                  { label: "Explore campuses", icon: Compass, to: "/explore" },
                  { label: "Track my journey", icon: Calendar, to: "/journey" },
                  { label: "Advisor view", icon: GraduationCap, to: "/advisor" },
                ].map((l) => (
                  <button
                    key={l.label}
                    type="button"
                    onClick={() => navigate(l.to)}
                    className="w-full inline-flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
                  >
                    <span className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-200">
                      <l.icon className="h-4 w-4 text-blue-500" /> {l.label}
                    </span>
                    <span className="text-slate-400">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
