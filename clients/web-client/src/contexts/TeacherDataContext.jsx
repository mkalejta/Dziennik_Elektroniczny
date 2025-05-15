import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useUser } from "./UserContext";
import useFetch from "../hooks/useFetch";

const TeacherDataContext = createContext();

export function TeacherDataProvider({ children }) {
  const { user } = useUser();
  const [grades, setGrades] = useState(null);

  const fetchedGrades = useFetch(
    user?.username && user?.role === "teacher"
      ? `${import.meta.env.VITE_API_URL}/grades/teacher/${user?.username}`
      : null
  );

  const attendance = useFetch(
    user?.username && user?.role === "teacher"
      ? `${import.meta.env.VITE_API_URL}/attendance/teacher/${user?.username}`
      : null
  );

  const subjectId = useFetch(
    user?.username && user?.role === "teacher" 
      ? `${import.meta.env.VITE_API_URL}/subjects/teacher/${user.username}`
      : null
  );

  useEffect(() => {
    if (fetchedGrades) {
      setGrades(fetchedGrades);
    }
  }, [fetchedGrades]);

  const rawClasses = useFetch(
    user?.username && user?.role === "teacher"
      ? `${import.meta.env.VITE_API_URL}/classes/teacher/${user.username}`
      : null
  );

  const classes = useMemo(() => rawClasses || [], [rawClasses]);

  const addGrade = async (studentId, grade) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/grades`, 
        {
          studentId,
          grade,
          subjectId,
          teacherId: user.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const newGrade = res.data;

      setGrades((prev) => {
        const classId = Object.keys(prev).find((classId) =>
          prev[classId].some((student) => student.id === studentId)
        );

        if (!classId) return prev;

        return {
          ...prev,
          [classId]: prev[classId].map((student) =>
            student.id === studentId
              ? {
                  ...student,
                  grades: [...student.grades, newGrade.grade],
                }
              : student
          ),
        };
      });
    } catch (err) {
      console.error("Failed to add grade", err);
    }
  };

  if (user?.role !== "teacher") {
    return <>{children}</>;
  }
  return (
    <TeacherDataContext.Provider
      value={{
        subjectId,
        grades,
        attendance,
        classes,
        addGrade
      }}
    >
      {children}
    </TeacherDataContext.Provider>
  );
}

export function useTeacherData() {
  return useContext(TeacherDataContext);
}