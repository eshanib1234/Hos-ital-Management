import React, { useState } from "react";
import API from "../api";

export default function Profile({ user, setUser }) {
  const [form, setForm] = useState({
    name: user?.name || user?.userId?.name || "",
    email: user?.email || user?.userId?.email || "",
    phone: user?.phone || user?.userId?.phone || "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setMessage("");
    setLoading(true);

    try {
      // Determine endpoint: doctor or patient
      const endpoint =
        user?.role === "doctor"
          ? `/doctors/${user._id || user.id}`
          : `/patients/${user._id || user.id}`;

      const res = await API.put(endpoint, form);

      if (res.data) {
        const updated = { ...user, ...form };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        setMessage("✅ Profile updated successfully!");
      } else {
        setMessage("⚠️ Update completed, but no data returned from server.");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="page-title">My Profile</h2>

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

      <div className="form">
        <label>Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <label>Email</label>
        <input value={form.email} disabled />

        <label>Phone</label>
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Enter phone number"
        />

        <div className="form-row">
          <button className="btn" onClick={save} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
