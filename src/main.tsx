import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/app.css";
import { hydrateFromSDK } from "even-toolkit/storage";
import { ALL_STORAGE_KEYS } from "./data/persistence";

// Hydrate localStorage from SDK bridge before rendering.
// This ensures data persists across Even Hub WebView restarts.
hydrateFromSDK(ALL_STORAGE_KEYS).finally(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
