import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, GraduationCap, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import DarkModeToggle from "./DarkModeToggle";
import toast from "react-hot-toast";

const navItem = (active: boolean) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    active
      ? "text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10"
      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
  }`;

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut, isDemoMode, role } = useAuth();
  const [open, setOpen] = useState(false);
  const isAdvisor = role === "advisor" || role === "admin";

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Signed out");
      navigate("/");
    } catch {
      toast.error("Failed to log out");
    } finally {
      setOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 font-bold text-lg text-blue-600 dark:text-blue-300"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
              <GraduationCap className="h-4.5 w-4.5" />
            </span>
            DegreeMap
            {isDemoMode && (
              <span className="hidden sm:inline ml-2 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                Demo
              </span>
            )}
            {isAdvisor && (
              <span className="hidden sm:inline ml-2 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                Advisor
              </span>
            )}
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/explore" className={({ isActive }) => navItem(isActive)}>
              Explore
            </NavLink>
            {user && (
              <>
                <NavLink to="/dashboard" className={({ isActive }) => navItem(isActive)}>
                  Dashboard
                </NavLink>
                <NavLink to="/roadmap-builder" className={({ isActive }) => navItem(isActive)}>
                  Roadmap
                </NavLink>
                <NavLink to="/journey" className={({ isActive }) => navItem(isActive)}>
                  Journey
                </NavLink>
                {isAdvisor && (
                  <NavLink to="/advisor" className={({ isActive }) => navItem(isActive)}>
                    Advisor
                  </NavLink>
                )}
              </>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="px-3 py-1.5 text-sm font-medium rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="px-3 py-1.5 text-sm font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                >
                  Sign up
                </button>
              </div>
            )}

            <button
              type="button"
              className="md:hidden p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1">
          <NavLink
            to="/explore"
            onClick={() => setOpen(false)}
            className={({ isActive }) => `block ${navItem(isActive)}`}
          >
            Explore
          </NavLink>
          {user && (
            <>
              <NavLink
                to="/dashboard"
                onClick={() => setOpen(false)}
                className={({ isActive }) => `block ${navItem(isActive)}`}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/roadmap-builder"
                onClick={() => setOpen(false)}
                className={({ isActive }) => `block ${navItem(isActive)}`}
              >
                Roadmap
              </NavLink>
              <NavLink
                to="/journey"
                onClick={() => setOpen(false)}
                className={({ isActive }) => `block ${navItem(isActive)}`}
              >
                Journey
              </NavLink>
              {isAdvisor && (
                <NavLink
                  to="/advisor"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `block ${navItem(isActive)}`}
                >
                  Advisor
                </NavLink>
              )}
            </>
          )}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-800 text-sm font-medium"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate("/login");
                  }}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 text-sm font-medium"
                >
                  <LogIn className="h-4 w-4" /> Sign in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate("/register");
                  }}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold"
                >
                  <UserPlus className="h-4 w-4" /> Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
