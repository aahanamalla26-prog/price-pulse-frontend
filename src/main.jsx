import React from "react";
import { createRoot } from "react-dom/client";
import PricePulse from "./PricePulse.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PricePulse />
  </React.StrictMode>
);
