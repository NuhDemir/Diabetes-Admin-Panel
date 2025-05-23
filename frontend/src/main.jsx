// frontend/src/index.js VEYA main.jsx

import React from "react";
import ReactDOM from "react-dom/client";

import "@coreui/coreui/dist/css/coreui.min.css";

import App from "./App";
import { registerChartComponents } from "./config/chartjsConfig";

registerChartComponents();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
