import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../store/AuthContext";
import DarkModeToggle from "./DarkModeToggle";
import toast from "react-hot-toast";
const Navbar = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleLogout = async () => {
        try {
            await signOut();
            toast.success("Logged out successfully");
            navigate("/");
        }
        catch (error) {
            toast.error("Failed to log out");
        }
    };
    return (<nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button onClick={() => navigate("/")} className="font-bold text-xl text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              DegreeMap
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/explore" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Explore
            </a>
            {user && (<>
                <a href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Dashboard
                </a>
                <a href="/roadmap-builder" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Builder
                </a>
              </>)}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <DarkModeToggle />

            {user ? (<>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden sm:flex">
                  <LogOut className="h-4 w-4"/>
                  Logout
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="sm:hidden">
                  <LogOut className="h-5 w-5"/>
                </Button>
              </>) : (<div className="hidden sm:flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button variant="default" size="sm" onClick={() => navigate("/register")}>
                  Sign Up
                </Button>
              </div>)}

            {/* Mobile Menu */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (<div className="md:hidden pb-4 space-y-2">
            <a href="/explore" className="block px-4 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
              Explore
            </a>
            {user && (<>
                <a href="/dashboard" className="block px-4 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                  Dashboard
                </a>
                <a href="/roadmap-builder" className="block px-4 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                  Builder
                </a>
              </>)}
            {!user && (<>
                <button onClick={() => navigate("/login")} className="w-full text-left px-4 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                  Login
                </button>
                <button onClick={() => navigate("/register")} className="w-full text-left px-4 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                  Sign Up
                </button>
              </>)}
          </div>)}
      </div>
    </nav>);
};
export default Navbar;
