/**
 * NotificationList — Renders the list of all notifications.
 * Shows loading state, empty state, and the notification cards.
 */

import { useEffect } from "react";
import { Log } from "logging-middleware";
import type { Notification } from "../api/notifications";
import { NotificationCard } from "./NotificationCard";

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationList({
  notifications,
  loading,
  error,
  onMarkAsRead,
  onDelete,
}: NotificationListProps) {
  useEffect(() => {
    Log(
      "frontend",
      "debug",
      "component",
      `NotificationList mounted with ${notifications.length} items`
    );
  }, [notifications.length]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notification-list-container" id="notification-list">
      {/* Header with count */}
      <div className="list-header">
        <h2 className="list-title">
          Notifications
          {unreadCount > 0 && (
            <span className="unread-count">{unreadCount}</span>
          )}
        </h2>
        <p className="list-subtitle">
          {notifications.length === 0
            ? "No notifications yet"
            : `${notifications.length} total · ${unreadCount} unread`}
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="error-banner" id="error-banner">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="loading-container" id="loading-spinner">
          <div className="spinner" />
          <p>Loading notifications...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && notifications.length === 0 && !error && (
        <div className="empty-state" id="empty-state">
          <div className="empty-icon">🔔</div>
          <h3>All caught up!</h3>
          <p>No notifications to show. Create one using the form above.</p>
        </div>
      )}

      {/* Notification cards */}
      {!loading && notifications.length > 0 && (
        <div className="notification-cards">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
