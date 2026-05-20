import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Compass, Calendar, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="space-y-6">
          <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
            ✨ Plan Your Future with Confidence
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white">
            DegreeMap
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Plan your CUNY degree visually. Explore campuses. Build your academic roadmap. Track
            your journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 max-w-md mx-auto w-full">
            <Button
              size="lg"
              className="px-6 w-full sm:w-auto"
              onClick={() => navigate("/explore")}
            >
              Explore CUNY
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-6 w-full sm:w-auto"
              onClick={() => navigate("/register")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Everything You Need
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center space-y-4">
            <div className="inline-flex w-16 h-16 rounded-lg bg-blue-500 items-center justify-center text-white">
              <MapPin className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                CUNY Explorer
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Explore all 25 CUNY campuses with interactive maps and detailed program information.
              </p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex w-16 h-16 rounded-lg bg-purple-500 items-center justify-center text-white">
              <Compass className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Roadmap Builder
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Create visual, node-based academic roadmaps for your degree path with ease.
              </p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex w-16 h-16 rounded-lg bg-teal-500 items-center justify-center text-white">
              <Calendar className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">My Journey</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Track your progress and stay on top of your academic goals and milestones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 rounded-lg p-8 text-white text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Build Your Degree?</h2>
          <p className="text-lg text-blue-100">
            Join hundreds of CUNY students planning their academic journey with visual roadmaps and
            comprehensive campus information.
          </p>
          <Button variant="secondary" onClick={() => navigate("/register")}>
            Create Your Roadmap
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 dark:border-gray-800 py-8 text-center text-gray-600 dark:text-gray-400">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm">Built for CUNY students. Made with ❤️ by your coding team.</p>
          <p className="text-xs mt-2 text-gray-500 dark:text-gray-500">
            © 2024 DegreeMap. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
