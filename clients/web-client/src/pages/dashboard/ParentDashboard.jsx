import React, { useState } from 'react';
import AppHeader from "../../components/AppHeader";
import { Box } from '@mui/material';
import DashboardIcon from "@mui/icons-material/Dashboard";
import FreeCancellationIcon from '@mui/icons-material/FreeCancellation';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MessageIcon from '@mui/icons-material/Message';
import FieldsBar from '../../components/FieldsBar';

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
            {activeTab === "attendance" && <div>Attendance content</div>}
            {activeTab === "grades" && <div>Grades content</div>}
            {activeTab === "messages" && <div>Messages content</div>}
            {activeTab === "profile" && <div>Profile content</div>}
        </Box>
    </>
  );
}