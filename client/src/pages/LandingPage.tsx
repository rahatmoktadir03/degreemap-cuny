import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white">
      {/* Header */}
      <header className="px-6 py-8 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-3xl font-bold">DegreeMap</div>
          <div className="space-x-4">
            <button className="px-4 py-2 rounded-lg hover:bg-primary-700 transition">Login</button>
            <button className="px-6 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition font-semibold">
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 md:px-12 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">DegreeMap is live 🎓</h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12">
            Plan your CUNY degree visually. Explore campuses. Build your academic roadmap. Track
            your journey.
          </p>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 my-16">
            <div className="bg-primary-800 bg-opacity-50 backdrop-blur p-8 rounded-2xl border border-primary-700">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold mb-2">CUNY School Explorer</h3>
              <p className="text-gray-300">
                Explore all 25 CUNY campuses with interactive maps and detailed stats.
              </p>
            </div>
            <div className="bg-primary-800 bg-opacity-50 backdrop-blur p-8 rounded-2xl border border-primary-700">
              <div className="text-4xl mb-4">🧭</div>
              <h3 className="text-xl font-bold mb-2">Roadmap Builder</h3>
              <p className="text-gray-300">
                Create visual, node-based academic roadmaps for your degree path.
              </p>
            </div>
            <div className="bg-primary-800 bg-opacity-50 backdrop-blur p-8 rounded-2xl border border-primary-700">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold mb-2">My Journey</h3>
              <p className="text-gray-300">
                Track your progress and stay on top of your academic goals.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/explore")}
              className="px-8 py-4 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition font-semibold text-lg"
            >
              Explore CUNY
            </button>
            <button className="px-8 py-4 border-2 border-secondary-500 text-secondary-300 rounded-lg hover:bg-secondary-500 hover:text-white transition font-semibold text-lg">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 border-t border-primary-700 text-center text-gray-400">
        <p>Built for CUNY students. Made with ❤️ by your coding team.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
