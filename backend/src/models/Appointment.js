import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  sessionId: String,
  ownerName: String,
  petName: String,
  phone: String,
  dateTime: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Appointment", AppointmentSchema);
