/**
 * Notification request handlers.
 * Validates input, delegates to service layer, and sends responses.
 */

import { Request, Response } from "express";
import { Log } from "logging-middleware";
import {
  listNotifications,
  createNotification,
  markNotificationAsRead,
  removeNotification,
} from "../services/notifications";

const VALID_TYPES = ["info", "warning", "error", "success"];

/**
 * GET /notifications — Fetch all notifications.
 */
export function handleGetNotifications(req: Request, res: Response): void {
  Log("backend", "info", "handler", "Handling GET /notifications");

  try {
    const notifications = listNotifications();
    Log("backend", "info", "handler", `Returning ${notifications.length} notifications`);
    res.status(200).json(notifications);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    Log("backend", "error", "handler", `Error fetching notifications: ${msg}`);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * POST /notifications — Create a new notification.
 */
export function handleCreateNotification(req: Request, res: Response): void {
  Log("backend", "info", "handler", "Handling POST /notifications");

  try {
    const { title, message, type } = req.body;

    // Input validation
    if (!title || typeof title !== "string") {
      Log("backend", "warn", "handler", "Validation failed: title is required and must be a string");
      res.status(400).json({ error: "title is required and must be a string" });
      return;
    }

    if (!message || typeof message !== "string") {
      Log("backend", "warn", "handler", "Validation failed: message is required and must be a string");
      res.status(400).json({ error: "message is required and must be a string" });
      return;
    }

    if (type && !VALID_TYPES.includes(type)) {
      Log("backend", "warn", "handler", `Validation failed: invalid type "${type}"`);
      res.status(400).json({ error: `type must be one of: ${VALID_TYPES.join(", ")}` });
      return;
    }

    Log("backend", "info", "handler", `Creating notification: title="${title}", type="${type || "info"}"`);
    const notification = createNotification({
      title,
      message,
      type: type || "info",
    });

    Log("backend", "info", "handler", `Notification created: id=${notification.id}`);
    res.status(201).json(notification);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    Log("backend", "error", "handler", `Error creating notification: ${msg}`);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * PATCH /notifications/:id — Mark notification as read.
 */
export function handleUpdateNotification(req: Request, res: Response): void {
  const { id } = req.params;
  Log("backend", "info", "handler", `Handling PATCH /notifications/${id}`);

  try {
    const { read } = req.body;

    if (typeof read !== "boolean") {
      Log("backend", "warn", "handler", "Validation failed: received non-boolean value for read");
      res.status(400).json({ error: "read must be a boolean" });
      return;
    }

    const updated = markNotificationAsRead(id, { read });

    if (!updated) {
      Log("backend", "warn", "handler", `Notification not found: id=${id}`);
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    Log("backend", "info", "handler", `Notification updated: id=${id}, read=${read}`);
    res.status(200).json(updated);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    Log("backend", "error", "handler", `Error updating notification: ${msg}`);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * DELETE /notifications/:id — Delete a notification.
 */
export function handleDeleteNotification(req: Request, res: Response): void {
  const { id } = req.params;
  Log("backend", "info", "handler", `Handling DELETE /notifications/${id}`);

  try {
    const deleted = removeNotification(id);

    if (!deleted) {
      Log("backend", "warn", "handler", `Notification not found for deletion: id=${id}`);
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    Log("backend", "info", "handler", `Notification deleted: id=${id}`);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    Log("backend", "error", "handler", `Error deleting notification: ${msg}`);
    res.status(500).json({ error: "Internal server error" });
  }
}
