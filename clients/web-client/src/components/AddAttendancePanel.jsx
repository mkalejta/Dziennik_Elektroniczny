import React, { useState } from "react";
import { Box, List, ListItem, ListItemText, ListItemButton, Checkbox, Button, Typography, Divider } from "@mui/material";
import { useTeacherData } from "../contexts/TeacherDataContext";
import axios from "axios";
import { useUser } from "../contexts/UserContext";

export default function AddAttendancePanel() {
  const { students, attendance } = useTeacherData();
  const { user } = useUser();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [attendanceState, setAttendanceState] = useState({});

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    setAttendanceState(lesson.students || {});
  };

  const handleAttendanceChange = (studentId) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      const updatedAttendance = {
        ...selectedLesson,
        students: attendanceState,
        teacherId: user.username
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/attendance/${selectedLesson.id}`,
        updatedAttendance,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      setSelectedLesson(null);
      setAttendanceState({});
    } catch (err) {
      console.error("Failed to save attendance:", err);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
      {!selectedLesson && (
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
          Dodaj obecność
        </Typography>
      )}

      {selectedLesson ? (
        <Box>
          <Typography variant="h6" gutterBottom>
            Klasa: {selectedLesson.classId} | Przedmiot: {selectedLesson.subjectName} | Data:{" "}
            {new Date(selectedLesson.date).toLocaleDateString()}
          </Typography>
          <List>
            {students[selectedLesson.classId]?.map((student) => (
              <ListItem key={student._id} sx={{ display: "flex", alignItems: "center" }}>
                <ListItemText primary={`${student.name} ${student.surname}`} />
                <Checkbox
                  checked={attendanceState[student._id] ?? false}
                  onChange={() => handleAttendanceChange(student._id)}
                />
              </ListItem>
            ))}
          </List>
          <Button variant="contained" color="primary" onClick={handleSaveAttendance}>
            Zapisz
          </Button>
        </Box>
      ) : (
        <Box>
          {attendance.map(([date, lessons]) => (
            <Box key={date} sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {date}
              </Typography>
              {lessons.map((lesson) => (
                <ListItemButton key={lesson.id} onClick={() => handleLessonSelect(lesson)}>
                  <ListItemText
                    primary={`Klasa: ${lesson.classId} | Przedmiot: ${lesson.subjectName}`}
                    secondary={`Data: ${new Date(lesson.date).toLocaleDateString()}`}
                  />
                </ListItemButton>
              ))}
              <Divider />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
