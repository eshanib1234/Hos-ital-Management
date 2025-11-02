import React, { useState, useEffect } from "react";
import axios from "axios";

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [showAppointments, setShowAppointments] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctor: "",
    date: "",
    time: "",
    condition: "",
  });

  const token = localStorage.getItem("token");

  // Fetch doctors list
  useEffect(() => {
    axios
      .get("https://hospital-backend-f0kz.onrender.com/api/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error fetching doctors:", err));
  }, [token]);

  // Fetch only this patient's appointments
  const fetchAppointments = async () => {
    try {
      const res = await axios.get("https://hospital-backend-f0kz.onrender.com/api/appointments", {

        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://hospital-backend-f0kz.onrender.com/api/appointments", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Appointment booked successfully!");
      setFormData({ doctor: "", date: "", time: "", condition: "" });
      fetchAppointments();
    } catch (error) {
      console.error("Booking failed:", error);
      alert("❌ Failed to book appointment.");
    }
  };

  return (
    <div className="container">
      <h2 className="page-title">Welcome, Patient 👋</h2>

      {!showAppointments ? (
        <>
          {/* Booking Section */}
          <div className="card">
            <h3>Book a New Appointment</h3>
            <form onSubmit={handleSubmit} className="form">
              <label>Choose Doctor:</label>
              <select
                value={formData.doctor}
                onChange={(e) =>
                  setFormData({ ...formData, doctor: e.target.value })
                }
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} — {doc.specialization}
                  </option>
                ))}
              </select>

              <label>Date:</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />

              <label>Time:</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />

              <label>Condition / Symptoms:</label>
              <textarea
                placeholder="Describe your symptoms..."
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
                required
              ></textarea>

              <button type="submit" className="btn">
                Book Appointment
              </button>
            </form>
          </div>

          {/* View Button */}
          <div className="mt" style={{ textAlign: "center" }}>
            <button
              className="btn-outline"
              onClick={() => {
                fetchAppointments();
                setShowAppointments(true);
              }}
            >
              View My Appointments
            </button>
          </div>
        </>
      ) : (
        <div className="card mt">
          <div className="flex-between" style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>My Appointments</h3>
            <button className="btn-outline" onClick={() => setShowAppointments(false)}>
              ← Back
            </button>
          </div>

          {appointments.length === 0 ? (
            <p className="muted">No appointments booked yet.</p>
          ) : (
            <div className="list mt">
              {appointments.map((apt) => (
                <div key={apt._id} className="list-item">
                  <div>
                    <div className="item-title">
                      Dr. {apt.doctor?.name || "Unknown Doctor"}
                    </div>
                    <div className="muted">
                      Condition: {apt.condition || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="small">📅 {apt.date}</div>
                    <div className="small">⏰ {apt.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;
