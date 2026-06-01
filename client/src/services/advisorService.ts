import { apiFetch } from "./apiClient";
import type { StoredRoadmap } from "./roadmapStore";

// Raw profile row returned by GET /api/advisor/students.
export interface AdvisorStudentRow {
  id: string;
  name: string | null;
  school: string | null;
  major: string | null;
  graduation_year: number | null;
  gpa: number | null;
  role: string;
  updated_at: string;
}

export const listStudents = async (): Promise<AdvisorStudentRow[]> => {
  const res = await apiFetch("/api/advisor/students");
  return res?.data ?? [];
};

export const getStudentRoadmaps = async (studentId: string): Promise<StoredRoadmap[]> => {
  const res = await apiFetch(`/api/advisor/students/${encodeURIComponent(studentId)}/roadmaps`);
  return res?.data ?? [];
};
