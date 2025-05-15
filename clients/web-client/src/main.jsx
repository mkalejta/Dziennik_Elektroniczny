import ReactDOM from "react-dom/client";
import App from "./App";
import Keycloak from "keycloak-js";
import Loading from "./components/Loading";
import { UserProvider } from "./contexts/UserContext";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { GradesProvider } from "./contexts/GradesContext";
import { AttendanceProvider } from "./contexts/AttendanceContext";
import { TimetableProvider } from "./contexts/TimetableContext";
import { TeacherDataProvider } from "./contexts/TeacherDataContext";
import { MessagesProvider } from "./contexts/MessagesContext";

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
    LoadingComponent={<Loading />}
    autoRefreshToken={true}
    onTokens={tokenLogger}
    onEvent={eventLogger}
  >
    <UserProvider>
      <TimetableProvider>
        <AttendanceProvider>
          <GradesProvider>
            <MessagesProvider>
              <TeacherDataProvider>
                <App />
              </TeacherDataProvider>
            </MessagesProvider>
          </GradesProvider>
        </AttendanceProvider>
      </TimetableProvider>
    </UserProvider>
  </ReactKeycloakProvider>
);
