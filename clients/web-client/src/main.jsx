import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./auth/keycloak";
import AuthProvider from "./context/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      onLoad: "login-required",
      pkceMethod: "S256",
    }}
  >
    <AuthProvider>
      <App />
    </AuthProvider>
  </ReactKeycloakProvider>
);
