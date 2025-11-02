import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get all doctors
router.get("/", authMiddleware, async (req, res) => {
  const doctors = await User.find({ role: "doctor" }).select("-password");
  res.json(doctors);
});

// Delete doctor
router.delete("/:id", authMiddleware, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Doctor deleted" });
});

export default router;
