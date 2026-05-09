import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { roadmapService } from "../services/roadmapService";
import type { Roadmap } from "../types/roadmap";
import { ProgressCard } from "../components/journey/ProgressCard";
import { CreditsTracker } from "../components/journey/CreditsTracker";
import { SemesterTimeline } from "../components/journey/SemesterTimeline";

export const JourneyDashboardPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    // Fetch user's roadmaps
    if (user?.id) {
      loadRoadmaps();
    }
  }, [user, loading, navigate]);

  const loadRoadmaps = async () => {
    try {
      setRoadmapLoading(true);
      const response = await roadmapService.getUserRoadmaps();
      if (response.success && response.data) {
        setRoadmaps(response.data);
        if (response.data.length > 0) {
          setSelectedRoadmap(response.data[0]);
        }
      }
    } catch (error) {
      console.error("Error loading roadmaps:", error);
    } finally {
      setRoadmapLoading(false);
    }
  };

  // Calculate progress stats
  const calculateProgress = (roadmap: Roadmap) => {
    const courseNodes = roadmap.nodes.filter((n) => n.type === "course" || n.type === "elective");
    const completedNodes = courseNodes.filter((n) => n.data.status === "completed");
    const inProgressNodes = courseNodes.filter((n) => n.data.status === "in-progress");

    const totalCredits = courseNodes.reduce((sum, node) => {
      const data = node.data as any;
      return sum + (data.credits || 0);
    }, 0);

    const completedCredits = completedNodes.reduce((sum, node) => {
      const data = node.data as any;
      return sum + (data.credits || 0);
    }, 0);

    const completionPercentage = courseNodes.length > 0 ? Math.round((completedNodes.length / courseNodes.length) * 100) : 0;

    return {
      totalNodes: courseNodes.length,
      completedNodes: completedNodes.length,
      inProgressNodes: inProgressNodes.length,
      plannedNodes: courseNodes.length - completedNodes.length - inProgressNodes.length,
      completionPercentage,
      totalCredits,
      completedCredits,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          <p className="mt-4 text-gray-600">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📅 My Journey</h1>
            <p className="text-gray-600 mt-1">Track your academic progress and roadmap completion</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Roadmap Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Roadmaps</h2>
          {roadmapLoading ? (
            <p className="text-gray-600">Loading roadmaps...</p>
          ) : roadmaps.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">No roadmaps created yet</p>
              <button
                onClick={() => navigate("/roadmap")}
                className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition font-medium"
              >
                Create Your First Roadmap
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-4">
              {roadmaps.map((roadmap) => {
                const progress = calculateProgress(roadmap);
                const isSelected = selectedRoadmap?.id === roadmap.id;
                return (
                  <button
                    key={roadmap.id}
                    onClick={() => setSelectedRoadmap(roadmap)}
                    className={`p-4 rounded-lg border-2 transition text-left ${
                      isSelected
                        ? "border-sky-600 bg-sky-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-sky-300 hover:shadow"
                    }`}
                  >
                    <h3 className="font-bold text-gray-900 text-sm mb-2">{roadmap.title}</h3>
                    <div className="space-y-1 text-xs">
                      <p className="text-gray-600">
                        {progress.completedNodes}/{progress.totalNodes} courses
                      </p>
                      <p className="text-gray-600">
                        {progress.completedCredits}/{progress.totalCredits} credits
                      </p>
                      <div className="w-full bg-gray-200 rounded h-2 mt-2">
                        <div
                          className="bg-green-500 h-2 rounded transition-all"
                          style={{ width: `${progress.completionPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-green-600 font-semibold">{progress.completionPercentage}%</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Progress Overview */}
        {selectedRoadmap && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedRoadmap.title}</h2>
              {selectedRoadmap.description && (
                <p className="text-gray-600 mb-4">{selectedRoadmap.description}</p>
              )}
            </div>

            {/* Progress Cards Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <ProgressCard
                label="Completed"
                value={calculateProgress(selectedRoadmap).completedNodes}
                total={calculateProgress(selectedRoadmap).totalNodes}
                color="emerald"
              />
              <ProgressCard
                label="In Progress"
                value={calculateProgress(selectedRoadmap).inProgressNodes}
                total={calculateProgress(selectedRoadmap).totalNodes}
                color="amber"
              />
              <ProgressCard
                label="Planned"
                value={calculateProgress(selectedRoadmap).plannedNodes}
                total={calculateProgress(selectedRoadmap).totalNodes}
                color="blue"
              />
              <ProgressCard
                label="Completion"
                value={calculateProgress(selectedRoadmap).completionPercentage}
                total={100}
                isPercentage={true}
                color="sky"
              />
            </div>

            {/* Credits Tracker */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <CreditsTracker
                completedCredits={calculateProgress(selectedRoadmap).completedCredits}
                totalCredits={calculateProgress(selectedRoadmap).totalCredits}
              />

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Courses</span>
                    <span className="font-semibold text-gray-900">{calculateProgress(selectedRoadmap).totalNodes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Credits</span>
                    <span className="font-semibold text-gray-900">{calculateProgress(selectedRoadmap).totalCredits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credits Earned</span>
                    <span className="font-semibold text-green-600">{calculateProgress(selectedRoadmap).completedCredits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credits Remaining</span>
                    <span className="font-semibold text-amber-600">
                      {calculateProgress(selectedRoadmap).totalCredits - calculateProgress(selectedRoadmap).completedCredits}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Semester Timeline */}
            <SemesterTimeline roadmap={selectedRoadmap} />

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate(`/roadmap?id=${selectedRoadmap.id}`)}
                  className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition font-medium"
                >
                  ✏️ Edit Roadmap
                </button>
                <button
                  onClick={() => navigate("/roadmap")}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  ➕ Create New Roadmap
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
