import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { ShareButton } from "../components/ShareButton";
import { PageTransition, StaggerContainer, StaggerItem } from "../components/ui";
import { useToast } from "../hooks/useToast";
import { roadmapService } from "../services/roadmapService";
import type { Roadmap } from "../types/roadmap";
import { ProgressCard } from "../components/journey/ProgressCard";
import { CreditsTracker } from "../components/journey/CreditsTracker";
import { SemesterTimeline } from "../components/journey/SemesterTimeline";

export const JourneyDashboardPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
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
        toast.success(`Loaded ${response.data.length} roadmap(s)`);
      } else {
        toast.info("No roadmaps found");
      }
    } catch (error) {
      console.error("Error loading roadmaps:", error);
      toast.error("Failed to load roadmaps. Please try again.");
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

    const completionPercentage =
      courseNodes.length > 0 ? Math.round((completedNodes.length / courseNodes.length) * 100) : 0;

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
      <div className="flex items-center justify-center h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 dark:border-primary-800 dark:border-t-primary-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
            Loading your journey...
          </p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <StaggerContainer delayChildren={0.1}>
            {/* Roadmap Selection */}
            <StaggerItem>
              <div className="mb-8">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Your Roadmaps
                </h2>
                {roadmapLoading ? (
                  <p className="text-gray-600 dark:text-gray-400">Loading roadmaps...</p>
                ) : roadmaps.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sm:p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No roadmaps created yet</p>
                    <button
                      onClick={() => navigate("/roadmap")}
                      className="px-6 py-2 bg-sky-600 dark:bg-sky-700 text-white rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition font-medium"
                    >
                      Create Your First Roadmap
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {roadmaps.map((roadmap) => {
                      const progress = calculateProgress(roadmap);
                      const isSelected = selectedRoadmap?.id === roadmap.id;
                      return (
                        <button
                          key={roadmap.id}
                          onClick={() => setSelectedRoadmap(roadmap)}
                          className={`p-4 rounded-lg border-2 transition text-left ${
                            isSelected
                              ? "border-sky-600 bg-sky-50 dark:bg-gray-800 dark:border-sky-500 shadow-md"
                              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow"
                          }`}
                        >
                          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2 truncate">
                            {roadmap.title}
                          </h3>
                          <div className="space-y-1 text-xs">
                            <p className="text-gray-600 dark:text-gray-400">
                              {progress.completedNodes}/{progress.totalNodes} courses
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {progress.completedCredits}/{progress.totalCredits} credits
                            </p>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded h-2 mt-2">
                              {/* @ts-ignore - Dynamic width from state */}
                              <div
                                className="bg-green-500 h-2 rounded transition-all progress-bar"
                                style={
                                  {
                                    "--progress-width": `${progress.completionPercentage}%`,
                                  } as React.CSSProperties
                                }
                              ></div>
                            </div>
                            <p className="text-green-600 font-semibold">
                              {progress.completionPercentage}%
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </StaggerItem>

            {/* Progress Overview */}
            {selectedRoadmap && (
              <>
                <StaggerItem>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {selectedRoadmap.title}
                    </h2>
                    {selectedRoadmap.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {selectedRoadmap.description}
                      </p>
                    )}
                  </div>
                </StaggerItem>

                <StaggerItem>
                  {/* Progress Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-8">
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
                </StaggerItem>

                <StaggerItem>
                  {/* Credits Tracker */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
                    <CreditsTracker
                      completedCredits={calculateProgress(selectedRoadmap).completedCredits}
                      totalCredits={calculateProgress(selectedRoadmap).totalCredits}
                    />

                    {/* Quick Stats */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Quick Stats
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Courses</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {calculateProgress(selectedRoadmap).totalNodes}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Credits</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {calculateProgress(selectedRoadmap).totalCredits}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Credits Earned</span>
                          <span className="font-semibold text-green-600">
                            {calculateProgress(selectedRoadmap).completedCredits}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Credits Remaining
                          </span>
                          <span className="font-semibold text-amber-600">
                            {calculateProgress(selectedRoadmap).totalCredits -
                              calculateProgress(selectedRoadmap).completedCredits}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  {/* Semester Timeline */}
                  <SemesterTimeline roadmap={selectedRoadmap} />
                </StaggerItem>

                <StaggerItem>
                  {/* Action Buttons */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                      <button
                        onClick={() => navigate(`/roadmap?id=${selectedRoadmap.id}`)}
                        className="px-6 py-2 bg-sky-600 dark:bg-sky-700 text-white rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition font-medium text-sm whitespace-nowrap"
                      >
                        ✏️ Edit Roadmap
                      </button>
                      <ShareButton
                        roadmapId={selectedRoadmap.id}
                        roadmapTitle={selectedRoadmap.title}
                      />
                      <button
                        onClick={() => navigate("/roadmap")}
                        className="px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition font-medium text-sm whitespace-nowrap"
                      >
                        ➕ Create New Roadmap
                      </button>
                    </div>
                  </div>
                </StaggerItem>
              </>
            )}
          </StaggerContainer>
        </main>
      </div>
    </PageTransition>
  );
};
