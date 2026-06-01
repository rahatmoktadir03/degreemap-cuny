import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  MessageSquarePlus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { listStudents, getStudentRoadmaps, type AdvisorStudentRow } from "../services/advisorService";
import type { StoredRoadmap } from "../services/roadmapStore";
import type { RoadmapNodeData } from "../data/roadmapTemplates";
import type { Node as RFNode } from "reactflow";

type StudentStatus = "on_track" | "at_risk" | "off_track" | "unknown";

interface Student {
  id: string;
  name: string;
  major: string;
  campus: string;
  gpa: number | null;
  credits: number | null;
  expectedGrad: string;
  status: StudentStatus;
}

const statusStyles: Record<StudentStatus, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
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
  unknown: {
    label: "No data",
    cls: "bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300 border-slate-200 dark:border-slate-600",
    Icon: HelpCircle,
  },
};

// Status derived from GPA — the only consistent signal available across students.
const deriveStatus = (gpa: number | null): StudentStatus => {
  if (gpa == null) return "unknown";
  if (gpa < 2.0) return "off_track";
  if (gpa < 2.5) return "at_risk";
  return "on_track";
};

const earnedCredits = (roadmaps: StoredRoadmap[]): number =>
  roadmaps.reduce(
    (acc, r) =>
      acc +
      (r.nodes ?? []).reduce(
        (a: number, n: RFNode<RoadmapNodeData>) =>
          n.data?.status === "complete" ? a + (n.data.credits ?? 0) : a,
        0
      ),
    0
  );

const fmt = (v: string | null | undefined) => (v && v.trim() ? v : "—");

interface Comment {
  id: string;
  body: string;
  createdAt: string;
}

const commentsKey = (studentId: string) => `degreemap.advisor.comments.${studentId}`;

const RosterView = ({
  students,
  loading,
  error,
}: {
  students: Student[];
  loading: boolean;
  error: boolean;
}) => {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          !query ||
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.major.toLowerCase().includes(query.toLowerCase()) ||
          s.campus.toLowerCase().includes(query.toLowerCase())
      ),
    [students, query]
  );

  return (
    <>
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

      <div className="mt-6 card-surface rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              aria-label="Search students"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, major, or campus"
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
                <th className="text-left font-semibold px-4 py-3">Campus</th>
                <th className="text-left font-semibold px-4 py-3">Credits</th>
                <th className="text-left font-semibold px-4 py-3">GPA</th>
                <th className="text-left font-semibold px-4 py-3">Status</th>
                <th className="px-4 py-3" />
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
                    <td className="px-4 py-3 font-semibold">
                      <Link to={`/advisor/${s.id}`} className="hover:text-blue-600 dark:hover:text-blue-300">
                        {s.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{s.major}</td>
                    <td className="px-4 py-3">{s.campus}</td>
                    <td className="px-4 py-3">{s.credits != null ? s.credits : "—"}</td>
                    <td className="px-4 py-3">{s.gpa != null ? s.gpa.toFixed(2) : "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.cls}`}
                      >
                        <meta.Icon className="h-3.5 w-3.5" /> {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/advisor/${s.id}`}
                        className="text-sm font-semibold text-blue-600 dark:text-blue-300 hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    {loading
                      ? "Loading students…"
                      : error
                        ? "Couldn't load students. You may need advisor access, or check your connection."
                        : query
                          ? "No students match that search."
                          : "No students yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const StudentDetailView = ({
  studentId,
  students,
  loading,
}: {
  studentId: string;
  students: Student[];
  loading: boolean;
}) => {
  const student = students.find((s) => s.id === studentId);
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(commentsKey(studentId));
      setComments(raw ? (JSON.parse(raw) as Comment[]) : []);
    } catch {
      setComments([]);
    }
  }, [studentId]);

  if (!student) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold">{loading ? "Loading…" : "Student not found"}</h1>
        <Link
          to="/advisor"
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to roster
        </Link>
      </div>
    );
  }

  const meta = statusStyles[student.status];

  const addComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    const next: Comment[] = [
      { id: Math.random().toString(36).slice(2, 9), body: body.trim(), createdAt: new Date().toISOString() },
      ...comments,
    ];
    setComments(next);
    try {
      localStorage.setItem(commentsKey(student.id), JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setBody("");
  };

  const removeComment = (id: string) => {
    const next = comments.filter((c) => c.id !== id);
    setComments(next);
    try {
      localStorage.setItem(commentsKey(student.id), JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  return (
    <div>
      <Link
        to="/advisor"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to roster
      </Link>

      <div className="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">{student.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {student.major} · {student.campus}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${meta.cls}`}
        >
          <meta.Icon className="h-3.5 w-3.5" /> {meta.label}
        </span>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card-surface rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-3">Snapshot</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Credits earned</dt>
              <dd className="text-2xl font-extrabold">
                {student.credits != null ? student.credits : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">GPA</dt>
              <dd className="text-2xl font-extrabold">
                {student.gpa != null ? student.gpa.toFixed(2) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Expected graduation</dt>
              <dd className="font-semibold">{student.expectedGrad}</dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Major</dt>
              <dd className="font-semibold">{student.major}</dd>
            </div>
          </dl>
        </div>

        <div className="card-surface rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-1 inline-flex items-center gap-1.5">
            <MessageSquarePlus className="h-4 w-4 text-blue-500" /> Comments
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Stored locally for this device.
          </p>
          <form onSubmit={addComment} className="mt-3 space-y-2">
            <textarea
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Leave a note for follow-up..."
              aria-label="New comment"
            />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
            >
              Post comment
            </button>
          </form>

          <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
            {comments.length === 0 && (
              <p className="text-xs italic text-slate-500 dark:text-slate-400">
                No comments yet.
              </p>
            )}
            {comments.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-slate-200 dark:border-slate-700 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm whitespace-pre-line">{c.body}</p>
                  <button
                    type="button"
                    aria-label="Delete comment"
                    onClick={() => removeComment(c.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-1 text-[10px] text-slate-400">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdvisorDashboardPage = () => {
  const { studentId } = useParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await listStudents();
        // Pull each student's earned credits from their roadmaps in parallel.
        const withCredits = await Promise.all(
          rows.map(async (r: AdvisorStudentRow) => {
            let credits: number | null = null;
            try {
              credits = earnedCredits(await getStudentRoadmaps(r.id));
            } catch {
              credits = null;
            }
            const student: Student = {
              id: r.id,
              name: fmt(r.name),
              major: fmt(r.major),
              campus: fmt(r.school),
              gpa: r.gpa ?? null,
              credits,
              expectedGrad: r.graduation_year ? String(r.graduation_year) : "—",
              status: deriveStatus(r.gpa ?? null),
            };
            return student;
          })
        );
        if (!cancelled) setStudents(withCredits);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-hero-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {studentId ? (
          <StudentDetailView studentId={studentId} students={students} loading={loading} />
        ) : (
          <RosterView students={students} loading={loading} error={error} />
        )}
      </div>
    </div>
  );
};

export default AdvisorDashboardPage;
