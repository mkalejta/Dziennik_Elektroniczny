import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, roles } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!roles.some(role => allowedRoles.includes(role))) return <Navigate to="/" />;

  return children;
}