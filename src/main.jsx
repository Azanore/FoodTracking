// File purpose: React entry; mounts `App`.
// Related: `index.html` provides the #root; keep this minimal (no routing/providers for reset).
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { seedDatabase } from "./utils/seedDatabase.js";

// Seed database on first launch
seedDatabase();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
