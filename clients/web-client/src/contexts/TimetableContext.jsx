import React, { createContext, useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useUser } from "./UserContext";

const TimetableContext = createContext();

export function TimetableProvider({ children }) {
  const { user } = useUser();
  const [timetable, setTimetable] = useState(null);

  const data = useFetch(
    user?.role === "student" && user?.classId
      ? `${import.meta.env.VITE_API_URL}/timetable/class/${user?.classId}`
      : user?.role === "teacher"
      ? `${import.meta.env.VITE_API_URL}/timetable/teacher/${user?.username}`
      : null
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