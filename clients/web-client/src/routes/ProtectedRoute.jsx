import { useKeycloak } from "@react-keycloak/web";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { keycloak } = useKeycloak();

  const isAuthenticated = keycloak.authenticated;

  if (!isAuthenticated) {
    keycloak.login({ redirectUri: window.location.origin });
    return null;
  }
  
  return children;
}