/**
 * NotificationsPage — Main page component.
 * Combines the form and list, manages top-level state.
 */

import { useEffect } from "react";
import { Log } from "logging-middleware";
import { useNotifications } from "../hooks/useNotifications";
import { CreateNotificationForm } from "../components/CreateNotificationForm";
import { NotificationList } from "../components/NotificationList";

export function NotificationsPage() {
  useEffect(() => {
    Log("frontend", "info", "page", "Notifications page loaded");
  }, []);

  const {
    notifications,
    loading,
    error,
    addNotification,
    markAsRead,
    deleteNotification,
  } = useNotifications();

  return (
    <div className="page-container" id="notifications-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <div className="header-glow" />
          <h1 className="page-title">
            <span className="title-icon">🔔</span>
            Notification Center
          </h1>
          <p className="page-subtitle">
            Manage your notifications in real-time
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="page-main">
        {/* Create form */}
        <section className="section-form">
          <CreateNotificationForm onSubmit={addNotification} />
        </section>

        {/* Notification list */}
        <section className="section-list">
          <NotificationList
            notifications={notifications}
            loading={loading}
            error={error}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="page-footer">
        <p>Notification App — Built with React + TypeScript</p>
      </footer>
    </div>
  );
}
