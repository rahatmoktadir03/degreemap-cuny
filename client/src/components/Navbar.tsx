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
    <nav className="sticky top-0 z-50 bg-linear-to-r from-slate-950 to-slate-900 border-b border-blue-500/20 shadow-lg backdrop-blur-xl">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-8">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity shrink-0 whitespace-nowrap"
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
                  className="whitespace-nowrap text-slate-300 hover:text-blue-400 hover:bg-blue-500/10"
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/explore")}
                  className="whitespace-nowrap text-slate-300 hover:text-blue-400 hover:bg-blue-500/10"
                >
                  Explore
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/roadmap")}
                  className="whitespace-nowrap text-slate-300 hover:text-blue-400 hover:bg-blue-500/10"
                >
                  Roadmap
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/journey")}
                  className="whitespace-nowrap text-slate-300 hover:text-blue-400 hover:bg-blue-500/10"
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
                  className="whitespace-nowrap text-slate-300 hover:text-blue-400 hover:bg-blue-500/10"
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
                className="gap-1 shrink-0 whitespace-nowrap rounded-lg bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="hidden sm:inline-flex shrink-0 whitespace-nowrap rounded-lg border border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/register")}
                  className="shrink-0 whitespace-nowrap rounded-lg bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
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
