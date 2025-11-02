import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * A simple wrapper for protecting routes based on authentication and role.
 * Redirects unauthenticated users to /login, and role-mismatched users to home.
 */
export default function ProtectedRoute({ children, user, requiredRole }) {
  const location = useLocation();

  // In case user info is still loading (future async handling)
  if (user === undefined) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>;
  }

  // If not logged in → redirect to login, preserving last location
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If role doesn’t match (like patient trying to open doctor dashboard)
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // All good → render the protected content
  return children;
}
