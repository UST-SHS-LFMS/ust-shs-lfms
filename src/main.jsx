import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import Items from "./pages/admin/AdminItems.jsx";
import AdminHelpSupport from "./pages/admin/AdminHelpSupport.jsx";
import ManageAdmins from "./pages/admin/ManageAdmins.jsx";
import Profile from "./pages/admin/AdminProfile.jsx";
import AddAdmin from "./components/admin/AddAdmin.jsx";
import AddFound from "./components/admin/AddFound.jsx";
import AddLost from "./components/admin/AddLost.jsx";
import StudentProfile from "./pages/student/StudentProfile.jsx";
import StudentItems from "./pages/student/StudentItems.jsx";
import StudentSearch from "./pages/student/StudentSearch.jsx";
import StudentHelpSupport from "./pages/student/StudentHelpSupport.jsx";
import StudentSetup from "./pages/student/StudentSetup.jsx";
import ReportLost from "./pages/student/ReportLost.jsx";
import Home from "./Home";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/admin-help" element={<AdminHelpSupport />} />
        <Route path="/items" element={<Items />} />
        <Route path="/manage-admins" element={<ManageAdmins />} />
        <Route path="/add-admin" element={<AddAdmin />} />
        <Route path="/admin-profile" element={<Profile />} />
        <Route path="/add-found" element={<AddFound />} />
        <Route path="/add-lost" element={<AddLost />} />

        {/* Student Routes */}
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/student-search" element={<StudentSearch />} />
        <Route path="/student-help" element={<StudentHelpSupport />} />
        <Route path="/student-setup" element={<StudentSetup />} />
        <Route path="/report-lost" element={<ReportLost />} />
        <Route path="/student-items" element={<StudentItems />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
