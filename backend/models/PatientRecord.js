import mongoose from "mongoose";

const patientRecordSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    diagnosis: { type: String },
    treatment: { type: String },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("PatientRecord", patientRecordSchema);
