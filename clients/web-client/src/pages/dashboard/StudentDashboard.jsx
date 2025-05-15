import React, { useState } from 'react';
import AppHeader from "../../components/AppHeader";
import { Box } from '@mui/material';
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FreeCancellationIcon from '@mui/icons-material/FreeCancellation';
import MessageIcon from '@mui/icons-material/Message';
import FieldsBar from '../../components/FieldsBar';
import Timetable from '../../components/Timetable';
import Grades from '../../components/Grades';
import Attendance from '../../components/Attendance';
import Messages from '../../components/Messages';

const tabs = [
  { name: "timetable", label: "Timetable", icon: <CalendarMonthIcon /> },
  { name: "grades", label: "Grades", icon: <DashboardIcon /> },
  { name: "attendance", label: "Attendance", icon: <FreeCancellationIcon /> },
  { name: "messages", label: "Messages", icon: <MessageIcon /> },
];

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("timetable");

  return (
    <>
        <AppHeader />
        <FieldsBar tabs={tabs} setActiveTab={setActiveTab} activeTab={activeTab} />
        <Box sx={{ p: 2 }}>
            {activeTab === "timetable" && <Timetable />}
            {activeTab === "grades" && <Grades />}
            {activeTab === "attendance" && <Attendance />}
            {activeTab === "messages" && <Messages />}
        </Box>
    </>
  );

}
