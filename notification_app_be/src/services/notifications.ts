/**
 * Notification service — business logic layer.
 * Orchestrates operations between handlers and the data store.
 */

import { v4 as uuidv4 } from "uuid";
import { Log } from "logging-middleware";
import {
  Notification,
  CreateNotificationDTO,
  UpdateNotificationDTO,
} from "../types/notification";
import {
  getAllNotifications,
  getNotificationById,
  saveNotification,
  updateNotification,
  deleteNotificationById,
} from "../db/store";

/**
 * Fetch all notifications.
 */
export function listNotifications(): Notification[] {
  Log("backend", "info", "service", "Listing all notifications");
  const notifications = getAllNotifications();
  Log("backend", "info", "service", `Found ${notifications.length} notifications`);
  return notifications;
}

/**
 * Create a new notification.
 */
export function createNotification(dto: CreateNotificationDTO): Notification {
  Log("backend", "info", "service", `Creating notification: title="${dto.title}"`);

  const notification: Notification = {
    id: uuidv4(),
    title: dto.title,
    message: dto.message,
    type: dto.type || "info",
    read: false,
    createdAt: new Date().toISOString(),
  };

  const saved = saveNotification(notification);
  Log("backend", "info", "service", `Notification created successfully: id=${saved.id}`);
  return saved;
}

/**
 * Mark a notification as read (or update other fields).
 */
export function markNotificationAsRead(
  id: string,
  dto: UpdateNotificationDTO
): Notification | null {
  Log("backend", "info", "service", `Updating notification: id=${id}`);

  const existing = getNotificationById(id);
  if (!existing) {
    Log("backend", "warn", "service", `Notification not found: id=${id}`);
    return null;
  }

  const updated = updateNotification(id, dto);
  if (updated) {
    Log("backend", "info", "service", `Notification updated: id=${id}, read=${updated.read}`);
  }
  return updated || null;
}

/**
 * Delete a notification by ID.
 */
export function removeNotification(id: string): boolean {
  Log("backend", "info", "service", `Deleting notification: id=${id}`);

  const result = deleteNotificationById(id);
  if (result) {
    Log("backend", "info", "service", `Notification deleted: id=${id}`);
  } else {
    Log("backend", "warn", "service", `Delete failed — notification not found: id=${id}`);
  }
  return result;
}
