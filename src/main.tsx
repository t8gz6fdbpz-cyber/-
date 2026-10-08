import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/local-fonts.css";

// Audit builds only: normal deployments do not ship the recorder.
if (import.meta.env.VITE_PERFORMANCE_AUDIT === "true" &&
  new URLSearchParams(window.location.search).has("perf-audit")) {
  void import("./diagnostics/performanceAudit");
}

const root = document.getElementById("root")!;
const canHydrateHome = root.dataset.prerendered === "home" && root.hasChildNodes() && window.location.pathname === "/";
const timestamp = Number(root.dataset.prerenderTime);
const initialTimestamp = canHydrateHome && Number.isFinite(timestamp) && timestamp > 0 ? timestamp : undefined;
const app = (
  <React.StrictMode>
    <App initialTimestamp={initialTimestamp} />
  </React.StrictMode>
);
if (canHydrateHome) {
  ReactDOM.hydrateRoot(root, app);
} else {
  ReactDOM.createRoot(root).render(app);
}
