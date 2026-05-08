import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import schoolsRouter from "./routes/schools.js";

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

// Schools Routes
app.use("/api/schools", schoolsRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`✅ DegreeMap server running on http://localhost:${PORT}`);
});
