import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useUser } from "./useUserContext";

const AddAttendanceContext = createContext();

export function AddAttendanceProvider({ children }) {
  const { user } = useUser();
  const [attendance, setAttendance] = useState([]);

  const addAttendance = async (studentId, date, status) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/attendance`,
        {
          studentId,
          date,
          status,
          teacherId: user.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        }
      );
      setAttendance((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding attendance:", error);
    }
  };

  return (
    <AddAttendanceContext.Provider value={{ attendance, addAttendance }}>
      {children}
    </AddAttendanceContext.Provider>
  );
}

export function useAddAttendance() {
  return useContext(AddAttendanceContext);
}