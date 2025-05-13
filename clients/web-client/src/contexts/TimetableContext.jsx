import React, { createContext, useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useUser } from "./useUserContext";

const TimetableContext = createContext();

export function TimetableProvider({ children }) {
  const { user } = useUser();
  const [timetable, setTimetable] = useState(null);

  const data = useFetch(
    user?.role === "student"
      ? user?.classId
        ? `${import.meta.env.VITE_API_URL}/timetable/class/${user?.classId}`
        : null
      : `${import.meta.env.VITE_API_URL}/timetable/teacher/${user?.username}`
  );

  useEffect(() => {
    if (data) {
      setTimetable(data);
    }
  }, [data]);

  return (
    <TimetableContext.Provider value={{ timetable, setTimetable }}>
      {children}
    </TimetableContext.Provider>
  );
}

export function useTimetable() {
  return useContext(TimetableContext);
}