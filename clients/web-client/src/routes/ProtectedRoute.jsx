import { useKeycloak } from "@react-keycloak/web";
import { Navigate } from 'react';
import { useUser } from "../contexts/UserContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { keycloak } = useKeycloak();
  const { user } = useUser();

  const isAuthenticated = keycloak.authenticated;

  if (!isAuthenticated) {
    <Navigate to="/login" replace />
  }

  if (user === null) {
    return <div>Loading user data...</div>;
  }

  if (!user.role || !allowedRoles.includes(user.role)) {
    return <h1>Not authorized for this page</h1>
  }
  
  return <> 
    {children}
  </>
}