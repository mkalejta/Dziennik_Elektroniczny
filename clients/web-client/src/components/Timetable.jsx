import { Box, Typography, Paper } from "@mui/material";
import { useTimetable } from "../contexts/TimetableContext";
import { useUser } from "../contexts/UserContext";
import React from "react";
import Loading from "./Loading";

const days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"];
const hours = [
  "08:00 - 08:45",
  "09:00 - 09:45",
  "10:00 - 10:45",
  "11:00 - 11:45",
  "12:00 - 12:45",
  "13:00 - 13:45"
];

export default function TimetableGrid() {
  const { timetable } = useTimetable();
  const { user } = useUser();

  if (!timetable) return <Loading />;

  if (timetable.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography variant="h6">Tutaj niedługo pojawi się plan lekcji</Typography>
      </Box>
    );
  }

  // Pomocnicza funkcja do sprawdzania, czy lekcja pasuje do pola
  function getLessonAt(day, hour) {
    const [start] = hour.split(" - ");
    return timetable.find(
      (lesson) => lesson.day === day && lesson.start_at === start
    );
  }

  return (
    <Box sx={{ overflowX: "auto", p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{textAlign: "center"}}>
        {user?.role === "student" ? `Plan lekcji dla klasy ${user.classId}` : "Twój plan lekcji"}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "120px repeat(5, 1fr)",
          gridAutoRows: "80px",
          border: "1px solid #ccc",
        }}
      >
        {/* Górny wiersz z dniami */}
        <Box sx={{ border: "1px solid #ccc", backgroundColor: "#f0f0f0" }} />
        {days.map((day) => (
          <Box
            key={day}
            sx={{
              border: "1px solid #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            }}
          >
            {day}
          </Box>
        ))}

        {/* Wiersze godzinowe */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            {/* Godzina lekcyjna */}
            <Box
              key={`hour-${hour}`}
              sx={{
                border: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                backgroundColor: "#fafafa",
              }}
            >
              {hour}
            </Box>

            {/* Pola lekcji dla każdego dnia tygodnia */}
            {days.map((day) => {
              const lesson = getLessonAt(day, hour);
              return (
                <Box
                  key={`${day}-${hour}`}
                  sx={{
                    border: "1px solid #ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {lesson ? (
                    <Paper elevation={1} sx={{ p: 1, width: "90%", textAlign: "center" }}>
                      <Typography variant="body2" fontWeight="bold">
                        {lesson.subject} {user?.role === "teacher" ? `${lesson.classId}` : null}
                      </Typography>
                      <Typography variant="caption">{lesson.teacher?.name[0]}. {lesson.teacher?.surname}</Typography>
                    </Paper>
                  ) : null}
                </Box>
              );
            })}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}
