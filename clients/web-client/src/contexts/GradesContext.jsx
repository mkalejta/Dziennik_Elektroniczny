import React, { createContext, useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useUser } from "./UserContext";

const GradesContext = createContext();

export function GradesProvider({ children }) {
  const { user } = useUser();
  const [grades, setGrades] = useState(null);

  const url = 
    user?.role === "student"
      ? `${import.meta.env.VITE_API_URL}/grades/student/${user?.username}`
      : user?.role === "parent"  
      ? `${import.meta.env.VITE_API_URL}/grades/parent/${user?.username}`
      : null;

  const data = useFetch(url);

  useEffect(() => {
    if (data) {
      setGrades(data);
    }
  }, [data]);

  if (user?.role === "student" || user?.role === "parent") {
    return (
      <GradesContext.Provider value={{ grades, setGrades }}>
        {children}
      </GradesContext.Provider>
    );
  }
  
  return <>{children}</>
}

export function useGrades() {
  return useContext(GradesContext);
}