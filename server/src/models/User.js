import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    default: null,
  },

  phone: {
    type: String,
    default: "",
  },

  googleId: {
    type: String,
    default: null,
    index: true,
  },

  avatar: {
    type: String,
    default: "",
  },

  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

export default User;