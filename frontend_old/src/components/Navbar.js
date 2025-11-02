import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    nav("/login");
  };

  return (
    <header className="navbar">
      <div className="nav-inner container">
        {/* Brand / Logo */}
        <Link to="/" className="brand">
          🏥 HMS
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          <Link to="/appointments" className="nav-link">
            Appointments
          </Link>

          {/* Role-based navigation */}
          {user?.role === "doctor" && (
            <Link to="/doctor" className="nav-link">
              Dashboard
            </Link>
          )}
          {user?.role === "patient" && (
            <Link to="/patient" className="nav-link">
              Dashboard
            </Link>
          )}

          {/* Profile + Auth Buttons */}
          {user ? (
            <>
              <Link to="/profile" className="nav-link">
                {user.name || "Profile"}
              </Link>
              <button className="btn btn-ghost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">
                Login
              </Link>
              <Link to="/signup" className="btn btn-outline">
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
