import { useState } from "react";
import { Search, Users, AlertCircle, CheckCircle2 } from "lucide-react";

type Status = "on_track" | "at_risk" | "off_track";

interface Student {
  id: string;
  name: string;
  major: string;
  credits: number;
  gpa: number;
  status: Status;
}

const students: Student[] = [
  { id: "1", name: "Aisha Patel", major: "BS Computer Science", credits: 78, gpa: 3.71, status: "on_track" },
  { id: "2", name: "Marcus Chen", major: "BA Economics", credits: 42, gpa: 3.42, status: "on_track" },
  { id: "3", name: "Sofia Ramirez", major: "BS Nursing", credits: 22, gpa: 2.65, status: "at_risk" },
  { id: "4", name: "Jordan Williams", major: "BA Political Science", credits: 95, gpa: 3.88, status: "on_track" },
  { id: "5", name: "Priya Singh", major: "BS Biology", credits: 8, gpa: 1.92, status: "off_track" },
  { id: "6", name: "Diego Alvarez", major: "BA English", credits: 60, gpa: 3.15, status: "on_track" },
];

const statusStyles: Record<Status, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
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

const AdvisorDashboardPage = () => {
  const [query, setQuery] = useState("");
  const filtered = students.filter(
    (s) =>
      !query ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.major.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-hero-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="animate-fade-in-up">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
            Advisor
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold">
            Manage your <span className="text-gradient">student roster</span>
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Track each student's progress and quickly find who needs your attention.
          </p>
        </div>

        {/* Summary */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { label: "Students", value: students.length, color: "text-blue-600 dark:text-blue-300" },
            {
              label: "At risk",
              value: students.filter((s) => s.status === "at_risk").length,
              color: "text-amber-600 dark:text-amber-300",
            },
            {
              label: "Off track",
              value: students.filter((s) => s.status === "off_track").length,
              color: "text-red-600 dark:text-red-300",
            },
          ].map((s) => (
            <div key={s.label} className="card-surface rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-600 dark:text-slate-400">{s.label}</p>
              <p className={`mt-2 text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search + table */}
        <div className="mt-6 card-surface rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                aria-label="Search students"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or major"
                className="pl-9!"
              />
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
              <Users className="h-4 w-4" /> {filtered.length} students
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">Student</th>
                  <th className="text-left font-semibold px-4 py-3">Major</th>
                  <th className="text-left font-semibold px-4 py-3">Credits</th>
                  <th className="text-left font-semibold px-4 py-3">GPA</th>
                  <th className="text-left font-semibold px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const meta = statusStyles[s.status];
                  return (
                    <tr
                      key={s.id}
                      className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-4 py-3 font-semibold">{s.name}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{s.major}</td>
                      <td className="px-4 py-3">{s.credits}</td>
                      <td className="px-4 py-3">{s.gpa.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.cls}`}
                        >
                          <meta.Icon className="h-3.5 w-3.5" /> {meta.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      No students match that search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorDashboardPage;
