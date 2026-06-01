import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, GraduationCap, Mail, Lock, Loader2, CheckCircle2, School } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { cunyCampuses } from "../data/cunyCampuses";
import toast from "react-hot-toast";

const perks = [
  "Visual semester-by-semester planning",
  "All 25 CUNY campuses, in one place",
  "Track credits, GPA, and milestones",
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signUp, isDemoMode } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, { name, school, major });
      toast.success(
        isDemoMode ? "Account created locally — welcome!" : "Account created! Check your email."
      );
      navigate("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2 bg-hero-gradient">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-purple-400/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-blue-400/30 blur-3xl" />
        <div className="relative">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-300 font-bold"
          >
            <GraduationCap className="h-6 w-6" /> DegreeMap
          </button>
          <h2 className="mt-12 text-4xl font-extrabold leading-tight">
            Start your <span className="text-gradient">CUNY journey</span>.
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-md">
            Create a free account to start mapping semesters, exploring campuses, and tracking your
            progress toward graduation.
          </p>
          <ul className="mt-8 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" /> {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-slate-500 dark:text-slate-400">
          No credit card. No spam. Free for every CUNY student.
        </p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md card-surface rounded-2xl p-8 shadow-xl animate-fade-in-up">
          <div className="text-center mb-7">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isDemoMode
                ? "Demo mode — your account is stored locally on this device."
                : "It only takes a few seconds."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full name</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahat Moktadir"
                  className="pl-9!"
                  required
                />
              </div>
            </div>

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
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="pl-9!"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">Home campus</label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select
                    aria-label="Home campus"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="pl-9!"
                  >
                    <option value="">— Pick —</option>
                    {cunyCampuses.map((c) => (
                      <option key={c.id} value={c.shortName}>
                        {c.shortName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Major</label>
                <input
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="e.g. CS, Nursing"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
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
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
                </>
              ) : (
                <>Create account</>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 dark:text-blue-300 font-semibold hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
