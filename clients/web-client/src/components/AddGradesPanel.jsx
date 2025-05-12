import React, { useState, useEffect } from "react";
import { Box, List, ListItem, ListItemButton, ListItemText, Button, Typography, Divider, TextField, Paper } from "@mui/material";
import useFetch from "../hooks/useFetch";
import { useUser } from "../context/useUserContext";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";

export default function AddGradesPanel() {
    const { user } = useUser();
    const { keycloak } = useKeycloak();
    const [selectedClass, setSelectedClass] = useState(null);
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState({});
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newGrade, setNewGrade] = useState("");

    const subjectId = useFetch(`${import.meta.env.VITE_API_URL}/subjects/teacher/${user.username}`);
    const classes = useFetch(`${import.meta.env.VITE_API_URL}/classes/teacher/${user.username}`);

    useEffect(() => {
        if (selectedClass) {
            axios.get(`${import.meta.env.VITE_API_URL}/classes/${selectedClass}/students`, {
                headers: { 
                    accept: 'application/json',
                    authorization: `Bearer ${keycloak?.token}`
                }
            })
            .then((res) => setStudents(res.data));
        }
    }, [selectedClass, keycloak?.token]);

    useEffect(() => {
        if (selectedStudent) {
            axios.get(`${import.meta.env.VITE_API_URL}/grades/student/${selectedStudent}/subject/${subjectId}`, {
                headers: { 
                    accept: 'application/json',
                    authorization: `Bearer ${keycloak?.token}`
                }
            })
            .then((res) => setGrades((prev) => ({ ...prev, [selectedStudent]: res.data })));
        }
    }, [selectedStudent, keycloak?.token, subjectId]);

    const handleAddGrade = () => {
        if (newGrade && selectedStudent) {
            axios.post(`${import.meta.env.VITE_API_URL}/grades`,
                {
                    studentId: selectedStudent,
                    grade: parseFloat(newGrade),
                    subjectId: classes.find((cls) => cls.id === selectedClass)?.subjectId,
                    teacherId: user.username,
                },
                {
                    headers: { 
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${keycloak?.token}`
                    }
                })
                .then((data) => {
                    setGrades((prev) => ({
                        ...prev,
                        [selectedStudent]: [...(prev[selectedStudent] || []), data],
                    }));
                    setNewGrade("");
                });
        }
    };

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
                            onClick={() => setSelectedClass(cls.id)}
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
                            {students.map((student) => (
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
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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