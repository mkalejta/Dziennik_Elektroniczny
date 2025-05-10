import React, { useState } from 'react';
import AppHeader from "../../components/AppHeader";
import { Box } from '@mui/material';
import GradingIcon from '@mui/icons-material/Grading';
import FreeCancellationIcon from '@mui/icons-material/FreeCancellation';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MessageIcon from '@mui/icons-material/Message';
import FieldsBar from '../../components/FieldsBar';

const tabs = [
    { name: "timetable", label: "Timetable", icon: <CalendarMonthIcon /> },
    { name: "attendance", label: "Attendance", icon: <FreeCancellationIcon /> },
    { name: "add-grades", label: "Add Grades", icon: <GradingIcon /> },
    { name: "messages", label: "Messages", icon: <MessageIcon /> },
    { name: "profile", label: "Profile", icon: <AccountCircleIcon /> }
];

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState("timetable");

  return (
    <>
        <AppHeader />
        <FieldsBar tabs={tabs} setActiveTab={setActiveTab} activeTab={activeTab} />
        <Box sx={{ p: 2 }}>
            {activeTab === "timetable" && <div>Timetable content</div>}
            {activeTab === "attendance" && <div>Attendance content</div>}
            {activeTab === "add-grades" && <div>Add Grades content</div>}
            {activeTab === "messages" && <div>Messages content</div>}
            {activeTab === "profile" && <div>Profile content</div>}
        </Box>
    </>
  );
}