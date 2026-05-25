import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Compass, Calendar, ArrowRight, Sparkles, Users } from "lucide-react";
import { Button } from "../components/ui/button";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-950 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-24 sm:py-32 text-center">
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/40 rounded-full text-sm font-semibold text-blue-300">
            <Sparkles className="h-4 w-4" />
            Plan Your Future with Confidence
          </div>

          {/* Heading */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold bg-linear-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            DegreeMap
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Plan your CUNY degree visually. Explore campuses. Build your academic roadmap. Track
            your journey.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              className="px-8 py-3 text-base font-semibold bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              onClick={() => navigate("/explore")}
            >
              <Compass className="h-5 w-5" />
              Explore CUNY
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              className="px-8 py-3 text-base font-semibold border-2 border-blue-400/50 text-blue-300 hover:bg-blue-500/20"
              onClick={() => navigate("/register")}
            >
              Get Started
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-blue-400">25</p>
              <p className="text-sm text-slate-400">CUNY Campuses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-cyan-400">100%</p>
              <p className="text-sm text-slate-400">Visual Planning</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-blue-400">1000+</p>
              <p className="text-sm text-slate-400">Students Mapped</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20 sm:py-28">
        <div className="space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Comprehensive tools to plan, explore, and track your academic success
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-linear-to-br from-blue-500/10 to-cyan-500/10 border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300">
              <div className="inline-flex w-20 h-20 rounded-xl bg-linear-to-br from-blue-600 to-cyan-600 items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">CUNY Explorer</h3>
              <p className="text-slate-300 leading-relaxed">
                Explore all 25 CUNY campuses with interactive maps and detailed program information.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-linear-to-br from-purple-500/10 to-pink-500/10 border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300">
              <div className="inline-flex w-20 h-20 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <Compass className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Roadmap Builder</h3>
              <p className="text-slate-300 leading-relaxed">
                Create visual, node-based academic roadmaps for your degree path with ease.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-linear-to-br from-cyan-500/10 to-blue-500/10 border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300">
              <div className="inline-flex w-20 h-20 rounded-xl bg-linear-to-br from-cyan-600 to-blue-600 items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">My Journey</h3>
              <p className="text-slate-300 leading-relaxed">
                Track your progress and stay on top of your academic goals and milestones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20 sm:py-28">
        <div className="bg-linear-to-br from-slate-800 via-blue-900 to-slate-900 rounded-3xl p-12 sm:p-16 text-center space-y-8 border border-blue-500/20">
          <h2 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Ready to Build Your Degree?
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of CUNY students planning their academic journey with visual roadmaps and
            comprehensive campus information.
          </p>
          <Button
            className="px-10 py-3 text-base font-semibold bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            onClick={() => navigate("/register")}
          >
            <Users className="h-5 w-5" />
            Start Planning Now
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-700/50 py-12 text-center text-slate-400 mt-20">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <p className="text-sm flex items-center justify-center gap-1">
            Built for CUNY students. Made with <span className="text-red-500">❤️</span> by your
            coding team.
          </p>
          <p className="text-xs text-slate-500">© 2024 DegreeMap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
