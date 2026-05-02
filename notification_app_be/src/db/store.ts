/**
 * In-memory data store for notifications.
 * Uses a Map for O(1) lookups by ID.
 */

import { Log } from "logging-middleware";
import { Notification } from "../types/notification";

// In-memory store — Map<id, Notification>
const store = new Map<string, Notification>();

/**
 * Retrieve all notifications, sorted by creation date (newest first).
 */
export function getAllNotifications(): Notification[] {
  Log("backend", "debug", "db", "Fetching all notifications from store");
  const notifications = Array.from(store.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  Log("backend", "info", "db", `Retrieved ${notifications.length} notifications from store`);
  return notifications;
}

/**
 * Retrieve a single notification by ID.
 */
export function getNotificationById(id: string): Notification | undefined {
  Log("backend", "debug", "db", `Looking up notification: id=${id}`);
  return store.get(id);
}

/**
 * Save a new notification to the store.
 */
export function saveNotification(notification: Notification): Notification {
  Log("backend", "info", "db", `Storing notification in memory: id=${notification.id}`);
  store.set(notification.id, notification);
  return notification;
}

/**
 * Update an existing notification in the store.
 */
export function updateNotification(
  id: string,
  updates: Partial<Notification>
): Notification | undefined {
  const existing = store.get(id);
  if (!existing) {
    Log("backend", "warn", "db", `Notification not found for update: id=${id}`);
    return undefined;
  }

  const updated = { ...existing, ...updates };
  store.set(id, updated);
  Log("backend", "info", "db", `Updated notification in store: id=${id}`);
  return updated;
}

/**
 * Delete a notification from the store.
 */
export function deleteNotificationById(id: string): boolean {
  const existed = store.has(id);
  if (!existed) {
    Log("backend", "warn", "db", `Notification not found for deletion: id=${id}`);
    return false;
  }

  store.delete(id);
  Log("backend", "info", "db", `Deleted notification from store: id=${id}`);
  return true;
}
