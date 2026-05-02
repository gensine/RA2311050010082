/**
 * Logging Middleware — Reusable package for sending structured log entries
 * to the evaluation server.
 *
 * Usage:
 *   import { Log, setToken } from "logging-middleware";
 *   setToken("your-bearer-token");
 *   await Log("frontend", "info", "component", "NotificationList mounted");
 */

// ─── Configuration ───────────────────────────────────────────────────────────

const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

/** In-memory token store — can be set at runtime or via environment variable */
let _token: string = "";

// ─── Allowed Values ──────────────────────────────────────────────────────────

const ALLOWED_STACKS = ["backend", "frontend"] as const;
const ALLOWED_LEVELS = ["debug", "info", "warn", "error", "fatal"] as const;
const ALLOWED_PACKAGES_BACKEND = [
  "cache", "controller", "cron_job", "db", "handler",
  "repository", "route", "service",
] as const;
const ALLOWED_PACKAGES_FRONTEND = [
  "api", "component", "hook", "page", "state", "style",
] as const;
const ALLOWED_PACKAGES_BOTH = [
  "auth", "config", "middleware", "utils",
] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

type Stack = typeof ALLOWED_STACKS[number];
type Level = typeof ALLOWED_LEVELS[number];
type PackageBackend = typeof ALLOWED_PACKAGES_BACKEND[number];
type PackageFrontend = typeof ALLOWED_PACKAGES_FRONTEND[number];
type PackageBoth = typeof ALLOWED_PACKAGES_BOTH[number];
type Package = PackageBackend | PackageFrontend | PackageBoth;

interface LogPayload {
  stack: string;
  level: string;
  package: string;
  message: string;
}

interface LogResponse {
  logID: string;
  message: string;
}

// ─── Token Management ────────────────────────────────────────────────────────

/**
 * Sets the Bearer token at runtime.
 * Call this once during app initialization.
 */
export function setToken(token: string): void {
  _token = token;
}

/**
 * Retrieves the current token — checks runtime store first, then env variable.
 */
export function getToken(): string {
  if (_token) return _token;

  // Fallback to environment variable
  const envToken =
    typeof process !== "undefined" ? process.env?.AFFORDMED_TOKEN : undefined;
  if (envToken) return envToken;

  return "";
}

// ─── Validation Helpers ──────────────────────────────────────────────────────

function isValidStack(stack: string): stack is Stack {
  return (ALLOWED_STACKS as readonly string[]).includes(stack);
}

function isValidLevel(level: string): level is Level {
  return (ALLOWED_LEVELS as readonly string[]).includes(level);
}

function isValidPackage(stack: string, pkg: string): boolean {
  if ((ALLOWED_PACKAGES_BOTH as readonly string[]).includes(pkg)) return true;
  if (stack === "backend") {
    return (ALLOWED_PACKAGES_BACKEND as readonly string[]).includes(pkg);
  }
  if (stack === "frontend") {
    return (ALLOWED_PACKAGES_FRONTEND as readonly string[]).includes(pkg);
  }
  return false;
}

// ─── Core Log Function ──────────────────────────────────────────────────────

/**
 * Sends a structured log entry to the evaluation server.
 *
 * @param stack   - "backend" or "frontend"
 * @param level   - "debug" | "info" | "warn" | "error" | "fatal"
 * @param pkg     - The package/layer originating the log (e.g., "component", "handler")
 * @param message - A descriptive log message
 *
 * @returns The log response if successful, or null if the call failed.
 *          Never throws — errors are caught and logged to console.
 */
export async function Log(
  stack: string,
  level: string,
  pkg: string,
  message: string
): Promise<LogResponse | null> {
  try {
    // Validate inputs
    if (!isValidStack(stack)) {
      console.warn(`[logging-middleware] Invalid stack: "${stack}". Allowed: ${ALLOWED_STACKS.join(", ")}`);
      return null;
    }

    if (!isValidLevel(level)) {
      console.warn(`[logging-middleware] Invalid level: "${level}". Allowed: ${ALLOWED_LEVELS.join(", ")}`);
      return null;
    }

    if (!isValidPackage(stack, pkg)) {
      console.warn(`[logging-middleware] Invalid package "${pkg}" for stack "${stack}".`);
      return null;
    }

    // Get auth token
    const token = getToken();
    if (!token) {
      console.warn("[logging-middleware] No auth token set. Call setToken() or set AFFORDMED_TOKEN env variable.");
      return null;
    }

    // Build payload
    const payload: LogPayload = {
      stack,
      level,
      package: pkg,
      message,
    };

    // Send log to evaluation server
    const response = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn(
        `[logging-middleware] Log API returned ${response.status}: ${response.statusText}`
      );
      return null;
    }

    const data: LogResponse = await response.json();
    return data;
  } catch (error: unknown) {
    // Graceful error handling — never crash the calling application
    const errMsg = error instanceof Error ? error.message : String(error);
    console.warn(`[logging-middleware] Failed to send log: ${errMsg}`);
    return null;
  }
}

// Default export for convenience
export default Log;
