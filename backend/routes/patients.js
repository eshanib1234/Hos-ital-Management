import express from "express";
import PatientRecord from "../models/PatientRecord.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get all patient records
router.get("/", authMiddleware, async (req, res) => {
  const records = await PatientRecord.find();
  res.json(records);
});

// Add new record
router.post("/", authMiddleware, async (req, res) => {
  const record = new PatientRecord(req.body);
  await record.save();
  res.json(record);
});

// Update record
router.put("/:id", authMiddleware, async (req, res) => {
  const updated = await PatientRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete record
router.delete("/:id", authMiddleware, async (req, res) => {
  await PatientRecord.findByIdAndDelete(req.params.id);
  res.json({ message: "Record deleted" });
});

export default router;
