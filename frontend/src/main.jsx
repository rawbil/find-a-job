import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import ProviderFunction from "../utils/context/app.context.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProviderFunction>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProviderFunction>
  </StrictMode>
);
