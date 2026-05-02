/**
 * App root component — sets up the logging token and renders the main page.
 */

import { useEffect } from "react";
import { setToken, Log } from "logging-middleware";
import { NotificationsPage } from "./pages/index";
import "./styles/index.css";

// Set the auth token for logging middleware
const AUTH_TOKEN = import.meta.env.VITE_AFFORDMED_TOKEN || "";

function App() {
  useEffect(() => {
    if (AUTH_TOKEN) {
      setToken(AUTH_TOKEN);
      Log("frontend", "info", "config", "Auth token configured for logging middleware");
    } else {
      console.warn("[App] VITE_AFFORDMED_TOKEN not set — logging to eval server disabled");
    }

    Log("frontend", "info", "page", "App component mounted — application started");
  }, []);

  return <NotificationsPage />;
}

export default App;
