import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import schoolsRouter from "./routes/schools.js";
import usersRouter from "./routes/users.js";
import roadmapsRouter from "./routes/roadmaps.js";
import advisorRouter from "./routes/advisor.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed frontend origins. Comma-separated list in FRONTEND_URL, e.g.
// "http://localhost:5173,https://degreemap.example.com". Falls back to local
// Vite ports during development.
const allowedOrigins = (process.env.FRONTEND_URL ?? "http://localhost:5173,http://localhost:5174,http://localhost:5175")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow same-origin / curl (no Origin header) and any whitelisted origin.
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS: origin not allowed (${origin})`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

// Lightweight request log — keeps email/password out of the line.
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ success: true, message: "DegreeMap server is running 🎓" });
});

app.use("/api/auth", authRouter);
app.use("/api/schools", schoolsRouter);
app.use("/api/users", usersRouter);
app.use("/api/roadmaps", roadmapsRouter);
app.use("/api/advisor", advisorRouter);

// 404 for unknown /api routes
app.use("/api", (_req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// Centralized error handler so CORS rejections etc. return JSON, not HTML
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ success: false, message: err.message || "Server error" });
});

// On Vercel the app is imported by a serverless function (see api/[...path].ts),
// so we must NOT bind a port there. Vercel sets process.env.VERCEL=1.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅ DegreeMap server running on http://localhost:${PORT}`);
    console.log(`   Allowed CORS origins: ${allowedOrigins.join(", ") || "(none)"}`);
  });
}

export default app;
