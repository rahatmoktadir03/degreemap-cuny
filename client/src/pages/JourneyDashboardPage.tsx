import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Award, CheckCircle2, Circle, Flag, GraduationCap, Target, TrendingUp } from "lucide-react";
import * as roadmapService from "../services/roadmapService";
import { useEffect, useState } from "react";
import type { StoredRoadmap } from "../services/roadmapStore";
import type { RoadmapNodeData } from "../data/roadmapTemplates";
import type { Node as RFNode } from "reactflow";
import type { RoadmapNodeStatus } from "../data/roadmapTemplates";
import { semesterOrder } from "../data/semester";
import { DEGREE_TOTAL, CREDIT_TIERS } from "../data/constants";
import { useAuth } from "../store/AuthContext";

const STATUS_COLORS: Record<RoadmapNodeStatus | "remaining", string> = {
  complete: "#10b981",
  "in-progress": "#3b82f6",
  planned: "#94a3b8",
  remaining: "#e2e8f0",
};

const JourneyDashboardPage = () => {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState<StoredRoadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const list = await roadmapService.listRoadmaps();
        setRoadmaps(list);
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const primary = roadmaps[0];

  const credits = useMemo(() => {
    const acc: Record<RoadmapNodeStatus, number> = { complete: 0, "in-progress": 0, planned: 0 };
    primary?.nodes.forEach((n: RFNode<RoadmapNodeData>) => {
      const c = n.data.credits ?? 0;
      if (!c) return;
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

  // Per-semester bar chart, ordered chronologically by term/year.
  const bySemester = useMemo(() => {
    const map = new Map<
      string,
      { semester: string; order: number; complete: number; progress: number; planned: number }
    >();
    primary?.nodes.forEach((n) => {
      const sem = n.data.semester;
      const c = n.data.credits ?? 0;
      if (!sem || !c) return;
      const row =
        map.get(sem) ??
        { semester: sem, order: semesterOrder(n.data.term, n.data.year), complete: 0, progress: 0, planned: 0 };
      if (n.data.status === "complete") row.complete += c;
      else if (n.data.status === "in-progress") row.progress += c;
      else row.planned += c;
      map.set(sem, row);
    });
    return Array.from(map.values()).sort((a, b) => a.order - b.order);
  }, [primary]);

  const gradYear = user?.user_metadata?.graduation_year as number | string | undefined;
  const major = user?.user_metadata?.major as string | undefined;

  const stats = [
    { label: "Credits earned", value: `${earned}`, suffix: `/ ${DEGREE_TOTAL}`, icon: TrendingUp },
    { label: "In progress", value: `${inProgress}`, suffix: "cr", icon: GraduationCap },
    { label: "Major", value: major || "—", suffix: "", icon: Target },
    { label: "Expected grad", value: gradYear ? `${gradYear}` : "—", suffix: "", icon: Flag },
  ];

  // Milestones derived from real progress against credit tiers.
  const milestones = [
    { label: "Enrolled at CUNY", done: roadmaps.length > 0 || earned > 0, hint: "Getting started" },
    ...CREDIT_TIERS.map((tier) => ({
      label: tier === DEGREE_TOTAL ? "Graduate 🎓" : `Complete ${tier} credits`,
      done: earned >= tier,
      hint: `${Math.min(earned, tier)} / ${tier} cr`,
    })),
  ];

  return (
    <div className="bg-hero-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="animate-fade-in-up flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
              My Journey
            </p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold">
              Track your <span className="text-gradient">progress</span>
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {loadError
                ? "Couldn't load your roadmaps — showing what we have. Check your connection and refresh."
                : loading
                  ? "Loading your roadmaps…"
                  : "Live numbers from your active roadmap."}
            </p>
          </div>
          {primary && (
            <Link
              to={`/roadmap/${primary.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-800 text-sm font-semibold"
            >
              <Award className="h-4 w-4" /> Open active roadmap
            </Link>
          )}
        </div>

        {/* Progress + ring */}
        <div className="mt-8 grid lg:grid-cols-[1.3fr_1fr] gap-5">
          <div className="card-surface rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Degree progress</p>
              <p className="text-2xl font-extrabold text-gradient">{progressPct}%</p>
            </div>
            <div className="mt-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {earned} of {DEGREE_TOTAL} credits earned · {inProgress} in progress · {planned}{" "}
              planned
            </p>

            {bySemester.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                  Credits per semester
                </p>
                <div style={{ width: "100%", height: 220 }}>
                  <ResponsiveContainer>
                    <BarChart data={bySemester}>
                      <XAxis dataKey="semester" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(15,23,42,0.95)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 8,
                          color: "white",
                          fontSize: 12,
                        }}
                      />
                      <Bar
                        dataKey="complete"
                        stackId="a"
                        fill={STATUS_COLORS.complete}
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar dataKey="progress" stackId="a" fill={STATUS_COLORS["in-progress"]} />
                      <Bar
                        dataKey="planned"
                        stackId="a"
                        fill={STATUS_COLORS.planned}
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          <div className="card-surface rounded-2xl p-6 shadow-sm flex flex-col items-center">
            <p className="font-semibold self-start">Credit breakdown</p>
            <div style={{ width: 240, height: 240 }} className="relative">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={
                      pieData.length ? pieData : [{ name: "No data", value: 1, color: "#e2e8f0" }]
                    }
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {(pieData.length ? pieData : [{ color: "#e2e8f0" }]).map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value} cr`, name]}
                    contentStyle={{
                      background: "rgba(15,23,42,0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      color: "white",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold">{earned}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">earned cr</span>
              </div>
            </div>
            <ul className="mt-3 w-full space-y-1.5 text-xs">
              {pieData.map((d) => (
                <li key={d.name} className="flex items-center gap-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm"
                    style={{ background: d.color }}
                  />
                  <span className="flex-1 text-slate-600 dark:text-slate-300">{d.name}</span>
                  <span className="font-semibold">{d.value} cr</span>
                </li>
              ))}
              {pieData.length === 0 && (
                <li className="text-slate-500 italic">
                  No credits planned yet — open your roadmap to add courses.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card-surface rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">{s.label}</p>
                <s.icon className="h-4 w-4 text-blue-500" />
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold">
                {s.value}
                {s.suffix && (
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">
                    {s.suffix}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Milestones */}
        <div className="mt-6 card-surface rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Milestones</h2>
          <ol className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-5">
            {milestones.map((m) => (
              <li key={m.label} className="ml-5">
                <span
                  className={`absolute -left-[11px] flex items-center justify-center w-5 h-5 rounded-full ${
                    m.done
                      ? "bg-emerald-500 text-white"
                      : "bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600"
                  }`}
                >
                  {m.done ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Circle className="h-2.5 w-2.5 text-slate-400" />
                  )}
                </span>
                <p className="font-semibold">{m.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{m.hint}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default JourneyDashboardPage;
