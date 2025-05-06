import { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const { keycloak } = useKeycloak();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (keycloak?.authenticated) {
      setIsAuthenticated(true);
      setRoles(keycloak.tokenParsed?.realm_access?.roles || []);
    } else {
      setIsAuthenticated(false);
      setRoles([]);
    }
  }, [keycloak?.authenticated, keycloak?.tokenParsed]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, roles }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
