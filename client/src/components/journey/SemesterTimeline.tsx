import React from "react";
import type { Roadmap, Semester } from "../../types/roadmap";
import { Semester as SemesterConst } from "../../types/roadmap";

interface SemesterTimelineProps {
  roadmap: Roadmap;
}

export const SemesterTimeline: React.FC<SemesterTimelineProps> = ({ roadmap }) => {
  // Group nodes by semester
  const coursesBySemester: Record<string, typeof roadmap.nodes> = {};

  roadmap.nodes.forEach((node) => {
    if ((node.type === "course" || node.type === "elective") && node.data) {
      const data = node.data as any;
      const semester = data.semester || "Unknown";
      if (!coursesBySemester[semester]) {
        coursesBySemester[semester] = [];
      }
      coursesBySemester[semester].push(node);
    }
  });

  // Order semesters
  const semesterOrder = [SemesterConst.Fall, SemesterConst.Spring, SemesterConst.Summer];
  const semesters = Object.keys(coursesBySemester).sort(
    (a, b) => semesterOrder.indexOf(a as Semester) - semesterOrder.indexOf(b as Semester)
  );

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "in-progress":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "completed":
        return "✓ Done";
      case "in-progress":
        return "⟳ In Progress";
      default:
        return "○ Planned";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Semester Timeline</h3>

      {semesters.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No courses in this roadmap</p>
      ) : (
        <div className="space-y-8">
          {semesters.map((semester, index) => (
            <div key={semester}>
              <div className="flex items-center mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">{semester}</h4>
                  <p className="text-sm text-gray-600">
                    {coursesBySemester[semester].length} course(s)
                  </p>
                </div>
                {index < semesters.length - 1 && (
                  <div className="ml-4 h-12 border-l-2 border-gray-300 absolute"></div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {coursesBySemester[semester].map((node) => {
                  const data = node.data as any;
                  return (
                    <div
                      key={node.id}
                      className={`p-4 rounded-lg border-2 ${getStatusColor(data.status)}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold flex-1">{data.label}</h5>
                        <span className="text-xs font-medium">{data.credits} credits</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">{data.notes || "No notes"}</span>
                        <span className="text-xs font-semibold ml-2">
                          {getStatusBadge(data.status)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {index < semesters.length - 1 && (
                <div className="my-6 flex justify-center">
                  <div className="text-2xl text-gray-400">↓</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
