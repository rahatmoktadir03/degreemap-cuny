import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { DarkModeToggle } from "./DarkModeToggle";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-8">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity shrink-0 whitespace-nowrap"
          >
            DegreeMap
          </button>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-6">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  className="whitespace-nowrap text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/explore")}
                  className="whitespace-nowrap text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Explore
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/roadmap")}
                  className="whitespace-nowrap text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Roadmap
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/journey")}
                  className="whitespace-nowrap text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Journey
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/explore")}
                  className="whitespace-nowrap text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Explore
                </Button>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4 ml-auto">
            <DarkModeToggle />
            {user ? (
              <Button
                size="sm"
                onClick={handleLogout}
                className="gap-1 shrink-0 whitespace-nowrap rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="hidden sm:inline-flex shrink-0 whitespace-nowrap rounded-lg border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/register")}
                  className="shrink-0 whitespace-nowrap rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
