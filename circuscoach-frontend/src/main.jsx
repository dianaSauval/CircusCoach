import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
     <AuthProvider>
    <LanguageProvider>
      {" "}
      <App />
    </LanguageProvider>
    </AuthProvider>
  </StrictMode>
);
