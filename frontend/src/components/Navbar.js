import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import Profile from "./pages/Profile";
import Appointments from "./pages/Appointments";

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  // Redirect users after login based on their role
  useEffect(() => {
    if (!user) return;
    if (user.role === "doctor") navigate("/doctor");
    if (user.role === "patient") navigate("/patient");
  }, [user, navigate]);

  return (
    <div className="app-root">
      {/* ✅ Navbar visible on all authenticated pages */}
      <Navbar user={user} setUser={setUser} />

      <main className="container">
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />

          {/* 👨‍⚕️ Doctor Routes */}
          <Route
            path="/doctor/*"
            element={
              <ProtectedRoute user={user} requiredRole="doctor">
                <DoctorDashboard user={user} />
              </ProtectedRoute>
            }
          />

          {/* 🧑‍⚕️ Patient Routes */}
          <Route
            path="/patient/*"
            element={
              <ProtectedRoute user={user} requiredRole="patient">
                <PatientDashboard user={user} />
              </ProtectedRoute>
            }
          />

          {/* 📅 Appointments Page 
              This will dynamically show either patient or doctor appointments */}
          <Route
            path="/appointments"
            element={
              <ProtectedRoute user={user}>
                <Appointments user={user} />
              </ProtectedRoute>
            }
          />

          {/* 👤 Profile Page */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <Profile user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />

          {/* 🚫 Fallback 404 Page */}
          <Route
            path="*"
            element={<div style={{ padding: 20 }}>Page not found</div>}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
