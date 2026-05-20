import React from "react";
import { useNavigate } from "react-router-dom";
import { Compass, Map, TrendingUp } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { PageTransition, StaggerContainer, StaggerItem } from "../components/ui";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const dashboardItems = [
    {
      icon: <Compass className="h-8 w-8" />,
      title: "Build Your Roadmap",
      desc: "Create a visual, node-based academic roadmap for your degree.",
      path: "/roadmap",
      color: "from-primary-500 to-primary-600",
    },
    {
      icon: <Map className="h-8 w-8" />,
      title: "Explore CUNY Campuses",
      desc: "View all 25 CUNY schools with detailed information about programs.",
      path: "/explore",
      color: "from-secondary-500 to-secondary-600",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "My Journey",
      desc: "Track your progress and view roadmap completion stats.",
      path: "/journey",
      color: "from-blue-500 to-cyan-600",
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Welcome Section */}
          <StaggerContainer delayChildren={0.1}>
            <StaggerItem>
              <div className="mb-12 card bg-linear-to-br from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800 border-none text-white">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-2">Welcome back! 👋</h2>
                  <p className="text-primary-100 dark:text-primary-200 text-lg break-all">
                    {user?.email || "Loading..."}
                  </p>
                </div>
                <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -z-10"></div>
              </div>
            </StaggerItem>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {dashboardItems.map((item, idx) => (
                <StaggerItem key={idx}>
                  <div
                    onClick={() => navigate(item.path)}
                    className="card card-hover group cursor-pointer transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex flex-col h-full">
                      <div
                        className={`inline-flex w-16 h-16 rounded-xl bg-linear-to-br ${item.color} items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
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
                </StaggerItem>
              ))}
            </div>

            {/* Account Information Card */}
            <StaggerItem>
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
                      <p className="text-lg font-medium text-green-600 dark:text-green-400">
                        Active
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </main>
      </div>
    </PageTransition>
  );
};

export default DashboardPage;
