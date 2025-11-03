import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await API.post("/auth/login", form);
      const { token, user } = res.data || {};

      if (!user) {
        throw new Error("Invalid response: no user data found");
      }

      if (token) {
        localStorage.setItem("token", token);
      }
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      setMessage("✅ Login successful!");
      setTimeout(() => {
        nav(user.role === "doctor" ? "/doctor" : "/patient");
      }, 800);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>🔐 Login</h2>
      {message && (
        <div
          style={{
            background: "#eef2ff",
            borderLeft: "4px solid #6366f1",
            padding: "8px 10px",
            marginBottom: 10,
            fontSize: 14,
          }}
        >
          {message}
        </div>
      )}
      <form onSubmit={submit} className="form">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <div className="form-row">
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => nav("/signup")}
            disabled={loading}
          >
            Create account
          </button>
        </div>
      </form>
    </div>
  );
}
