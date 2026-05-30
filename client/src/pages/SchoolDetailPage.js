import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, ExternalLink, GraduationCap, MapPin, Star, Users, } from "lucide-react";
import { getCampusById, cunyCampuses } from "../data/cunyCampuses";
import CampusMap from "../components/CampusMap";
import toast from "react-hot-toast";
const reviewsKey = (id) => `degreemap.reviews.${id}`;
const SchoolDetailPage = () => {
    const { id = "" } = useParams();
    const navigate = useNavigate();
    const campus = getCampusById(id);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [author, setAuthor] = useState("");
    const [body, setBody] = useState("");
    useEffect(() => {
        if (!campus)
            return;
        try {
            const raw = localStorage.getItem(reviewsKey(campus.id));
            setReviews(raw ? JSON.parse(raw) : []);
        }
        catch {
            setReviews([]);
        }
    }, [campus]);
    const avgRating = useMemo(() => {
        if (!reviews.length)
            return 0;
        return reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
    }, [reviews]);
    if (!campus) {
        return (_jsxs("div", { className: "max-w-3xl mx-auto px-4 py-20 text-center", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Campus not found" }), _jsx("p", { className: "text-slate-500 dark:text-slate-400 mt-2", children: "We couldn't find that CUNY campus." }), _jsxs("button", { type: "button", onClick: () => navigate("/explore"), className: "mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), " Back to Explore"] })] }));
    }
    const submitReview = (e) => {
        e.preventDefault();
        if (!author.trim() || !body.trim()) {
            toast.error("Add your name and a short review");
            return;
        }
        const review = {
            id: Math.random().toString(36).slice(2, 9),
            author: author.trim(),
            rating,
            body: body.trim(),
            createdAt: new Date().toISOString(),
        };
        const next = [review, ...reviews];
        setReviews(next);
        try {
            localStorage.setItem(reviewsKey(campus.id), JSON.stringify(next));
        }
        catch {
            /* ignore */
        }
        setAuthor("");
        setBody("");
        setRating(5);
        toast.success("Thanks for the review!");
    };
    return (_jsxs("div", { children: [_jsx("section", { className: "relative text-white", style: {
                    backgroundImage: `linear-gradient(135deg, ${campus.colors.from}cc, ${campus.colors.to}cc), url(${campus.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }, children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16", children: [_jsxs(Link, { to: "/explore", className: "inline-flex items-center gap-1.5 text-white/90 hover:text-white text-sm font-semibold mb-6", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), " Back to Explore"] }), _jsxs("div", { className: "flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-white/20 backdrop-blur border border-white/30", children: campus.type }), _jsx("h1", { className: "mt-3 text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow", children: campus.name }), _jsx("p", { className: "mt-2 text-white/85 max-w-2xl", children: campus.description })] }), _jsxs("div", { className: "flex flex-wrap gap-3 text-sm", children: [_jsxs("span", { className: "inline-flex items-center gap-1.5 bg-white/15 backdrop-blur border border-white/30 rounded-lg px-3 py-1.5", children: [_jsx(MapPin, { className: "h-4 w-4" }), " ", campus.borough] }), _jsxs("span", { className: "inline-flex items-center gap-1.5 bg-white/15 backdrop-blur border border-white/30 rounded-lg px-3 py-1.5", children: [_jsx(Calendar, { className: "h-4 w-4" }), " Founded ", campus.founded] }), _jsxs("span", { className: "inline-flex items-center gap-1.5 bg-white/15 backdrop-blur border border-white/30 rounded-lg px-3 py-1.5", children: [_jsx(Users, { className: "h-4 w-4" }), " ", campus.students] })] })] })] }) }), _jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "card-surface rounded-2xl p-6 shadow-sm", children: [_jsxs("h2", { className: "text-lg font-bold mb-3 inline-flex items-center gap-2", children: [_jsx(GraduationCap, { className: "h-5 w-5 text-blue-500" }), " Notable programs"] }), _jsx("div", { className: "flex flex-wrap gap-2", children: campus.notablePrograms.map((p) => (_jsx("span", { className: "px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20", children: p }, p))) })] }), _jsx("div", { className: "card-surface rounded-2xl p-2 shadow-sm", children: _jsx(CampusMap, { campuses: [campus], height: "320px" }) }), _jsxs("div", { className: "card-surface rounded-2xl p-6 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("h2", { className: "text-lg font-bold", children: "Student reviews" }), reviews.length > 0 && (_jsxs("span", { className: "inline-flex items-center gap-1 text-sm font-semibold", children: [_jsx(Star, { className: "h-4 w-4 fill-amber-400 text-amber-400" }), avgRating.toFixed(1), _jsxs("span", { className: "text-slate-500 dark:text-slate-400 font-normal", children: ["\u00B7 ", reviews.length, " review", reviews.length === 1 ? "" : "s"] })] }))] }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Reviews are stored locally on your device." }), _jsxs("form", { onSubmit: submitReview, className: "mt-4 space-y-3", children: [_jsxs("div", { className: "grid grid-cols-12 gap-2", children: [_jsx("input", { "aria-label": "Your name", value: author, onChange: (e) => setAuthor(e.target.value), placeholder: "Your name", className: "col-span-12 sm:col-span-7" }), _jsxs("div", { className: "col-span-12 sm:col-span-5 flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900/40", children: [_jsx("span", { className: "text-xs text-slate-500 dark:text-slate-400 mr-1", children: "Rating" }), [1, 2, 3, 4, 5].map((n) => (_jsx("button", { type: "button", onClick: () => setRating(n), "aria-label": `${n} star${n === 1 ? "" : "s"}`, children: _jsx(Star, { className: `h-5 w-5 ${n <= rating
                                                                        ? "fill-amber-400 text-amber-400"
                                                                        : "text-slate-300 dark:text-slate-600"}` }) }, n)))] })] }), _jsx("textarea", { "aria-label": "Your review", value: body, onChange: (e) => setBody(e.target.value), placeholder: "Share what you loved (or didn't) about this campus...", rows: 3 }), _jsx("button", { type: "submit", className: "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold", children: "Post review" })] }), _jsxs("div", { className: "mt-6 space-y-4", children: [reviews.length === 0 && (_jsx("p", { className: "text-sm italic text-slate-500 dark:text-slate-400", children: "No reviews yet. Be the first to share your experience." })), reviews.map((r) => (_jsxs("div", { className: "rounded-xl border border-slate-200 dark:border-slate-700 p-4", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("p", { className: "font-semibold", children: r.author }), _jsx("div", { className: "flex items-center gap-0.5", children: [1, 2, 3, 4, 5].map((n) => (_jsx(Star, { className: `h-3.5 w-3.5 ${n <= r.rating
                                                                        ? "fill-amber-400 text-amber-400"
                                                                        : "text-slate-300 dark:text-slate-600"}` }, n))) })] }), _jsx("p", { className: "mt-1 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line", children: r.body }), _jsx("p", { className: "mt-2 text-xs text-slate-400", children: new Date(r.createdAt).toLocaleDateString() })] }, r.id)))] })] })] }), _jsxs("aside", { className: "space-y-6", children: [_jsxs("div", { className: "card-surface rounded-2xl p-6 shadow-sm", children: [_jsx("h3", { className: "font-bold mb-3", children: "At a glance" }), _jsxs("dl", { className: "text-sm space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-slate-500 dark:text-slate-400", children: "Type" }), _jsx("dd", { className: "font-medium", children: campus.type })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-slate-500 dark:text-slate-400", children: "Borough" }), _jsx("dd", { className: "font-medium", children: campus.borough })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-slate-500 dark:text-slate-400", children: "Founded" }), _jsx("dd", { className: "font-medium", children: campus.founded })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-slate-500 dark:text-slate-400", children: "Students" }), _jsx("dd", { className: "font-medium", children: campus.students })] })] }), _jsxs("a", { href: campus.website, target: "_blank", rel: "noopener noreferrer", className: "mt-5 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold w-full justify-center", children: ["Visit website ", _jsx(ExternalLink, { className: "h-3.5 w-3.5" })] })] }), _jsxs("div", { className: "card-surface rounded-2xl p-6 shadow-sm", children: [_jsx("h3", { className: "font-bold mb-3", children: "Nearby CUNY campuses" }), _jsx("ul", { className: "space-y-2", children: cunyCampuses
                                            .filter((c) => c.id !== campus.id && c.borough === campus.borough)
                                            .slice(0, 5)
                                            .map((c) => (_jsx("li", { children: _jsxs(Link, { to: `/schools/${c.id}`, className: "block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors", children: [_jsx("p", { className: "text-sm font-semibold", children: c.shortName }), _jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: c.type })] }) }, c.id))) })] })] })] })] }));
};
export default SchoolDetailPage;
