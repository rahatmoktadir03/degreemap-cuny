import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, hasSupabase } from "../services/supabase";
import { apiEnabled, apiFetch } from "../services/apiClient";

type DemoUser = {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
};

interface AuthContextType {
  user: DemoUser | null;
  loading: boolean;
  isDemoMode: boolean;
  role: string | null;
  signUp: (email: string, password: string, data?: Record<string, unknown>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Record<string, unknown>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_KEY = "degreemap.demoUser";
const DEMO_ACCOUNTS_KEY = "degreemap.demoAccounts";

type DemoAccount = { email: string; password: string; data?: Record<string, unknown> };

function readAccounts(): DemoAccount[] {
  try {
    const raw = localStorage.getItem(DEMO_ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as DemoAccount[]) : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: DemoAccount[]) {
  try {
    localStorage.setItem(DEMO_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    /* ignore quota errors */
  }
}

function readDemoUser(): DemoUser | null {
  try {
    const raw = localStorage.getItem(DEMO_USER_KEY);
    return raw ? (JSON.parse(raw) as DemoUser) : null;
  } catch {
    return null;
  }
}

function writeDemoUser(user: DemoUser | null) {
  try {
    if (user) localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(DEMO_USER_KEY);
  } catch {
    /* ignore */
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  // Start in demo mode if there's no Supabase client; we'll also fall back to demo on network errors.
  const [isDemoMode, setIsDemoMode] = useState<boolean>(!hasSupabase);

  // Fetch the server-side role (lives in `profiles`, not in auth metadata) so
  // the UI can reflect advisor status. Best-effort; ignored in demo/offline.
  useEffect(() => {
    let cancelled = false;
    if (!user || isDemoMode || !apiEnabled) {
      setRole(null);
      return;
    }
    (async () => {
      try {
        const res = await apiFetch("/api/users/me");
        if (!cancelled) setRole((res?.data?.role as string) ?? null);
      } catch {
        if (!cancelled) setRole(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, isDemoMode]);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      // Always honor an existing demo session first.
      const cached = readDemoUser();
      if (cached) {
        setUser(cached);
        setLoading(false);
        return;
      }

      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        const sessionUser = data.session?.user;
        if (sessionUser) {
          setUser({
            id: sessionUser.id,
            email: sessionUser.email ?? "",
            user_metadata: sessionUser.user_metadata,
          });
        }
      } catch {
        // Network or config error — drop into demo mode.
        setIsDemoMode(true);
      } finally {
        if (!cancelled) setLoading(false);
      }

      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        const u = session?.user;
        setUser(
          u ? { id: u.id, email: u.email ?? "", user_metadata: u.user_metadata } : null
        );
      });

      return () => sub.subscription?.unsubscribe();
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const demoSignUp = (email: string, password: string, data?: Record<string, unknown>) => {
    const accounts = readAccounts();
    if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists");
    }
    accounts.push({ email, password, data });
    writeAccounts(accounts);
  };

  const demoSignIn = (email: string, password: string) => {
    const accounts = readAccounts();
    const match = accounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!match) {
      // Allow first-time login without prior sign up for demo convenience.
      if (accounts.length === 0) {
        demoSignUp(email, password);
      } else {
        throw new Error("Invalid email or password");
      }
    }
    const u: DemoUser = {
      id: `demo-${email}`,
      email,
      user_metadata: match?.data ?? {},
    };
    writeDemoUser(u);
    setUser(u);
  };

  const signUp = async (email: string, password: string, data?: Record<string, unknown>) => {
    if (!isDemoMode && supabase) {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: data ?? {} },
        });
        if (error) throw error;
        return;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (/fetch|network/i.test(msg)) {
          setIsDemoMode(true);
        } else {
          throw err;
        }
      }
    }
    demoSignUp(email, password, data);
    demoSignIn(email, password);
  };

  const signIn = async (email: string, password: string) => {
    if (!isDemoMode && supabase) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (/fetch|network/i.test(msg)) {
          setIsDemoMode(true);
        } else {
          throw err;
        }
      }
    }
    demoSignIn(email, password);
  };

  const updateProfile = async (data: Record<string, unknown>) => {
    if (!user) return;
    const next: DemoUser = { ...user, user_metadata: { ...(user.user_metadata ?? {}), ...data } };
    writeDemoUser(next);
    setUser(next);
    if (!isDemoMode && supabase) {
      try {
        await supabase.auth.updateUser({ data });
      } catch {
        /* ignore — local copy already updated */
      }
    }
  };

  const signOut = async () => {
    writeDemoUser(null);
    setUser(null);
    if (!isDemoMode && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isDemoMode, role, signUp, signIn, signOut, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
