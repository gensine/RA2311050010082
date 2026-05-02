/**
 * Express server entry point.
 * Configures middleware, mounts routes, and starts the server.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Log, setToken } from "logging-middleware";
import notificationRoutes from "./routes/notifications";

// Load environment variables from .env
dotenv.config();

// Set the auth token for the logging middleware
const token = process.env.AFFORDMED_TOKEN || "";
if (token) {
  setToken(token);
  Log("backend", "info", "config", "Auth token loaded from environment");
} else {
  console.warn("[server] AFFORDMED_TOKEN not set in .env — logging will be disabled");
}

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────

// Enable CORS for frontend
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json());

// Log every incoming request
app.use((req, _res, next) => {
  Log("backend", "info", "middleware", `Incoming request: ${req.method} ${req.path}`);
  next();
});

// ─── Routes ──────────────────────────────────────────────────────────────────

app.use("/notifications", notificationRoutes);

// Health check
app.get("/health", (_req, res) => {
  Log("backend", "debug", "route", "Health check endpoint hit");
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Start Server ────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  Log("backend", "info", "config", `Server started on port ${PORT}`);
  console.log(`🚀 Notification backend running at http://localhost:${PORT}`);
});

export default app;
