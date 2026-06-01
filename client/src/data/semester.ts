// Structured semester helpers. Roadmap nodes carry an optional `term` + `year`
// (the canonical, orderable representation) plus a `semester` display string
// kept for backward compatibility with roadmaps saved before this model existed.

export type Term = "Winter" | "Spring" | "Summer" | "Fall";

// Chronological rank within a year. Winter < Spring < Summer < Fall.
const TERM_RANK: Record<Term, number> = {
  Winter: 0,
  Spring: 1,
  Summer: 2,
  Fall: 3,
};

export const TERMS: Term[] = ["Winter", "Spring", "Summer", "Fall"];

// Sortable key — undated nodes sort last.
export const semesterOrder = (term?: Term, year?: number): number => {
  if (!term || !year) return Number.POSITIVE_INFINITY;
  return year * 4 + TERM_RANK[term];
};

// Human-readable label, e.g. "Fall 2025". Falls back to a legacy freeform
// string when structured fields are absent.
export const semesterLabel = (term?: Term, year?: number, fallback?: string): string => {
  if (term && year) return `${term} ${year}`;
  return fallback?.trim() ?? "";
};

// Best-effort parse of a legacy freeform semester string. Recognizes
// "Fall 2025" / "fall 2025"; anything else (e.g. "Junior", "Year 1") leaves
// the structured fields undefined so the label is preserved as-is.
export const parseLegacySemester = (s?: string): { term?: Term; year?: number } => {
  if (!s) return {};
  const m = s.trim().match(/^(winter|spring|summer|fall)\s+(\d{4})$/i);
  if (!m) return {};
  const term = ((m[1][0].toUpperCase() + m[1].slice(1).toLowerCase()) as Term);
  return { term, year: Number(m[2]) };
};
