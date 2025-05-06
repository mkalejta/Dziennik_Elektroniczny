import { createContext, useContext } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  roles: [],
});

export const useAuth = () => useContext(AuthContext);
