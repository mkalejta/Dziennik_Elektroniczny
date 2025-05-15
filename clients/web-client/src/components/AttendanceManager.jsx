import React, { useState } from "react";
import { Box, List, ListItem, ListItemText, ListItemButton, Checkbox, Button, Typography, Divider, Select, MenuItem } from "@mui/material";
import { useTeacherData } from "../contexts/TeacherDataContext";
import { useUser } from "../contexts/UserContext";

export default function AttendanceManager() {
  const { user } = useUser();
  const { classes, attendance, addAttendance, editAttendance } = useTeacherData();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [attendanceState, setAttendanceState] = useState({});
  const [isNewAttendance, setIsNewAttendance] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    setAttendanceState(lesson.students || {});
    setIsNewAttendance(false);
  };

  const handleAttendanceChange = (studentId) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleClassSelect = (class_id) => {
    setSelectedClass(class_id);
    const subjectId = classes.find((cls) => cls.id === class_id)?.subjectId;
    setSelectedSubject(subjectId);
  };

  const handleSaveAttendance = async () => {
    if (isNewAttendance) {
      const newAttendance = {
        classId: selectedClass,
        subjectId: selectedSubject,
        students: attendanceState,
        teacherId: user?.username
      };
      await addAttendance(newAttendance);
    } else {
      const updatedAttendance = {
        ...selectedLesson,
        students: attendanceState,
      };
      await editAttendance(selectedLesson.id, updatedAttendance);
    }

    setSelectedLesson(null);
    setAttendanceState({});
    setIsNewAttendance(false);
  };

  const handleCreateNewAttendance = () => {
    if (selectedClass && selectedSubject) {
      const students = classes
        .find((cls) => cls.id === selectedClass)
        ?.students.map((student) => ({
          id: student.id,
          name: student.name,
          surname: student.surname,
          present: false,
        }));

      setSelectedLesson({
        classId: selectedClass,
        subjectId: selectedSubject,
        students: students || [],
      });

      setAttendanceState(
        (students || []).reduce((acc, student) => {
          acc[student.id] = false;
          return acc;
        }, {})
      );

      setIsNewAttendance(true);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
      {!selectedLesson && (
        <>
          <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
            Zarządzanie Obecnością
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Select
              value={selectedClass}
              onChange={(e) => handleClassSelect(e.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>
                Wybierz klasę
              </MenuItem>
              {classes.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.id}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateNewAttendance}
              disabled={!selectedClass || !selectedSubject}
            >
              Dodaj Obecność
            </Button>
          </Box>
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
        </>
      )}

      {selectedLesson && (
        <Box>
          <Typography variant="h6" gutterBottom>
            {isNewAttendance
              ? `Nowa obecność dla klasy ${selectedLesson.classId} (${selectedLesson.subjectId})`
              : `Edycja obecności dla klasy ${selectedLesson.classId} (${selectedLesson.subjectId})`}
          </Typography>
          <List>
            {Object.entries(selectedLesson.students || {}).map(([id, present]) => ({
              id,
              present,
            })).map((student) => (
              <ListItem key={student.id} sx={{ display: "flex", alignItems: "center" }}>
                <ListItemText primary={`${student.name} ${student.surname}`} />
                <Checkbox
                  checked={attendanceState[student.id] ?? false}
                  onChange={() => handleAttendanceChange(student.id)}
                />
              </ListItem>
            ))}
          </List>
          <Button variant="contained" color="primary" onClick={handleSaveAttendance}>
            {isNewAttendance ? "Dodaj" : "Zapisz"}
          </Button>
        </Box>
      )}
    </Box>
  );
}
