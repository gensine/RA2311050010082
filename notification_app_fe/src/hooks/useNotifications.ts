/**
 * Custom hook for managing notification data.
 * Wraps the API layer and state management with logging.
 */

import { useReducer, useEffect, useCallback } from "react";
import { Log } from "logging-middleware";
import {
  fetchNotifications,
  createNotificationAPI,
  markAsReadAPI,
  deleteNotificationAPI,
} from "../api/notifications";
import type { CreateNotificationPayload } from "../api/notifications";
import {
  notificationReducer,
  initialState,
} from "../state/notificationState";

export function useNotifications() {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  Log("frontend", "debug", "hook", "useNotifications hook initialized");

  /** Fetch all notifications from the backend */
  const loadNotifications = useCallback(async () => {
    Log("frontend", "debug", "hook", "useNotifications: fetching data");
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const data = await fetchNotifications();
      dispatch({ type: "SET_NOTIFICATIONS", payload: data });
      Log("frontend", "debug", "hook", `useNotifications: data refreshed, ${data.length} items`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      dispatch({ type: "SET_ERROR", payload: msg });
      Log("frontend", "error", "hook", `useNotifications: fetch failed: ${msg}`);
    }
  }, []);

  /** Create a new notification */
  const addNotification = useCallback(async (payload: CreateNotificationPayload) => {
    Log("frontend", "debug", "hook", `useNotifications: creating notification "${payload.title}"`);

    try {
      const created = await createNotificationAPI(payload);
      dispatch({ type: "ADD_NOTIFICATION", payload: created });
      Log("frontend", "debug", "hook", `useNotifications: notification added id=${created.id}`);
      return created;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      dispatch({ type: "SET_ERROR", payload: msg });
      Log("frontend", "error", "hook", `useNotifications: create failed: ${msg}`);
      throw error;
    }
  }, []);

  /** Mark a notification as read */
  const markAsRead = useCallback(async (id: string) => {
    Log("frontend", "debug", "hook", `useNotifications: marking as read id=${id}`);

    try {
      await markAsReadAPI(id);
      dispatch({ type: "MARK_AS_READ", payload: id });
      Log("frontend", "debug", "hook", `useNotifications: marked as read id=${id}`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      dispatch({ type: "SET_ERROR", payload: msg });
      Log("frontend", "error", "hook", `useNotifications: mark as read failed: ${msg}`);
    }
  }, []);

  /** Delete a notification */
  const deleteNotification = useCallback(async (id: string) => {
    Log("frontend", "debug", "hook", `useNotifications: deleting id=${id}`);

    try {
      await deleteNotificationAPI(id);
      dispatch({ type: "DELETE_NOTIFICATION", payload: id });
      Log("frontend", "debug", "hook", `useNotifications: deleted id=${id}`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      dispatch({ type: "SET_ERROR", payload: msg });
      Log("frontend", "error", "hook", `useNotifications: delete failed: ${msg}`);
    }
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    Log("frontend", "debug", "hook", "useNotifications: initial data load");
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications: state.notifications,
    loading: state.loading,
    error: state.error,
    loadNotifications,
    addNotification,
    markAsRead,
    deleteNotification,
  };
}
