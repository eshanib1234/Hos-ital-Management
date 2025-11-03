import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>🏥 Hospital Management</h2>

      {/* If user is logged in */}
      {user ? (
        <div style={styles.links}>
          {user.role === "doctor" && (
            <>
              <Link style={styles.link} to="/doctor">
                Dashboard
              </Link>
              <Link style={styles.link} to="/appointments">
                Appointments
              </Link>
            </>
          )}

          {user.role === "patient" && (
            <>
              <Link style={styles.link} to="/patient">
                Dashboard
              </Link>
              <Link style={styles.link} to="/appointments">
                My Appointments
              </Link>
            </>
          )}

          <Link style={styles.link} to="/profile">
            Profile
          </Link>
          <button style={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        // If user is not logged in
        <div style={styles.links}>
          <Link style={styles.link} to="/login">
            Login
          </Link>
          <Link style={styles.link} to="/signup">
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
}

// ✅ Basic inline styles to keep it neat
const styles = {
  navbar: {
    backgroundColor: "#1976d2",
    color: "#fff",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  logo: {
    margin: 0,
    fontSize: "20px",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
  },
  logout: {
    background: "#e63946",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "6px 10px",
    cursor: "pointer",
  },
};

export default Navbar;
