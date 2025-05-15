import React, { useState } from "react";
import { Box, List, ListItemButton, ListItemText, Button, Typography, Divider, TextField, Paper } from "@mui/material";
import { useTeacherData } from "../contexts/TeacherDataContext";

export default function GradesManager() {
  const { classes, grades, subjectIds, addGrade } = useTeacherData();
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newGrade, setNewGrade] = useState("");

  const handleClassSelect = (classId) => {
    setSelectedClass(classId);
    setSelectedStudent(null);
  };

  const handleAddGrade = () => {
    if (newGrade && selectedStudent) {
      const subjectId = subjectIds.find((subject) => subject.class_id === selectedClass)?.id;
      if (!subjectId) return;
      addGrade(selectedStudent, parseFloat(newGrade), subjectId);
      setNewGrade("");
    }
  };

  const filteredStudents = grades[selectedClass] || [];

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Box sx={{ width: "20%", borderRight: "1px solid #ccc", p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Twoje Klasy
        </Typography>
        <List>
          {classes?.map((cls) => (
            <ListItemButton
              key={cls.id}
              selected={selectedClass === cls.id}
              onClick={() => handleClassSelect(cls.id)}
            >
              <ListItemText primary={cls.id} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      
      <Box sx={{ flex: 1, p: 2 }}>
        {selectedClass ? (
          <>
            <Typography variant="h6" gutterBottom>
              Uczniowie klasy {selectedClass}
            </Typography>
            <List>
              {filteredStudents.map((student) => (
                <Box key={student.id} sx={{ mb: 2 }}>
                  <ListItemButton
                    onClick={() =>
                      setSelectedStudent(
                        selectedStudent === student.id ? null : student.id
                      )
                    }
                  >
                    <ListItemText
                      primary={`${student.name} ${student.surname}`}
                    />
                  </ListItemButton>
                  {selectedStudent === student.id && (
                    <Box sx={{ pl: 4 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Oceny:
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {student.grades.map((grade, index) => (
                          <Paper
                            key={index}
                            sx={{
                              p: 1,
                              display: "inline-block",
                              textAlign: "center",
                            }}
                          >
                            {grade}
                          </Paper>
                        ))}
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <TextField
                          label="Nowa ocena"
                          variant="outlined"
                          size="small"
                          value={newGrade}
                          onChange={(e) => setNewGrade(e.target.value)}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAddGrade}
                        >
                          Dodaj
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              ))}
            </List>
          </>
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
            Wybierz klasę, aby zobaczyć uczniów
          </Typography>
        )}
      </Box>
    </Box>
  );
}