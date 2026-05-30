import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  GraduationCap,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import { getCampusById, cunyCampuses } from "../data/cunyCampuses";
import CampusMap from "../components/CampusMap";
import toast from "react-hot-toast";

interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  body: string;
  createdAt: string;
}

const reviewsKey = (id: string) => `degreemap.reviews.${id}`;

const SchoolDetailPage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const campus = getCampusById(id);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!campus) return;
    try {
      const raw = localStorage.getItem(reviewsKey(campus.id));
      setReviews(raw ? (JSON.parse(raw) as Review[]) : []);
    } catch {
      setReviews([]);
    }
  }, [campus]);

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  }, [reviews]);

  if (!campus) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Campus not found</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          We couldn't find that CUNY campus.
        </p>
        <button
          type="button"
          onClick={() => navigate("/explore")}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </button>
      </div>
    );
  }

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !body.trim()) {
      toast.error("Add your name and a short review");
      return;
    }
    const review: Review = {
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
    } catch {
      /* ignore */
    }
    setAuthor("");
    setBody("");
    setRating(5);
    toast.success("Thanks for the review!");
  };

  return (
    <div>
      {/* Hero */}
      <section
        className="relative text-white"
        style={{
          backgroundImage: `linear-gradient(135deg, ${campus.colors.from}cc, ${campus.colors.to}cc), url(${campus.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-white/90 hover:text-white text-sm font-semibold mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Explore
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-white/20 backdrop-blur border border-white/30">
                {campus.type}
              </span>
              <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow">
                {campus.name}
              </h1>
              <p className="mt-2 text-white/85 max-w-2xl">{campus.description}</p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur border border-white/30 rounded-lg px-3 py-1.5">
                <MapPin className="h-4 w-4" /> {campus.borough}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur border border-white/30 rounded-lg px-3 py-1.5">
                <Calendar className="h-4 w-4" /> Founded {campus.founded}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur border border-white/30 rounded-lg px-3 py-1.5">
                <Users className="h-4 w-4" /> {campus.students}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Programs */}
          <div className="card-surface rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-3 inline-flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-500" /> Notable programs
            </h2>
            <div className="flex flex-wrap gap-2">
              {campus.notablePrograms.map((p) => (
                <span
                  key={p}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="card-surface rounded-2xl p-2 shadow-sm">
            <CampusMap campuses={[campus]} height="320px" />
          </div>

          {/* Reviews */}
          <div className="card-surface rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold">Student reviews</h2>
              {reviews.length > 0 && (
                <span className="inline-flex items-center gap-1 text-sm font-semibold">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {avgRating.toFixed(1)}
                  <span className="text-slate-500 dark:text-slate-400 font-normal">
                    · {reviews.length} review{reviews.length === 1 ? "" : "s"}
                  </span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reviews are stored locally on your device.
            </p>

            <form onSubmit={submitReview} className="mt-4 space-y-3">
              <div className="grid grid-cols-12 gap-2">
                <input
                  aria-label="Your name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Your name"
                  className="col-span-12 sm:col-span-7"
                />
                <div className="col-span-12 sm:col-span-5 flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900/40">
                  <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">Rating</span>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => setRating(n)}
                      aria-label={`${n} star${n === 1 ? "" : "s"}`}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          n <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 dark:text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                aria-label="Your review"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Share what you loved (or didn't) about this campus..."
                rows={3}
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Post review
              </button>
            </form>

            <div className="mt-6 space-y-4">
              {reviews.length === 0 && (
                <p className="text-sm italic text-slate-500 dark:text-slate-400">
                  No reviews yet. Be the first to share your experience.
                </p>
              )}
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{r.author}</p>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`h-3.5 w-3.5 ${
                            n <= r.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">
                    {r.body}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side column */}
        <aside className="space-y-6">
          <div className="card-surface rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-3">At a glance</h3>
            <dl className="text-sm space-y-2">
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Type</dt>
                <dd className="font-medium">{campus.type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Borough</dt>
                <dd className="font-medium">{campus.borough}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Founded</dt>
                <dd className="font-medium">{campus.founded}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Students</dt>
                <dd className="font-medium">{campus.students}</dd>
              </div>
            </dl>
            <a
              href={campus.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold w-full justify-center"
            >
              Visit website <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="card-surface rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-3">Nearby CUNY campuses</h3>
            <ul className="space-y-2">
              {cunyCampuses
                .filter((c) => c.id !== campus.id && c.borough === campus.borough)
                .slice(0, 5)
                .map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/schools/${c.id}`}
                      className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <p className="text-sm font-semibold">{c.shortName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{c.type}</p>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SchoolDetailPage;
