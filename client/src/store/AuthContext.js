import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase, hasSupabase } from "../services/supabase";
const AuthContext = createContext(undefined);
const DEMO_USER_KEY = "degreemap.demoUser";
const DEMO_ACCOUNTS_KEY = "degreemap.demoAccounts";
function readAccounts() {
    try {
        const raw = localStorage.getItem(DEMO_ACCOUNTS_KEY);
        return raw ? JSON.parse(raw) : [];
    }
    catch {
        return [];
    }
}
function writeAccounts(accounts) {
    try {
        localStorage.setItem(DEMO_ACCOUNTS_KEY, JSON.stringify(accounts));
    }
    catch {
        /* ignore quota errors */
    }
}
function readDemoUser() {
    try {
        const raw = localStorage.getItem(DEMO_USER_KEY);
        return raw ? JSON.parse(raw) : null;
    }
    catch {
        return null;
    }
}
function writeDemoUser(user) {
    try {
        if (user)
            localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
        else
            localStorage.removeItem(DEMO_USER_KEY);
    }
    catch {
        /* ignore */
    }
}
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // Start in demo mode if there's no Supabase client; we'll also fall back to demo on network errors.
    const [isDemoMode, setIsDemoMode] = useState(!hasSupabase);
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
                if (cancelled)
                    return;
                const sessionUser = data.session?.user;
                if (sessionUser) {
                    setUser({
                        id: sessionUser.id,
                        email: sessionUser.email ?? "",
                        user_metadata: sessionUser.user_metadata,
                    });
                }
            }
            catch {
                // Network or config error — drop into demo mode.
                setIsDemoMode(true);
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
            const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
                const u = session?.user;
                setUser(u ? { id: u.id, email: u.email ?? "", user_metadata: u.user_metadata } : null);
            });
            return () => sub.subscription?.unsubscribe();
        };
        bootstrap();
        return () => {
            cancelled = true;
        };
    }, []);
    const demoSignUp = (email, password, data) => {
        const accounts = readAccounts();
        if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
            throw new Error("An account with this email already exists");
        }
        accounts.push({ email, password, data });
        writeAccounts(accounts);
    };
    const demoSignIn = (email, password) => {
        const accounts = readAccounts();
        const match = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
        if (!match) {
            // Allow first-time login without prior sign up for demo convenience.
            if (accounts.length === 0) {
                demoSignUp(email, password);
            }
            else {
                throw new Error("Invalid email or password");
            }
        }
        const u = {
            id: `demo-${email}`,
            email,
            user_metadata: match?.data ?? {},
        };
        writeDemoUser(u);
        setUser(u);
    };
    const signUp = async (email, password, data) => {
        if (!isDemoMode && supabase) {
            try {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: data ?? {} },
                });
                if (error)
                    throw error;
                return;
            }
            catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                if (/fetch|network/i.test(msg)) {
                    setIsDemoMode(true);
                }
                else {
                    throw err;
                }
            }
        }
        demoSignUp(email, password, data);
        demoSignIn(email, password);
    };
    const signIn = async (email, password) => {
        if (!isDemoMode && supabase) {
            try {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error)
                    throw error;
                return;
            }
            catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                if (/fetch|network/i.test(msg)) {
                    setIsDemoMode(true);
                }
                else {
                    throw err;
                }
            }
        }
        demoSignIn(email, password);
    };
    const signOut = async () => {
        writeDemoUser(null);
        setUser(null);
        if (!isDemoMode && supabase) {
            try {
                await supabase.auth.signOut();
            }
            catch {
                /* ignore */
            }
        }
    };
    return (_jsx(AuthContext.Provider, { value: { user, loading, isDemoMode, signUp, signIn, signOut }, children: children }));
};
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
