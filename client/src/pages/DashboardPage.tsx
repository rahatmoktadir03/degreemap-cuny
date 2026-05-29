import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Compass,
  GraduationCap,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../store/AuthContext";

const stats = [
  { label: "Credits earned", value: "42", trend: "+6 this term", icon: GraduationCap },
  { label: "Current GPA", value: "3.62", trend: "↑ from 3.55", icon: TrendingUp },
  { label: "Roadmaps", value: "1", trend: "Active plan", icon: BookOpen },
  { label: "Next milestone", value: "60 cr", trend: "Junior status", icon: Sparkles },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const name = (user?.email?.split("@")[0] ?? "student").replace(/\.|_/g, " ");

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
              Here's a snapshot of your CUNY journey.
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

        {/* Stats grid */}
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

        {/* Content grid */}
        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          {/* Roadmaps */}
          <div className="lg:col-span-2 card-surface rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">My roadmaps</h2>
              <button
                type="button"
                onClick={() => navigate("/roadmap-builder")}
                className="text-sm font-semibold text-blue-600 dark:text-blue-300 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between hover:border-blue-400 transition-colors">
                <div>
                  <p className="font-semibold">BS Computer Science · Hunter</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Fall 2025 · 42/120 credits
                  </p>
                  <div className="mt-2 h-1.5 w-56 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: "35%" }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/roadmap-builder")}
                  className="text-sm font-semibold text-blue-600 dark:text-blue-300 hover:underline"
                >
                  Open →
                </button>
              </div>

              <button
                type="button"
                onClick={() => navigate("/roadmap-builder")}
                className="w-full rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-4 text-sm text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
              >
                + Create a new roadmap
              </button>
            </div>
          </div>

          {/* Quick links */}
          <div className="card-surface rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold">Quick links</h2>
            <div className="mt-4 space-y-2">
              {[
                { label: "Explore campuses", icon: Compass, to: "/explore" },
                { label: "Track my journey", icon: Calendar, to: "/journey" },
                { label: "Build a roadmap", icon: BookOpen, to: "/roadmap-builder" },
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
  );
};

export default DashboardPage;
