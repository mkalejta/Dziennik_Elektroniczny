import { Box, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import useFetch from "../hooks/useFetch";
import { useUser } from "../context/useUserContext";
import Loading from "./Loading";

export default function Attendance() {
    const { user } = useUser();
    const attendanceData = useFetch(
        user?.role === "parent"
            ? `${import.meta.env.VITE_API_URL}/attendance/parent/${user.username}`
            : `${import.meta.env.VITE_API_URL}/attendance/student/${user.username}`
    );

    if (!attendanceData) return <Loading />;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
                Lista Nieobecności
            </Typography>
            {attendanceData.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: "center" }}>
                    Brak nieobecności do wyświetlenia.
                </Typography>
            ) : (
                <List>
                    {attendanceData.map(([date, records]) => (
                        <Paper key={date} sx={{ mb: 2, p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                {new Date(date).toLocaleDateString()}
                            </Typography>
                            {records.map((record, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={`Przedmiot: ${record.subjectName}`}
                                        secondary={`Nauczyciel: ${record.teacherName}`}
                                    />
                                </ListItem>
                            ))}
                        </Paper>
                    ))}
                </List>
            )}
        </Box>
    );
}