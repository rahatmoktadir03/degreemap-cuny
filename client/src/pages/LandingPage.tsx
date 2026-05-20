import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Compass, Calendar, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { PageTransition, StaggerContainer, StaggerItem } from "../components/ui";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "CUNY School Explorer",
      desc: "Explore all 25 CUNY campuses with interactive maps and detailed program information.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Compass className="h-8 w-8" />,
      title: "Roadmap Builder",
      desc: "Create visual, node-based academic roadmaps for your degree path with ease.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "My Journey",
      desc: "Track your progress and stay on top of your academic goals and milestones.",
      color: "from-teal-500 to-teal-600",
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-blue-950 dark:to-teal-950">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-32">
          <StaggerContainer delayChildren={0.1}>
            <div className="text-center space-y-8">
              {/* Badge */}
              <StaggerItem>
                <div className="inline-block">
                  <div className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold border border-primary-200 dark:border-primary-800">
                    ✨ Plan Your Future with Confidence
                  </div>
                </div>
              </StaggerItem>

              {/* Main Heading */}
              <StaggerItem>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-linear-to-r from-primary-700 via-secondary-600 to-teal-600 bg-clip-text text-transparent">
                  DegreeMap is Live
                </h1>
              </StaggerItem>

              {/* Subheading */}
              <StaggerItem>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Plan your CUNY degree visually. Explore campuses. Build your academic roadmap.
                  Track your journey.
                </p>
              </StaggerItem>

              {/* CTA Buttons */}
              <StaggerItem>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
                  <Button
                    size="lg"
                    onClick={() => navigate("/explore")}
                    className="gap-2 w-full sm:w-auto"
                  >
                    Explore CUNY
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/register")}
                    className="w-full sm:w-auto"
                  >
                    Get Started
                  </Button>
                </div>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </section>

        {/* Features Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <StaggerContainer delayChildren={0.1}>
            <StaggerItem>
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
                Everything You Need
              </h2>
            </StaggerItem>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <StaggerItem key={idx}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 group cursor-default">
                    <CardHeader className="space-y-4">
                      <div
                        className={`inline-flex w-12 h-12 rounded-lg bg-linear-to-br ${feature.color} items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
                      >
                        {feature.icon}
                      </div>
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <CardDescription className="text-base">{feature.desc}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </section>

        {/* Benefits Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <StaggerContainer delayChildren={0.1}>
            <StaggerItem>
              <div className="bg-linear-to-r from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800 rounded-xl p-8 sm:p-12 text-white text-center space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold">Ready to Build Your Degree?</h2>
                <p className="text-lg text-primary-100 dark:text-primary-200 max-w-2xl mx-auto">
                  Join hundreds of CUNY students planning their academic journey with visual
                  roadmaps and comprehensive campus information.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => navigate("/register")}
                    className="gap-2 w-full sm:w-auto"
                  >
                    Create Your Roadmap
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* Footer */}
        <footer className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm sm:text-base">
              Built for CUNY students. Made with ❤️ by your coding team.
            </p>
            <p className="text-xs sm:text-sm mt-4 text-gray-500 dark:text-gray-500">
              © 2024 DegreeMap. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default LandingPage;
