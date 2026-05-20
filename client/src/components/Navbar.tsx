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
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-8">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity flex-shrink-0 whitespace-nowrap"
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
                  className="whitespace-nowrap"
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/explore")}
                  className="whitespace-nowrap"
                >
                  Explore
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/roadmap")}
                  className="whitespace-nowrap"
                >
                  Roadmap
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/journey")}
                  className="whitespace-nowrap"
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
                  className="whitespace-nowrap"
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
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="gap-1 flex-shrink-0 whitespace-nowrap"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="hidden sm:inline-flex flex-shrink-0 whitespace-nowrap"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/register")}
                  className="flex-shrink-0 whitespace-nowrap"
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
