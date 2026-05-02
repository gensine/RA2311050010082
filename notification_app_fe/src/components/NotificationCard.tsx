/**
 * NotificationCard — Displays a single notification with actions.
 * Shows read/unread state, type indicator, and action buttons.
 */

import { useEffect } from "react";
import { Log } from "logging-middleware";
import type { Notification } from "../api/notifications";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

/** Maps notification types to emoji indicators */
const typeIcons: Record<string, string> = {
  info: "ℹ️",
  warning: "⚠️",
  error: "❌",
  success: "✅",
};

export function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationCardProps) {
  useEffect(() => {
    Log("frontend", "debug", "component", `NotificationCard mounted: id=${notification.id}`);
  }, [notification.id]);

  /** Format the creation timestamp */
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`notification-card ${notification.read ? "read" : "unread"} type-${notification.type}`}
      id={`notification-${notification.id}`}
    >
      {/* Unread indicator dot */}
      {!notification.read && <div className="unread-dot" />}

      {/* Type icon */}
      <div className="notification-type-icon">
        {typeIcons[notification.type] || "📋"}
      </div>

      {/* Content */}
      <div className="notification-content">
        <div className="notification-header">
          <h3 className="notification-title">{notification.title}</h3>
          <span className={`notification-badge badge-${notification.type}`}>
            {notification.type}
          </span>
        </div>
        <p className="notification-message">{notification.message}</p>
        <span className="notification-time">{formatDate(notification.createdAt)}</span>
      </div>

      {/* Actions */}
      <div className="notification-actions">
        {!notification.read && (
          <button
            className="btn btn-read"
            onClick={() => onMarkAsRead(notification.id)}
            title="Mark as read"
            id={`btn-read-${notification.id}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        )}
        <button
          className="btn btn-delete"
          onClick={() => onDelete(notification.id)}
          title="Delete"
          id={`btn-delete-${notification.id}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
