import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthProvider";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import bigImage from "./assets/healthy-lifestyle-running-outdoors.jpg";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App bgImage={bigImage} />
          <Toaster />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
