import React, { useState } from 'react';
import AppHeader from "../../components/AppHeader";
import { Box } from '@mui/material';
import DashboardIcon from "@mui/icons-material/Dashboard";
import FreeCancellationIcon from '@mui/icons-material/FreeCancellation';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MessageIcon from '@mui/icons-material/Message';
import FieldsBar from '../../components/FieldsBar';
import Attendance from '../../components/Attendance';
import Grades from '../../components/Grades';
import Messages from '../../components/Messages';
import Profile from '../../components/Profile';

const tabs = [
    { name: "attendance", label: "Attendance", icon: <FreeCancellationIcon /> },
    { name: "grades", label: "Grades", icon: <DashboardIcon /> },
    { name: "messages", label: "Messages", icon: <MessageIcon /> },
    { name: "profile", label: "Profile", icon: <AccountCircleIcon /> }
];

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState("attendance");

  return (
    <>
        <AppHeader />
        <FieldsBar tabs={tabs} setActiveTab={setActiveTab} activeTab={activeTab} />
        <Box sx={{ p: 2 }}>
            {activeTab === "attendance" && <Attendance /> }
            {activeTab === "grades" && <Grades /> }
            {activeTab === "messages" && <Messages /> }
            {activeTab === "profile" && <Profile /> }
        </Box>
    </>
  );
}