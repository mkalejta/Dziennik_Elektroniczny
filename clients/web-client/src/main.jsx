import ReactDOM from "react-dom/client";
import App from "./App";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import Keycloak from "keycloak-js";
import { UserProvider } from "./contexts/useUserProvider";
import Loading from "./components/Loading";
import { GradesProvider } from "./contexts/GradesContext";
import { AttendanceProvider } from "./contexts/AttendanceContext";
import { TimetableProvider } from "./contexts/TimetableContext";
import { AddAttendanceProvider } from "./contexts/AddAttendanceContext";
import { TeacherDataProvider } from "./contexts/TeacherDataContext";

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
            <AddAttendanceProvider>
              <TeacherDataProvider>
                <App />
              </TeacherDataProvider>
            </AddAttendanceProvider>
          </GradesProvider>
        </AttendanceProvider>
      </TimetableProvider>
    </UserProvider>
  </ReactKeycloakProvider>
);
