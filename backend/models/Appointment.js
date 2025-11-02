import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    description: {
      type: String, // renamed from reason → matches frontend "description"
    },
  },
  { timestamps: true }
);

// Optional: Add a virtual field if you want combined info later
appointmentSchema.virtual("summary").get(function () {
  return `${this.date} at ${this.time}`;
});

export default mongoose.model("Appointment", appointmentSchema);
