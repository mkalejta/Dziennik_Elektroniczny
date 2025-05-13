import React, { createContext, useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useUser } from "./UserContext";

const AttendanceContext = createContext();

export function AttendanceProvider({ children }) {
  const { user } = useUser();
  const [attendance, setAttendance] = useState(null);

  const data = useFetch(
    user
      ? user.role === "parent"
        ? `${import.meta.env.VITE_API_URL}/attendance/parent/${user.username}`
        : `${import.meta.env.VITE_API_URL}/attendance/student/${user.username}`
      : null
  );

  useEffect(() => {
    if (data) {
      setAttendance(data);
    }
  }, [data]);

  return (
    <AttendanceContext.Provider value={{ attendance, setAttendance }}>
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  return useContext(AttendanceContext);
}