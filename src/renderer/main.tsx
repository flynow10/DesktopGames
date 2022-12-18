import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeManager from "./ThemeManager";
import "../assets/scss/index.scss";
import TabProvider from "@/core/tabs/TabProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeManager>
      <TabProvider>
        <App />
      </TabProvider>
    </ThemeManager>
  </React.StrictMode>
);
