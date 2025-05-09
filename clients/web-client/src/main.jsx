import ReactDOM from "react-dom/client";
import App from "./App";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import Keycloak from "keycloak-js";
import { UserProvider } from "./context/useUserProvider";

const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

const eventLogger = (event, error) => {
  console.log('onKeycloakEvent', event, error); 
};

const tokenLogger = (tokens) => {
  console.log('onKeycloakTokens', tokens);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    LoadingComponent={<div>Loading...</div>}
    autoRefreshToken={true}
    onTokens={tokenLogger}
    onEvent={eventLogger}
  >
    <UserProvider>
      <App />
    </UserProvider>
  </ReactKeycloakProvider>
);
