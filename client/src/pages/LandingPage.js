import { useNavigate } from "react-router-dom";
import { MapPin, Compass, Calendar, ArrowRight, Sparkles, Users } from "lucide-react";
import { Button } from "../components/ui/button";
const LandingPage = () => {
    const navigate = useNavigate();
    return (<div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="w-full px-4 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-300">
            <Sparkles className="h-4 w-4"/>
            Plan Your Future with Confidence
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white">
            DegreeMap
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Plan your CUNY degree visually. Explore campuses. Build your academic roadmap. Track
            your journey.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="default" onClick={() => navigate("/explore")} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              <Compass className="h-5 w-5"/>
              Explore CUNY
              <ArrowRight className="h-5 w-5"/>
            </Button>
            <Button variant="outline" onClick={() => navigate("/register")} className="border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 px-8 py-3">
              Get Started
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 pt-8 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">25</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">CUNY Campuses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">
                100%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Visual Planning</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">1K+</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Students</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 py-20 sm:py-28 bg-gray-50 dark:bg-slate-800/50">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Comprehensive tools to plan, explore, and track your academic success
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <MapPin className="h-6 w-6"/>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                CUNY Explorer
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Explore all 25 CUNY campuses with interactive maps and detailed program information.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                <Compass className="h-6 w-6"/>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Roadmap Builder
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create visual, node-based academic roadmaps for your degree path with ease.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4">
                <Calendar className="h-6 w-6"/>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">My Journey</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track your progress and stay on top of your academic goals and milestones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto">
          <div className="bg-blue-50 dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-900/50 rounded-xl p-8 sm:p-12 text-center space-y-6">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
              Ready to Build Your Degree?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Join hundreds of CUNY students planning their academic journey with visual roadmaps
              and comprehensive campus information.
            </p>
            <Button variant="default" onClick={() => navigate("/register")} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 inline-flex items-center gap-2">
              <Users className="h-5 w-5"/>
              Start Planning Now
              <ArrowRight className="h-5 w-5"/>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-700 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>Made with ❤️ for CUNY students</p>
          <p className="text-sm mt-2">© 2024 DegreeMap. All rights reserved.</p>
        </div>
      </footer>
    </div>);
};
export default LandingPage;
