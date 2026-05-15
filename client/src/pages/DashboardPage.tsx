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

  const dashboardItems = [
    {
      icon: "🧭",
      title: "Build Your Roadmap",
      desc: "Create a visual, node-based academic roadmap for your degree.",
      path: "/roadmap",
      color: "from-primary-500 to-primary-600",
    },
    {
      icon: "🗺️",
      title: "Explore CUNY Campuses",
      desc: "View all 25 CUNY schools with detailed information about programs.",
      path: "/explore",
      color: "from-secondary-500 to-secondary-600",
    },
    {
      icon: "📊",
      title: "My Journey",
      desc: "Track your progress and view roadmap completion stats.",
      path: "/journey",
      color: "from-blue-500 to-cyan-600",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
              <span className="text-lg">📅</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              My Journey
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600 text-white font-semibold rounded-lg transition text-sm whitespace-nowrap shadow-md hover:shadow-lg"
            >
              {loading ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Welcome Section */}
        <div className="mb-12 animate-slideInUp">
          <div className="card bg-linear-to-br from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800 border-none text-white">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">Welcome back! 👋</h2>
              <p className="text-primary-100 dark:text-primary-200 text-lg break-all">
                {user?.email || "Loading..."}
              </p>
            </div>
            <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {dashboardItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(item.path)}
              className="card card-hover group cursor-pointer transform hover:scale-105 transition-all duration-300 animate-slideInUp"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex flex-col h-full">
                <div
                  className={`inline-flex w-16 h-16 rounded-xl bg-linear-to-br ${item.color} items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 grow">{item.desc}</p>
                <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold group-hover:gap-3 gap-2 transition-all duration-200">
                  <span>Get Started</span>
                  <span className="text-xl group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Account Information Card */}
        {/* Dynamic animation delay - legitimate use of inline style */}
        <div className="animate-slideInUp" style={{ animationDelay: "300ms" }} title="Welcome card">
          <div className="card">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span>👤</span> Account Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Email Address
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white break-all">
                  {user?.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Account Status
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-lg font-medium text-green-600 dark:text-green-400">Active</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  User ID
                </p>
                <p className="text-sm font-mono text-gray-600 dark:text-gray-400 break-all">
                  {user?.id}
                </p>
              </div>
              {session && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Authentication
                  </p>
                  <p className="text-lg font-medium text-blue-600 dark:text-blue-400">✓ Verified</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
