import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import ParentDashboard from "./pages/dashboard/ParentDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from "./pages/Profile";
import Grades from "./pages/Grades";
import Timetable from "./pages/Timetable";
import Attendance from "./pages/Attendance";
import Messages from "./pages/Messages";
import AddGradesPanel from "./pages/AddGradesPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/student" element={
          <ProtectedRoute allowedRoles={["student"]} >
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/teacher" element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/parent" element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <ParentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={["student", "parent", "teacher"]} >
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/grades" element={
          <ProtectedRoute allowedRoles={["student", "parent"]} >
            <Grades />
          </ProtectedRoute>
        } />
        <Route path="/attendance" element={
          <ProtectedRoute allowedRoles={["parent", "teacher"]} >
            <Attendance />
          </ProtectedRoute>
        } />
        <Route path="/timetable" element={
          <ProtectedRoute allowedRoles={["student", "teacher"]} >
            <Timetable />
          </ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute allowedRoles={["parent", "teacher"]} >
            <Messages />
          </ProtectedRoute>
        } />
        <Route path="/add-grades" element={
          <ProtectedRoute allowedRoles={["teacher"]} >
            <AddGradesPanel />
          </ProtectedRoute>
        } />      
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
