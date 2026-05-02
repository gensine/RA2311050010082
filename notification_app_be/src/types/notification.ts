/**
 * Notification type definitions
 */

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  read: boolean;
  createdAt: string;
}

export interface CreateNotificationDTO {
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
}

export interface UpdateNotificationDTO {
  read?: boolean;
}
