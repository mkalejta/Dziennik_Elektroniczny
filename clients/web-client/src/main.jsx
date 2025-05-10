import ReactDOM from "react-dom/client";
import App from "./App";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import Keycloak from "keycloak-js";
import { UserProvider } from "./context/useUserProvider";
import { CircularProgress } from "@mui/material";

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
    LoadingComponent={<CircularProgress />}
    autoRefreshToken={true}
    onTokens={tokenLogger}
    onEvent={eventLogger}
  >
    <UserProvider>
      <App />
    </UserProvider>
  </ReactKeycloakProvider>
);
