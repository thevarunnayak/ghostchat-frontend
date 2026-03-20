import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <Toaster
  position="top-right"
  toastOptions={{
    style: {
      background: "#000",
      color: "#00ff9f",
      border: "1px solid #00ff9f",
    },
  }}
/>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);