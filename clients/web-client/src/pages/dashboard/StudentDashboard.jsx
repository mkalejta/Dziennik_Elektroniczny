import React, { useState } from 'react';
import AppHeader from "../../components/AppHeader";
import { Box } from '@mui/material';
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FieldsBar from '../../components/FieldsBar';

const tabs = [
  { name: "timetable", label: "Timetable", icon: <CalendarMonthIcon /> },
  { name: "grades", label: "Grades", icon: <DashboardIcon /> },
  { name: "profile", label: "Profile", icon: <AccountCircleIcon /> },
];

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("timetable");

  return (
    <>
        <AppHeader />
        <FieldsBar tabs={tabs} setActiveTab={setActiveTab} activeTab={activeTab} />
        <Box sx={{ p: 2 }}>
            {activeTab === "timetable" && <div>Timetable content</div>}
            {activeTab === "grades" && <div>Grades content</div>}
            {activeTab === "profile" && <div>Profile content</div>}
        </Box>
    </>
  );

}
