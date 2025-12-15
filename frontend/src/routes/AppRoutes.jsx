import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import StudentDashboard from "../pages/StudentDashboard";
import DriverDashboard from "../pages/DriverDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/:role" element={<Auth />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/driver-dashboard" element={<DriverDashboard />} />
    </Routes>
  );
}
