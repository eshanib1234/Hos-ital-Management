import express from "express";
import Appointment from "../models/Appointment.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/**
 * ✅ GET all appointments (filtered by user role)
 * - Doctor: sees only appointments where they are the doctor
 * - Patient: sees only appointments they booked
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "doctor") {
      filter.doctor = req.user.id;
    } else if (req.user.role === "patient") {
      filter.patient = req.user.id;
    }

    const appointments = await Appointment.find(filter)
      .populate("doctor", "name email")
      .populate("patient", "name email")
      .sort({ date: 1, time: 1 }); // ascending order for timeline

    res.status(200).json(appointments);
  } catch (err) {
    console.error("❌ Error fetching appointments:", err);
    res.status(500).json({ message: "Error fetching appointments" });
  }
});

/**
 * ✅ POST: Create new appointment
 * - Automatically assign patient from JWT token
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { doctor, date, time, reason } = req.body;

    if (!doctor || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newAppointment = new Appointment({
      doctor,
      date,
      time,
      reason,
      patient: req.user.id, // auto-assign patient
    });

    await newAppointment.save();

    const populated = await newAppointment.populate([
      { path: "doctor", select: "name email" },
      { path: "patient", select: "name email" },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    console.error("❌ Error creating appointment:", err);
    res.status(500).json({ message: "Error creating appointment" });
  }
});

/**
 * ✅ PUT: Update appointment details
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("doctor", "name email")
      .populate("patient", "name email");

    if (!updated) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Error updating appointment:", err);
    res.status(500).json({ message: "Error updating appointment" });
  }
});

/**
 * ✅ DELETE: Cancel or remove an appointment
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting appointment:", err);
    res.status(500).json({ message: "Error deleting appointment" });
  }
});

export default router;
