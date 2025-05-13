import { useGrades } from "../contexts/GradesContext";
import { Box, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Loading from "./Loading";
import { useUser } from "../contexts/useUserContext";

export default function Grades() {
    const { grades } = useGrades();
    const { user } = useUser();

    if (!grades) return <Loading />;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
                {user?.role === "student" ? 'Twoje Oceny' : 'Oceny Twojego Dziecka'}
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>Przedmiot</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Oceny</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {grades &&
                            Object.entries(grades).map(([subject, _grades]) => (
                                <TableRow key={subject}>
                                    <TableCell>{subject}</TableCell>
                                    <TableCell>
                                        {_grades.map((grade) => (
                                            <Box key={grade.id} sx={{ display: "inline-block", mx: 1 }}>
                                                <Paper elevation={2} sx={{ p: 1, textAlign: "center" }}>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {grade.grade}
                                                    </Typography>
                                                    <Typography variant="caption">
                                                        {grade.teacher.name}
                                                    </Typography>
                                                </Paper>
                                            </Box>
                                        ))}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}