import React, { useEffect, useState } from "react";
import API from "../api";

export default function Appointments({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ Fetch appointments for logged-in user (doctor/patient)
        const res = await API.get("/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAppointments(res.data || []);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setMessage("⚠️ Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
  };

  if (loading)
    return (
      <div className="card" style={{ textAlign: "center" }}>
        Loading appointments...
      </div>
    );

  return (
    <div>
      <h2 className="page-title">📅 Appointments</h2>

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

      {appointments.length === 0 ? (
        <div className="card muted" style={{ textAlign: "center" }}>
          No appointments found.
        </div>
      ) : (
        <div className="card">
          <div className="list">
            {appointments.map((a) => (
              <div key={a._id} className="list-item">
                <div>
                  {/* ✅ Role-based view */}
                  {user?.role === "doctor" ? (
                    <>
                      <div className="item-title">
                        👤 {a.patient?.name || "Unknown Patient"}
                      </div>
                      <div className="muted">
                        📧 {a.patient?.email || "No email"}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="item-title">
                        🧑‍⚕️ {a.doctor?.name || "Doctor"}
                      </div>
                      <div className="muted">
                        📧 {a.doctor?.email || "No email"}
                      </div>
                    </>
                  )}

                  <div className="muted">
                    📆 {a.date} • ⏰ {formatTime(a.time)}
                  </div>

                  {a.reason && (
                    <div className="small" style={{ marginTop: 6 }}>
                      📝 {a.reason}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
