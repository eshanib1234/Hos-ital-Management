import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">
          🏥 HealthCare Portal
        </Link>
      </div>

      {user ? (
        <div className="nav-right">
          {/* Dashboard */}
          {user.role === "doctor" ? (
            <Link to="/doctor" className="nav-link">
              Dashboard
            </Link>
          ) : (
            <Link to="/patient" className="nav-link">
              Dashboard
            </Link>
          )}

          {/* Appointments (Dynamic redirect) */}
          <Link
            to={user.role === "doctor" ? "/doctor" : "/patient"}
            className="nav-link"
          >
            Appointments
          </Link>

          {/* Profile */}
          <Link to="/profile" className="nav-link">
            Profile
          </Link>

          {/* Logout */}
          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="nav-right">
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/signup" className="nav-link">
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
}
