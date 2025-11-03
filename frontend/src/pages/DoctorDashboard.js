import React, { useEffect, useState } from "react";
import API from "../api";

export default function DoctorDashboard() {
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]); // ✅ new state
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "male",
    diagnosis: "",
    treatment: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ✅ Load both patient records and appointments
  const load = async () => {
    try {
      setLoading(true);
      const [patientRes, appointmentRes] = await Promise.all([
        API.get("/patients"),
        API.get("/appointments"),
      ]);
      setRecords(patientRes.data || []);
      setAppointments(appointmentRes.data || []);
    } catch (err) {
      setMessage("⚠️ Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const res = await API.put(`/patients/${editId}`, form);
        setRecords(records.map((r) => (r._id === editId ? res.data : r)));
        setMessage("✅ Record updated successfully!");
        setEditId(null);
      } else {
        const res = await API.post("/patients", form);
        setRecords([res.data, ...records]);
        setMessage("✅ Patient added successfully!");
      }
      setForm({
        name: "",
        age: "",
        gender: "male",
        diagnosis: "",
        treatment: "",
      });
    } catch (err) {
      setMessage("❌ Error saving record.");
    }
    setTimeout(() => setMessage(""), 2500);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await API.delete(`/patients/${id}`);
      setRecords(records.filter((r) => r._id !== id));
      setMessage("🗑️ Record deleted.");
    } catch {
      setMessage("❌ Delete failed.");
    }
    setTimeout(() => setMessage(""), 2500);
  };

  const edit = (r) => {
    setEditId(r._id);
    setForm({
      name: r.name,
      age: r.age,
      gender: r.gender,
      diagnosis: r.diagnosis,
      treatment: r.treatment,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
  };

  return (
    <div>
      <h2 className="page-title">🩺 Doctor Dashboard</h2>

      {message && (
        <div
          className="card"
          style={{
            background: "#eef2ff",
            borderLeft: "4px solid #6366f1",
            marginBottom: 10,
            fontSize: 14,
          }}
        >
          {message}
        </div>
      )}

      {/* ✅ Add/Edit Patient Section */}
      <div className="card">
        <h3>{editId ? "✏️ Edit Patient Record" : "➕ Add New Patient"}</h3>
        <form className="form" onSubmit={createOrUpdate}>
          <label>Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="Enter patient name"
          />

          <label>Age</label>
          <input
            value={form.age}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || (val >= 0 && val <= 120)) {
                // ✅ Restrict age between 0–120
                setForm({ ...form, age: val });
              }
            }}
            type="number"
            placeholder="Enter patient age"
            min="0"
            max="120"
            required
          />

          <label>Gender</label>
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <label>Diagnosis</label>
          <input
            value={form.diagnosis}
            onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
            placeholder="E.g. Fever, Diabetes"
          />

          <label>Treatment</label>
          <input
            value={form.treatment}
            onChange={(e) => setForm({ ...form, treatment: e.target.value })}
            placeholder="E.g. Paracetamol 500mg"
          />

          <div className="form-row">
            <button className="btn" type="submit">
              {editId ? "Update Record" : "Add Patient"}
            </button>
            {editId && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setEditId(null);
                  setForm({
                    name: "",
                    age: "",
                    gender: "male",
                    diagnosis: "",
                    treatment: "",
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ✅ Doctor’s Manually Added Patients */}
      <div className="card mt">
        <h3>📋 My Patient Records</h3>
        {loading ? (
          <div>Loading...</div>
        ) : records.length === 0 ? (
          <div>No patient records found.</div>
        ) : (
          <div className="list">
            {records.map((r) => (
              <div className="list-item" key={r._id}>
                <div>
                  <div className="item-title">
                    {r.name} <span className="muted">({r.age} yrs)</span>
                  </div>
                  <div className="muted">
                    {r.gender} • {r.diagnosis || "No diagnosis"}
                  </div>
                  <div className="small">{r.treatment || "No treatment"}</div>
                </div>
                <div className="item-actions">
                  <button className="btn btn-small" onClick={() => edit(r)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => remove(r._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ New Section: Patients who booked this doctor */}
      <div className="card mt">
        <h3>📅 Appointments from Patients</h3>
        {loading ? (
          <div>Loading...</div>
        ) : appointments.length === 0 ? (
          <div>No appointments found.</div>
        ) : (
          <div className="list">
            {appointments.map((a) => (
              <div className="list-item" key={a._id}>
                <div>
                  <div className="item-title">
                    👤 {a.patient?.name || "Unknown Patient"}
                  </div>
                  <div className="muted">
                    📆 {a.date} • ⏰ {formatTime(a.time)}
                  </div>
                  {a.reason && (
                    <div className="small" style={{ marginTop: 6 }}>
                      📝 Reason: {a.reason}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
