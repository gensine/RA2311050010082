/**
 * CreateNotificationForm — Form to create new notifications.
 * Supports title, message, and type selection with validation.
 */

import { useState, useEffect, FormEvent } from "react";
import { Log } from "logging-middleware";
import type { CreateNotificationPayload } from "../api/notifications";

interface CreateNotificationFormProps {
  onSubmit: (payload: CreateNotificationPayload) => Promise<unknown>;
}

const NOTIFICATION_TYPES = [
  { value: "info", label: "ℹ️ Info", color: "#60a5fa" },
  { value: "warning", label: "⚠️ Warning", color: "#fbbf24" },
  { value: "error", label: "❌ Error", color: "#f87171" },
  { value: "success", label: "✅ Success", color: "#34d399" },
] as const;

export function CreateNotificationForm({ onSubmit }: CreateNotificationFormProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "warning" | "error" | "success">("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    Log("frontend", "debug", "component", "CreateNotificationForm mounted");
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      Log("frontend", "warn", "component", "Form validation failed: empty fields");
      return;
    }

    Log("frontend", "info", "component", `Form submitted: title="${title}", type="${type}"`);
    setIsSubmitting(true);

    try {
      await onSubmit({ title: title.trim(), message: message.trim(), type });
      Log("frontend", "info", "component", "Notification created from form successfully");

      // Reset form
      setTitle("");
      setMessage("");
      setType("info");

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch {
      Log("frontend", "error", "component", "Form submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className={`create-form ${showSuccess ? "form-success" : ""}`}
      onSubmit={handleSubmit}
      id="create-notification-form"
    >
      <h2 className="form-title">✨ Create Notification</h2>

      <div className="form-grid">
        {/* Title input */}
        <div className="form-group">
          <label htmlFor="notification-title" className="form-label">
            Title
          </label>
          <input
            id="notification-title"
            type="text"
            className="form-input"
            placeholder="Enter notification title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        {/* Type selector */}
        <div className="form-group">
          <label className="form-label">Type</label>
          <div className="type-selector">
            {NOTIFICATION_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                className={`type-btn ${type === t.value ? "active" : ""}`}
                onClick={() => setType(t.value)}
                style={
                  type === t.value
                    ? { borderColor: t.color, backgroundColor: `${t.color}20` }
                    : {}
                }
                id={`type-btn-${t.value}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message textarea */}
        <div className="form-group form-group-full">
          <label htmlFor="notification-message" className="form-label">
            Message
          </label>
          <textarea
            id="notification-message"
            className="form-textarea"
            placeholder="Enter notification message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            maxLength={500}
          />
          <span className="char-count">{message.length}/500</span>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className={`submit-btn ${isSubmitting ? "submitting" : ""}`}
        disabled={isSubmitting || !title.trim() || !message.trim()}
        id="submit-notification-btn"
      >
        {isSubmitting ? (
          <>
            <div className="btn-spinner" />
            Sending...
          </>
        ) : showSuccess ? (
          "✅ Created!"
        ) : (
          "🚀 Create Notification"
        )}
      </button>
    </form>
  );
}
