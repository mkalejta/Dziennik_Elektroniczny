import React, { useState } from 'react';
import AppHeader from "../../components/AppHeader";
import { Box } from '@mui/material';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GradingIcon from '@mui/icons-material/Grading';
import FreeCancellationIcon from '@mui/icons-material/FreeCancellation';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MessageIcon from '@mui/icons-material/Message';
import FieldsBar from '../../components/FieldsBar';
import Timetable from "../../components/Timetable";
import Attendance from "../../components/Attendance";
import AddGradesPanel from "../../components/AddGradesPanel";
import Messages from "../../components/Messages";
import Profile from "../../components/Profile";

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
            {activeTab === "timetable" && <Timetable />}
            {activeTab === "attendance" && <Attendance />}
            {activeTab === "add-grades" && <AddGradesPanel />}
            {activeTab === "messages" && <Messages />}
            {activeTab === "profile" && <Profile />}
        </Box>
    </>
  );
}