import { Box, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import Loading from "./Loading";
import { useAttendance } from "../contexts/AttendanceContext";

export default function Attendance() {
    const { attendance } = useAttendance();

    if (!attendance) return <Loading />;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
                Lista Nieobecności
            </Typography>
            {attendance.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: "center" }}>
                    Brak nieobecności do wyświetlenia.
                </Typography>
            ) : (
                <List>
                    {attendance.map(([date, records]) => (
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