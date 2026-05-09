import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { DarkModeToggle } from "../components/DarkModeToggle";

const DashboardPage: React.FC = () => {
  const { user, session, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            📅 My Journey
          </h1>
          <div className="flex gap-2">
            <DarkModeToggle />
            <button
              onClick={handleLogout}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 dark:bg-red-700 dark:hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm whitespace-nowrap"
            >
              {loading ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800 text-white rounded-lg shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back! 👋</h2>
          <p className="text-sm sm:text-base text-secondary-100 dark:text-secondary-200 break-all">
            {user?.email}
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Start Building Roadmap */}
          <div
            onClick={() => navigate("/roadmap")}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-primary-600 hover:shadow-lg cursor-pointer transition"
          >
            <div className="text-4xl mb-4">🧭</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Build Your Roadmap
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Create a visual, node-based academic roadmap for your degree.
            </p>
            <p className="text-primary-600 dark:text-primary-400 font-semibold">Get Started →</p>
          </div>

          {/* Explore Campuses */}
          <div
            onClick={() => navigate("/explore")}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-secondary-600 hover:shadow-lg cursor-pointer transition"
          >
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Explore CUNY Campuses
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              View all 25 CUNY schools with detailed information about programs.
            </p>
            <p className="text-secondary-600 dark:text-secondary-400 font-semibold">Explore →</p>
          </div>

          {/* My Journey */}
          <div
            onClick={() => navigate("/journey")}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-blue-500 hover:shadow-lg cursor-pointer transition"
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">My Journey</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Track your progress and view roadmap completion stats.
            </p>
            <p className="text-blue-600 dark:text-blue-400 font-semibold">View Progress →</p>
          </div>
        </div>

        {/* User Info Card */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Account Information
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Email</p>
              <p className="text-lg text-gray-800 dark:text-white">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">User ID</p>
              <p className="text-sm font-mono text-gray-600">{user?.id}</p>
            </div>
            {session && (
              <div>
                <p className="text-sm text-gray-600 font-semibold">Status</p>
                <p className="text-lg text-green-600 font-semibold">✓ Authenticated</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
