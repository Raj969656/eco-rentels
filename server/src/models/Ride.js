import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  status: {
    type: String,
    enum: ["reserved", "active", "completed", "cancelled"],
    default: "active"
  },
  startedAt: Date,
  endedAt: Date,
  durationMinutes: { type: Number, default: 0 },
  unlockFee: { type: Number, default: 0 },
  perMinute: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Ride", rideSchema);
