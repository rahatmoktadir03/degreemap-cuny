import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Compass,
  Calendar,
  ArrowRight,
  Sparkles,
  Users,
  GraduationCap,
  CheckCircle2,
  Layers,
  Target,
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "CUNY Explorer",
    description:
      "Browse all 25 CUNY campuses with quick filters by borough, school type, and notable programs.",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    icon: Compass,
    title: "Roadmap Builder",
    description:
      "Drag-and-drop a visual, semester-by-semester degree plan with prerequisites tracked for you.",
    accent: "from-purple-500 to-pink-500",
  },
  {
    icon: Calendar,
    title: "My Journey",
    description:
      "Track credits earned, GPA, milestones, and graduation date with a clean progress dashboard.",
    accent: "from-emerald-500 to-teal-500",
  },
];

const benefits = [
  "Free to use for every CUNY student",
  "Works offline with a local demo mode",
  "Mobile-friendly, dark-mode-friendly",
  "Built with feedback from real students",
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 -z-10 opacity-40 dark:opacity-30 pointer-events-none">
          <div className="absolute -top-20 -left-16 w-72 h-72 rounded-full bg-blue-300/40 blur-3xl animate-float" />
          <div className="absolute top-32 -right-16 w-80 h-80 rounded-full bg-purple-300/40 blur-3xl animate-float" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs font-semibold tracking-wide uppercase text-blue-600 dark:text-blue-300 backdrop-blur animate-fade-in-up">
            <Sparkles className="h-3.5 w-3.5" /> Plan your future with confidence
          </span>

          <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight animate-fade-in-up">
            Map your CUNY <br className="hidden sm:block" />
            <span className="text-gradient">degree, visually.</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 animate-fade-in-up">
            DegreeMap helps CUNY students explore campuses, build degree roadmaps, and track every
            milestone — all in one beautiful place.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up">
            <button
              onClick={() => navigate("/register")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5"
            >
              Get started — it's free <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate("/explore")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60 backdrop-blur hover:bg-white dark:hover:bg-slate-800 font-semibold transition-colors"
            >
              <Compass className="h-4 w-4" /> Explore CUNY
            </button>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { value: "25", label: "CUNY Campuses" },
              { value: "100%", label: "Visual Planning" },
              { value: "1K+", label: "Students Helped" },
            ].map((s) => (
              <div
                key={s.label}
                className="card-surface rounded-2xl py-5 px-3 shadow-sm animate-fade-in-up"
              >
                <p className="text-3xl sm:text-4xl font-extrabold text-gradient">{s.value}</p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-24 bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold tracking-wide uppercase text-blue-600 dark:text-blue-400">
              Everything in one place
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold">
              The tools you actually need to graduate
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Built for the realities of CUNY: many campuses, transfer credits, and a path that
              rarely fits a four-year template.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="card-surface rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.accent} text-white flex items-center justify-center mb-4 shadow-md`}
                >
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold tracking-wide uppercase text-blue-600 dark:text-blue-400">
              How it works
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold">From confused to confident</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-lg">
              Three simple steps to a clear, achievable path to your CUNY degree.
            </p>

            <ol className="mt-8 space-y-5">
              {[
                {
                  icon: GraduationCap,
                  title: "Pick your campus",
                  body: "Browse 25 CUNY campuses with programs, majors, and key stats.",
                },
                {
                  icon: Layers,
                  title: "Plan your semesters",
                  body: "Drop courses into a visual roadmap and see prerequisites flow automatically.",
                },
                {
                  icon: Target,
                  title: "Track your progress",
                  body: "Watch credits, GPA, and milestones add up as you complete each term.",
                },
              ].map((step, idx) => (
                <li key={step.title} className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300 flex items-center justify-center">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      <span className="text-blue-600 dark:text-blue-400 mr-1">
                        {String(idx + 1).padStart(2, "0")}.
                      </span>
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="card-surface rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Sample roadmap
                </p>
                <h3 className="font-bold text-lg">BS Computer Science · Hunter</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                On track
              </span>
            </div>
            <div className="space-y-3">
              {[
                { term: "Fall 2024", courses: ["CSCI 127", "MATH 150", "ENG 120"], status: "done" },
                {
                  term: "Spring 2025",
                  courses: ["CSCI 135", "MATH 155", "PHYS 110"],
                  status: "done",
                },
                {
                  term: "Fall 2025",
                  courses: ["CSCI 235", "CSCI 260", "STAT 213"],
                  status: "current",
                },
                {
                  term: "Spring 2026",
                  courses: ["CSCI 335", "CSCI 340", "Elective"],
                  status: "future",
                },
              ].map((sem) => (
                <div
                  key={sem.term}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-semibold">{sem.term}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {sem.courses.join(" · ")}
                    </p>
                  </div>
                  {sem.status === "done" && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  )}
                  {sem.status === "current" && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                      Now
                    </span>
                  )}
                  {sem.status === "future" && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      Planned
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-10 sm:p-14 text-center text-white shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to build your degree?</h2>
          <p className="mt-3 text-blue-100 max-w-xl mx-auto">
            Join CUNY students planning their academic journey with visual roadmaps and campus
            insights.
          </p>
          <ul className="mt-6 grid sm:grid-cols-2 gap-y-2 gap-x-6 max-w-xl mx-auto text-left">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-blue-50">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" /> {b}
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate("/register")}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-colors"
          >
            <Users className="h-4 w-4" /> Start planning now <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-600 dark:text-blue-400">DegreeMap</span>
            <span>·</span>
            <span>Made for CUNY students</span>
          </div>
          <p>© {new Date().getFullYear()} DegreeMap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
