import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    type: {
      type: String,
      enum: ["scooter", "ebike", "bike", "car"],
      default: "scooter"
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,
      default: ""
    },

    battery: {
      type: Number,
      default: 90,
      min: 0,
      max: 100
    },

    lat: {
      type: Number,
      required: true
    },

    lng: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: [
        "available",
        "reserved",
        "in_use",
        "maintenance"
      ],
      default: "available"
    },

    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    reservedAt: {
      type: Date,
      default: null
    },

    reservationExpiresAt: {
      type: Date,
      default: null
    },

    unlockFee: {
      type: Number,
      default: 10
    },

    perMinute: {
      type: Number,
      default: 2
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Vehicle",
  vehicleSchema
);