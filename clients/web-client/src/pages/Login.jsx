import React from "react";
import { useKeycloak } from "@react-keycloak/web";

const Login = () => {
  const { keycloak } = useKeycloak();

  const handleLogin = () => {
    if (keycloak) {
      keycloak.login();
    } else {
      console.error("Keycloak not initialized");
    }
  };

  return (
    <div>
      <h2>Logowanie</h2>
      <button onClick={handleLogin}>Zaloguj się</button>
    </div>
  );
};

export default Login;
