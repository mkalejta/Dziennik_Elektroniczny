import React, { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useContext, createContext } from "react";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { keycloak } = useKeycloak();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (keycloak?.authenticated) {
            const decodedToken = jwtDecode(keycloak.token);

            const role = decodedToken.realm_access?.roles[0] || null;

            keycloak.loadUserProfile()
                .then(async (profile) => {
                    let classId = null;

                    if (role === "student") {
                        try {
                            const response = await axios.get(
                                `${import.meta.env.VITE_API_URL}/users/${profile.username}/class`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${keycloak.token}`,
                                    },
                                }
                            );
                            classId = response.data.class_id;
                        } catch (err) {
                            console.error("Failed to fetch classId", err);
                        }
                    }
                    setUser({
                        ...profile,
                        role,
                        classId,
                        token: keycloak.token
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

export function useUser() {
    return useContext(UserContext);
}
