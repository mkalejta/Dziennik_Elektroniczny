import React, { useState } from 'react';
import AppHeader from "../../components/AppHeader";
import { Box } from '@mui/material';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GradingIcon from '@mui/icons-material/Grading';
import ChecklistIcon from '@mui/icons-material/Checklist';
import MessageIcon from '@mui/icons-material/Message';
import FieldsBar from '../../components/FieldsBar';
import Timetable from "../../components/Timetable";
import AttendanceManager from "../../components/AttendanceManager";
import GradesManager from "../../components/GradesManager";
import Messages from "../../components/Messages";

const tabs = [
    { name: "timetable", label: "Timetable", icon: <CalendarMonthIcon /> },
    { name: "attendance", label: "Add Attendance", icon: <ChecklistIcon /> },
    { name: "add-grades", label: "Add Grades", icon: <GradingIcon /> },
    { name: "messages", label: "Messages", icon: <MessageIcon /> }
];

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState("timetable");

  return (
    <>
        <AppHeader />
        <FieldsBar tabs={tabs} setActiveTab={setActiveTab} activeTab={activeTab} />
        <Box sx={{ p: 2 }}>
            {activeTab === "timetable" && <Timetable />}
            {activeTab === "attendance" && <AttendanceManager />}
            {activeTab === "add-grades" && <GradesManager />}
            {activeTab === "messages" && <Messages />}
        </Box>
    </>
  );
}