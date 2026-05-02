/**
 * API client for communicating with the notification backend.
 * Logs every API call start, success, and failure.
 */

import { Log } from "logging-middleware";

const API_BASE_URL = "http://localhost:5000";

/** Notification shape from the backend */
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  read: boolean;
  createdAt: string;
}

/** Payload for creating a new notification */
export interface CreateNotificationPayload {
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
}

/**
 * Fetch all notifications from the backend.
 */
export async function fetchNotifications(): Promise<Notification[]> {
  Log("frontend", "info", "api", "Fetching notifications from backend");

  try {
    const response = await fetch(`${API_BASE_URL}/notifications`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: Notification[] = await response.json();
    Log("frontend", "info", "api", `Fetched ${data.length} notifications successfully`);
    return data;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    Log("frontend", "error", "api", `Failed to fetch notifications: ${msg}`);
    throw error;
  }
}

/**
 * Create a new notification.
 */
export async function createNotificationAPI(
  payload: CreateNotificationPayload
): Promise<Notification> {
  Log("frontend", "info", "api", `Creating notification: title="${payload.title}"`);

  try {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: Notification = await response.json();
    Log("frontend", "info", "api", `Notification created successfully: id=${data.id}`);
    return data;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    Log("frontend", "error", "api", `Failed to create notification: ${msg}`);
    throw error;
  }
}

/**
 * Mark a notification as read.
 */
export async function markAsReadAPI(id: string): Promise<Notification> {
  Log("frontend", "info", "api", `Marking notification as read: id=${id}`);

  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: Notification = await response.json();
    Log("frontend", "info", "api", `Notification marked as read: id=${id}`);
    return data;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    Log("frontend", "error", "api", `Failed to mark notification as read: ${msg}`);
    throw error;
  }
}

/**
 * Delete a notification.
 */
export async function deleteNotificationAPI(id: string): Promise<void> {
  Log("frontend", "info", "api", `Deleting notification: id=${id}`);

  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    Log("frontend", "info", "api", `Notification deleted: id=${id}`);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    Log("frontend", "error", "api", `Failed to delete notification: ${msg}`);
    throw error;
  }
}
