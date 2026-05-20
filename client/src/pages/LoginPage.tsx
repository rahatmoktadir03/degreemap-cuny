import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { LogIn, AlertCircle, Check } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { PageTransition } from "../components/ui";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [successMessage, setSuccessMessage] = useState<string | null>(
    searchParams.get("registered") === "true"
      ? "Account created successfully! Please log in with your credentials."
      : null
  );
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      await signIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
                <LogIn className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-3xl bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  DegreeMap
                </CardTitle>
                <CardDescription className="text-base">Sign in to your account</CardDescription>
              </div>
            </CardHeader>

            <div className="px-6 pb-6 space-y-6">
              {/* Success Message */}
              {successMessage && (
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="font-medium text-green-900 dark:text-green-300">
                      {successMessage}
                    </p>
                  </div>
                </div>
              )}

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
              <form onSubmit={handleLogin} className="space-y-4">
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
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={loading} size="lg" className="w-full mt-6">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Signing in...
                    </span>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
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
                    Don't have an account?
                  </span>
                </div>
              </div>

              {/* Register Link */}
              <Link to="/register">
                <Button variant="outline" size="lg" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
          </Card>

          {/* Footer Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Having trouble?{" "}
              <a
                href="#"
                className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
