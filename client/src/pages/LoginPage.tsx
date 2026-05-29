import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, GraduationCap, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, isDemoMode } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2 bg-hero-gradient">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-blue-400/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-purple-400/30 blur-3xl" />
        <div className="relative">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-300 font-bold"
          >
            <GraduationCap className="h-6 w-6" /> DegreeMap
          </button>
          <h2 className="mt-12 text-4xl font-extrabold leading-tight">
            Welcome back to <span className="text-gradient">your roadmap</span>.
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-md">
            Pick up where you left off. Track your progress, plan future semesters, and explore new
            CUNY opportunities.
          </p>
        </div>
        <p className="relative text-sm text-slate-500 dark:text-slate-400">
          “DegreeMap turned three confusing advisor meetings into a five-minute plan.”
          <br />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            — Aisha, Hunter CS '26
          </span>
        </p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md card-surface rounded-2xl p-8 shadow-xl animate-fade-in-up">
          <div className="text-center mb-7">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <LogIn className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">Sign in to DegreeMap</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isDemoMode
                ? "Demo mode — credentials are stored locally on this device."
                : "Use your DegreeMap email and password to continue."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-9!"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium">Password</label>
                <button
                  type="button"
                  className="text-xs text-blue-600 dark:text-blue-300 hover:underline"
                  onClick={() => toast("Reach out to your campus advisor to reset.")}
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9!"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                </>
              ) : (
                <>Sign in</>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-600 dark:text-blue-300 font-semibold hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
