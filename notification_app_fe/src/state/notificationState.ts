/**
 * State management helpers for notifications.
 * Provides typed actions for state transitions with logging.
 */

import { Log } from "logging-middleware";
import type { Notification } from "../api/notifications";

/** All possible state action types */
export type NotificationAction =
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "DELETE_NOTIFICATION"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

/** Application state shape */
export interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

/** Initial state */
export const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

/**
 * Reducer function for notification state management.
 * Logs every state transition.
 */
export function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case "SET_NOTIFICATIONS":
      Log("frontend", "debug", "state", `State updated: loaded ${action.payload.length} notifications`);
      return { ...state, notifications: action.payload, loading: false, error: null };

    case "ADD_NOTIFICATION":
      Log("frontend", "debug", "state", `State updated: added notification id=${action.payload.id}`);
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    case "MARK_AS_READ":
      Log("frontend", "debug", "state", `State updated: notification marked as read id=${action.payload}`);
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case "DELETE_NOTIFICATION":
      Log("frontend", "debug", "state", `State updated: deleted notification id=${action.payload}`);
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };

    case "SET_LOADING":
      Log("frontend", "debug", "state", `State updated: loading=${action.payload}`);
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      if (action.payload) {
        Log("frontend", "error", "state", `State error: ${action.payload}`);
      }
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
}
