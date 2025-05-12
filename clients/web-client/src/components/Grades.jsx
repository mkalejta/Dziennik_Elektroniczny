import { useUser } from "../context/useUserContext";
import useFetch from "../hooks/useFetch";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Loading from "./Loading";

export default function Grades() {
    const { user } = useUser();
    const data = useFetch(
        user?.role === "student"
        ? `${import.meta.env.VITE_API_URL}/grades/student/${user?.username}`
        :`${import.meta.env.VITE_API_URL}/grades/parent/${user?.username}`
    );

    if (!data) return <Loading />;

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
                        {data &&
                            Object.entries(data).map(([subject, grades]) => (
                                <TableRow key={subject}>
                                    <TableCell>{subject}</TableCell>
                                    <TableCell>
                                        {grades.map((grade) => (
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