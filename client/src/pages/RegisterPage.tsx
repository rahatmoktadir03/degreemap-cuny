import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, AlertCircle } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { PageTransition } from "../components/ui";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email || !password || !name) {
        throw new Error("Please fill in all fields");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      await signUp(email, password, name);
      navigate("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-blue-950 dark:to-teal-950 flex items-center justify-center px-4 py-8">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-primary-400/20 to-transparent rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr from-secondary-400/20 to-transparent rounded-full blur-3xl -z-10"></div>

        <div className="w-full max-w-md">
          {/* Card */}
          <Card className="backdrop-blur-xl border border-white/20 dark:border-white/10">
            <CardHeader className="text-center space-y-4">
              <div className="inline-flex w-12 h-12 rounded-lg bg-linear-to-br from-primary-600 to-secondary-600 items-center justify-center text-white mx-auto">
                <UserPlus className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-3xl bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  DegreeMap
                </CardTitle>
                <CardDescription className="text-base">Create your account</CardDescription>
              </div>
            </CardHeader>

            <div className="px-6 pb-6 space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="font-medium text-red-900 dark:text-red-300">{error}</p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    disabled={loading}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={loading}
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    disabled={loading}
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ✓ At least 6 characters required
                  </p>
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={loading} size="lg" className="w-full mt-6">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Creating account...
                    </span>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white dark:bg-slate-950 text-gray-600 dark:text-gray-400">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Login Link */}
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full">
                  Sign In
                </Button>
              </Link>
            </div>
          </Card>

          {/* Footer Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              By signing up, you agree to our{" "}
              <a
                href="#"
                className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
              >
                Terms
              </a>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RegisterPage;
