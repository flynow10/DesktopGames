import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeManager from "./ThemeManager";
// import "../assets/scss/index.scss";
import "../assets/css/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeManager>
      <App />
    </ThemeManager>
  </React.StrictMode>
);
