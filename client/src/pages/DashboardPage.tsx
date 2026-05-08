import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">📅 My Journey</h1>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {loading ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back! 👋</h2>
          <p className="text-lg text-secondary-100">{user?.email}</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Start Building Roadmap */}
          <div
            onClick={() => navigate("/roadmap")}
            className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-600 hover:shadow-lg cursor-pointer transition"
          >
            <div className="text-4xl mb-4">🧭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Build Your Roadmap</h3>
            <p className="text-gray-600 mb-4">
              Create a visual, node-based academic roadmap for your degree.
            </p>
            <p className="text-primary-600 font-semibold">Get Started →</p>
          </div>

          {/* Explore Campuses */}
          <div
            onClick={() => navigate("/explore")}
            className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary-600 hover:shadow-lg cursor-pointer transition"
          >
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Explore CUNY Campuses</h3>
            <p className="text-gray-600 mb-4">
              View all 25 CUNY schools with detailed information about programs.
            </p>
            <p className="text-secondary-600 font-semibold">Explore →</p>
          </div>

          {/* My Roadmaps */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">My Roadmaps</h3>
            <p className="text-gray-600 mb-4">View and manage all your saved academic roadmaps.</p>
            <p className="text-gray-400 font-semibold">Coming soon</p>
          </div>
        </div>

        {/* User Info Card */}
        <div className="mt-12 bg-white rounded-lg shadow p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Account Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Email</p>
              <p className="text-lg text-gray-800">{user?.email}</p>
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
