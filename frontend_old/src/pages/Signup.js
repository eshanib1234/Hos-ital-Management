import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Signup({ setUser }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // Try signup
      const res = await API.post("/auth/signup", form);

      // ✅ If backend returns token + user directly
      if (res.data?.token && res.data?.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        nav(res.data.user.role === "doctor" ? "/doctor" : "/patient");
        return;
      }

      // ✅ Otherwise, auto-login right after signup
      const loginRes = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      if (loginRes.data?.token && loginRes.data?.user) {
        localStorage.setItem("token", loginRes.data.token);
        localStorage.setItem("user", JSON.stringify(loginRes.data.user));
        setUser(loginRes.data.user);
        nav(loginRes.data.user.role === "doctor" ? "/doctor" : "/patient");
      } else {
        setMessage("✅ Account created. Please login manually.");
        setTimeout(() => nav("/login"), 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Create an Account</h2>

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
        <label>Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <label>Role</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        <div className="form-row">
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => nav("/login")}
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}
