import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { DarkModeToggle } from "../components/DarkModeToggle";
import type { Roadmap } from "../types/roadmap";
import { roadmapService } from "../services/roadmapService";

export const AdvisorDashboardPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [studentRoadmaps, setStudentRoadmaps] = useState<Roadmap[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Load list of students (would come from backend endpoint)
  const loadStudents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/advisor/students`, {
        headers: {
          Authorization: `Bearer ${(await (await import("../services/supabase")).supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data.data || []);
      }
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  // Load student's roadmaps
  const loadStudentRoadmaps = async (studentId: string) => {
    try {
      setRoadmapLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/advisor/students/${studentId}/roadmaps`,
        {
          headers: {
            Authorization: `Bearer ${(await (await import("../services/supabase")).supabase.auth.getSession()).data.session?.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStudentRoadmaps(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedRoadmap(data.data[0]);
        }
      }
    } catch (error) {
      console.error("Error loading roadmaps:", error);
    } finally {
      setRoadmapLoading(false);
    }
  };

  const handleSelectStudent = (student: any) => {
    setSelectedStudent(student);
    loadStudentRoadmaps(student.id);
  };

  const handleAddComment = async () => {
    if (!selectedRoadmap || !selectedNodeId || !comment.trim()) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/advisor/roadmaps/${selectedRoadmap.id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(await (await import("../services/supabase")).supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({
            nodeId: selectedNodeId,
            comment: comment.trim(),
          }),
        }
      );

      if (response.ok) {
        setComment("");
        setSelectedNodeId(null);
        // Reload roadmap to show new comment
        if (selectedStudent) {
          loadStudentRoadmaps(selectedStudent.id);
        }
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading advisor dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              👨‍🎓 Advisor Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              View and comment on student roadmaps
            </p>
          </div>
          <div className="flex gap-2">
            <DarkModeToggle />
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm whitespace-nowrap"
            >
              ← Back
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Students List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Students</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {students.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No students assigned yet.</p>
              ) : (
                students.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => handleSelectStudent(student)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition ${
                      selectedStudent?.id === student.id
                        ? "border-sky-600 bg-sky-50 dark:bg-gray-700 dark:border-sky-500"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {student.email}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {student.roadsCount || 0} roadmaps
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {selectedStudent ? (
              <div className="space-y-6">
                {/* Roadmaps Selection */}
                {studentRoadmaps.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      Roadmaps
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {studentRoadmaps.map((roadmap) => (
                        <button
                          key={roadmap.id}
                          onClick={() => setSelectedRoadmap(roadmap)}
                          className={`p-3 rounded-lg border-2 transition text-left text-sm ${
                            selectedRoadmap?.id === roadmap.id
                              ? "border-sky-600 bg-sky-50 dark:bg-gray-700 dark:border-sky-500"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {roadmap.title}
                          </p>
                          {roadmap.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {roadmap.description}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Roadmap View */}
                {selectedRoadmap ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      {selectedRoadmap.title}
                    </h3>

                    {/* Courses List */}
                    <div className="space-y-3 mb-6">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Courses & Milestones
                      </p>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {selectedRoadmap.nodes
                          .filter((n) => ["course", "elective", "milestone"].includes(n.type))
                          .map((node) => (
                            <button
                              key={node.id}
                              onClick={() => setSelectedNodeId(node.id)}
                              className={`w-full text-left p-3 rounded-lg border-2 transition ${
                                selectedNodeId === node.id
                                  ? "border-sky-600 bg-sky-50 dark:bg-gray-700 dark:border-sky-500"
                                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                              }`}
                            >
                              <p className="font-medium text-gray-900 dark:text-white">
                                {node.data.label}
                              </p>
                              {(node.data as any).semester && (
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {(node.data as any).semester}
                                </p>
                              )}
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Comment Form */}
                    {selectedNodeId && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Add Comment
                        </h4>
                        <div className="space-y-3">
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Enter your feedback..."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white"
                            rows={3}
                            maxLength={500}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {comment.length}/500 characters
                          </p>
                          <button
                            onClick={handleAddComment}
                            disabled={!comment.trim()}
                            className="px-4 py-2 bg-sky-600 dark:bg-sky-700 text-white rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                          >
                            Post Comment
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                      {roadmapLoading
                        ? "Loading roadmaps..."
                        : "No roadmaps found for this student."}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Select a student to view their roadmaps
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
