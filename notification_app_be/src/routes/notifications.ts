/**
 * Notification routes — maps HTTP endpoints to handlers.
 */

import { Router } from "express";
import { Log } from "logging-middleware";
import {
  handleGetNotifications,
  handleCreateNotification,
  handleUpdateNotification,
  handleDeleteNotification,
} from "../handlers/notifications";

const router = Router();

// Log every route hit via middleware
router.use((req, _res, next) => {
  Log("backend", "info", "route", `${req.method} ${req.originalUrl} — route hit`);
  next();
});

// CRUD endpoints
router.get("/", handleGetNotifications);
router.post("/", handleCreateNotification);
router.patch("/:id", handleUpdateNotification);
router.delete("/:id", handleDeleteNotification);

Log("backend", "info", "route", "Notification routes registered");

export default router;
