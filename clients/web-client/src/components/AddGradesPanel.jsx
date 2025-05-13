import React, { useState } from "react";
import { Box, List, ListItemButton, ListItemText, Button, Typography, Divider, TextField, Paper } from "@mui/material";
import { useTeacherData } from "../contexts/TeacherDataContext";

export default function AddGradesPanel() {
  const { classes, students, grades, addGrade } = useTeacherData();
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newGrade, setNewGrade] = useState("");

  const handleClassSelect = (classId) => {
    setSelectedClass(classId);
    setSelectedStudent(null);
  };

  const handleAddGrade = () => {
    if (newGrade && selectedStudent) {
      addGrade(selectedStudent, parseFloat(newGrade));
      setNewGrade("");
    }
  };

  const filteredStudents = students[selectedClass] || [];

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
                <Box key={student._id} sx={{ mb: 2 }}>
                  <ListItemButton
                    onClick={() =>
                      setSelectedStudent(
                        selectedStudent === student._id ? null : student._id
                      )
                    }
                  >
                    <ListItemText
                      primary={`${student.name} ${student.surname}`}
                    />
                  </ListItemButton>
                  {selectedStudent === student._id && (
                    <Box sx={{ pl: 4 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Oceny:
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {(grades[student._id] || []).map((grade, index) => (
                          <Paper
                            key={index}
                            sx={{
                              p: 1,
                              display: "inline-block",
                              textAlign: "center",
                            }}
                          >
                            {grade.grade}
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