import express, { Request, Response } from "express";
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

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ success: true, message: "DegreeMap server is running 🎓" });
});

// Auth Routes (No authentication required)
app.use("/api/auth", authRouter);

// Schools Routes
app.use("/api/schools", schoolsRouter);

// Users Routes (Protected with JWT)
app.use("/api/users", usersRouter);

// Roadmaps Routes (Protected with JWT)
app.use("/api/roadmaps", roadmapsRouter);

// Advisor Routes (Protected with JWT)
app.use("/api/advisor", advisorRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`✅ DegreeMap server running on http://localhost:${PORT}`);
});
