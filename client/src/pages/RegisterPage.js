import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, GraduationCap, Mail, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import toast from "react-hot-toast";
const perks = [
    "Visual semester-by-semester planning",
    "All 25 CUNY campuses, in one place",
    "Track credits, GPA, and milestones",
];
const RegisterPage = () => {
    const navigate = useNavigate();
    const { signUp, isDemoMode } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
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
            await signUp(email, password);
            toast.success(isDemoMode ? "Account created locally — welcome!" : "Account created! Check your email.");
            navigate("/dashboard");
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Registration failed";
            toast.error(message);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-[calc(100vh-4rem)] grid lg:grid-cols-2 bg-hero-gradient", children: [_jsxs("div", { className: "hidden lg:flex flex-col justify-between p-12 relative overflow-hidden", children: [_jsx("div", { className: "absolute -top-16 -left-16 w-72 h-72 rounded-full bg-purple-400/30 blur-3xl" }), _jsx("div", { className: "absolute bottom-0 right-0 w-72 h-72 rounded-full bg-blue-400/30 blur-3xl" }), _jsxs("div", { className: "relative", children: [_jsxs("button", { type: "button", onClick: () => navigate("/"), className: "inline-flex items-center gap-2 text-blue-600 dark:text-blue-300 font-bold", children: [_jsx(GraduationCap, { className: "h-6 w-6" }), " DegreeMap"] }), _jsxs("h2", { className: "mt-12 text-4xl font-extrabold leading-tight", children: ["Start your ", _jsx("span", { className: "text-gradient", children: "CUNY journey" }), "."] }), _jsx("p", { className: "mt-4 text-slate-600 dark:text-slate-300 max-w-md", children: "Create a free account to start mapping semesters, exploring campuses, and tracking your progress toward graduation." }), _jsx("ul", { className: "mt-8 space-y-3", children: perks.map((p) => (_jsxs("li", { className: "flex items-center gap-2 text-slate-700 dark:text-slate-300", children: [_jsx(CheckCircle2, { className: "h-5 w-5 text-emerald-500" }), " ", p] }, p))) })] }), _jsx("p", { className: "relative text-xs text-slate-500 dark:text-slate-400", children: "No credit card. No spam. Free for every CUNY student." })] }), _jsx("div", { className: "flex items-center justify-center px-4 py-16", children: _jsxs("div", { className: "w-full max-w-md card-surface rounded-2xl p-8 shadow-xl animate-fade-in-up", children: [_jsxs("div", { className: "text-center mb-7", children: [_jsx("div", { className: "mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-md", children: _jsx(Sparkles, { className: "h-6 w-6" }) }), _jsx("h1", { className: "mt-4 text-2xl font-bold", children: "Create your account" }), _jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 mt-1", children: isDemoMode
                                        ? "Demo mode — your account is stored locally on this device."
                                        : "It only takes a few seconds." })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1.5", children: "Email" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com", className: "pl-9!", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1.5", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "At least 6 characters", className: "pl-9!", required: true, minLength: 6 })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1.5", children: "Confirm password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" }), _jsx("input", { type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "Repeat your password", className: "pl-9!", required: true, minLength: 6 })] })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all", children: loading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Creating account..."] })) : (_jsx(_Fragment, { children: "Create account" })) })] }), _jsxs("p", { className: "mt-6 text-center text-sm text-slate-600 dark:text-slate-400", children: ["Already have an account?", " ", _jsx("button", { type: "button", onClick: () => navigate("/login"), className: "text-blue-600 dark:text-blue-300 font-semibold hover:underline", children: "Sign in" })] })] }) })] }));
};
export default RegisterPage;
