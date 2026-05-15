import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-blue-950 dark:to-teal-950">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            DegreeMap
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="btn-secondary px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center animate-slideInUp">
          <div className="inline-block mb-6">
            <span className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold">
              ✨ Plan Your Future with Confidence
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-primary-700 via-secondary-600 to-teal-600 bg-clip-text text-transparent">
            DegreeMap is Live
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Plan your CUNY degree visually. Explore campuses. Build your academic roadmap. Track
            your journey.
          </p>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-6 my-16 mb-12">
            {[
              {
                icon: "🗺️",
                title: "CUNY School Explorer",
                desc: "Explore all 25 CUNY campuses with interactive maps and detailed stats.",
              },
              {
                icon: "🧭",
                title: "Roadmap Builder",
                desc: "Create visual, node-based academic roadmaps for your degree path.",
              },
              {
                icon: "📅",
                title: "My Journey",
                desc: "Track your progress and stay on top of your academic goals.",
              },
            ].map((feature, idx) => (
              {/* eslint-disable-next-line */}
              <div
                key={idx}
                className="card card-hover group transform hover:scale-105 transition-all duration-300 animate-slideInUp"
                style={{ '--animation-delay': `${idx * 100}ms` } as React.CSSProperties}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/explore")}
              className="btn-secondary px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Explore CUNY
            </button>
            <button
              onClick={() => navigate("/register")}
              className="btn-outline px-8 py-4 rounded-lg font-semibold text-lg border-2 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <p className="text-sm md:text-base">
          Built for CUNY students. Made with ❤️ by your coding team.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
