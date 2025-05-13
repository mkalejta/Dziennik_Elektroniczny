import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useUser } from "./UserContext";
import useFetch from "../hooks/useFetch";

const TeacherDataContext = createContext();

export function TeacherDataProvider({ children }) {
  const { user } = useUser();
  const [students, setStudents] = useState({}); // Uczniowie w formacie { classId: [uczniowie] }
  const [grades, setGrades] = useState({}); // Oceny uczniów w formacie { studentId: [oceny] }

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

  const rawClasses = useFetch(
    user?.username && user?.role === "teacher"
      ? `${import.meta.env.VITE_API_URL}/classes/teacher/${user.username}`
      : null
  );

  const classes = useMemo(() => rawClasses || [], [rawClasses]);

  useEffect(() => {
    const fetchStudentsAndGrades = async () => {
      if (user?.role !== "teacher" || !user?.username || classes.length === 0) return;

      try {
        const studentsByClass = {};
        const gradesByStudent = {};

        // Pobierz uczniów dla każdej klasy
        for (const cls of classes) {
          const studentsRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/classes/${cls.id}/students`,
            {
              headers: {
                accept: 'application/json',
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );
          studentsByClass[cls.id] = studentsRes.data;
        }

        setStudents(studentsByClass);

        // Pobierz oceny dla każdego ucznia
        for (const classId in studentsByClass) {
          for (const student of studentsByClass[classId]) {
            const gradesRes = await axios.get(
              `${import.meta.env.VITE_API_URL}/grades/student/${student._id}/subject/${subjectId}`,
              {
                headers: {
                  accept: 'application/json',
                  Authorization: `Bearer ${user?.token}`,
                },
              }
            );

            gradesByStudent[student._id] = gradesRes.data;
          }
        }

        setGrades(gradesByStudent);
      } catch (err) {
        console.error("Failed to fetch students or grades", err);
      }
    };

    fetchStudentsAndGrades();
  }, [user?.username, user?.token, user?.role, classes, subjectId]);

  const addGrade = async (studentId, grade) => {
    if (user?.role !== "teacher") return;

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
      setGrades((prev) => ({
        ...prev,
        [studentId]: [...(prev[studentId] || []), res.data],
      }));
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
        classes,
        students,
        grades,
        addGrade,
        attendance
      }}
    >
      {children}
    </TeacherDataContext.Provider>
  );
}

export function useTeacherData() {
  return useContext(TeacherDataContext);
}