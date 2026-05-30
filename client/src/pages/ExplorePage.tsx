import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, List, Map as MapIcon, MapPin, Search, Users, GraduationCap } from "lucide-react";
import { cunyCampuses, campusTypes, type Campus, type CampusType } from "../data/cunyCampuses";
import CampusMap from "../components/CampusMap";

const typeStyles: Record<CampusType, string> = {
  "Senior College":
    "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 border-blue-200 dark:border-blue-500/30",
  "Community College":
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
  "Graduate / Professional":
    "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 border-purple-200 dark:border-purple-500/30",
};

const ExplorePage = () => {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<CampusType | "All">("All");
  const [activeBorough, setActiveBorough] = useState<string>("All");
  const [view, setView] = useState<"grid" | "map">("grid");

  const boroughs = useMemo(
    () => ["All", ...Array.from(new Set(cunyCampuses.map((c) => c.borough)))],
    []
  );

  const filtered: Campus[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cunyCampuses.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.notablePrograms.some((p) => p.toLowerCase().includes(q));
      const matchesType = activeType === "All" || c.type === activeType;
      const matchesBorough = activeBorough === "All" || c.borough === activeBorough;
      return matchesQuery && matchesType && matchesBorough;
    });
  }, [query, activeType, activeBorough]);

  return (
    <div className="bg-hero-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-300">
            <GraduationCap className="h-3.5 w-3.5" /> 25 Campuses · 1 University
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold">
            Explore <span className="text-gradient">CUNY</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Browse every senior college, community college, and graduate school across the City
            University of New York — on a map or in a list.
          </p>
        </div>

        {/* Search + filters */}
        <div className="card-surface rounded-2xl p-4 sm:p-5 shadow-sm mb-6 animate-fade-in-up">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search campuses or programs (e.g. Nursing, Hunter, Brooklyn)"
                className="pl-9!"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["All", ...campusTypes] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    activeType === t
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {boroughs.map((b) => (
                <button
                  key={b}
                  onClick={() => setActiveBorough(b)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                    activeBorough === b
                      ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white"
                      : "bg-transparent text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold ${
                  view === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                <List className="h-3.5 w-3.5" /> Grid
              </button>
              <button
                onClick={() => setView("map")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border-l border-slate-200 dark:border-slate-700 ${
                  view === "map"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                <MapIcon className="h-3.5 w-3.5" /> Map
              </button>
            </div>
          </div>
        </div>

        {/* Results summary */}
        <div className="flex items-center justify-between mb-4 text-sm text-slate-600 dark:text-slate-400">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filtered.length}</strong> of{" "}
            {cunyCampuses.length} campuses
          </span>
        </div>

        {view === "map" ? (
          <CampusMap campuses={filtered} height="520px" />
        ) : filtered.length === 0 ? (
          <div className="card-surface rounded-2xl p-12 text-center">
            <p className="text-lg font-semibold">No campuses match your filters</p>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Try clearing the search or selecting a different type.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c) => (
              <Link
                to={`/schools/${c.id}`}
                key={c.id}
                className="group card-surface rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {c.shortName} · Founded {c.founded}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${typeStyles[c.type]}`}
                  >
                    {c.type === "Graduate / Professional" ? "Graduate" : c.type.split(" ")[0]}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                  {c.description}
                </p>

                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {c.borough}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {c.students} students
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.notablePrograms.slice(0, 3).map((p) => (
                    <span
                      key={p}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-300 inline-flex items-center gap-1">
                    View details →
                  </span>
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    Website <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
