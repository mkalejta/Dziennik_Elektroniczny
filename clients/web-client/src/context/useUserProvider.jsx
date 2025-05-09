import React, { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { UserContext } from "./useUserContext";
import { jwtDecode } from 'jwt-decode';

export const UserProvider = ({ children }) => {
    const { keycloak } = useKeycloak();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (keycloak?.authenticated) {
            const decodedToken = jwtDecode(keycloak.token);

            const role = decodedToken.realm_access?.roles[0] || null;

            keycloak.loadUserProfile()
                .then(profile => {
                    setUser({
                        ...profile,
                        role
                    });
                })
                .catch(err => {
                    console.error("Failed to load user info", err);
                    setUser(null);
                });
        } else {
            setUser(null);
        }
    }, [keycloak]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
