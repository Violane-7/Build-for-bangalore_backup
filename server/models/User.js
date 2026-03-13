const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dob: { type: Date, required: true },
    emergencyContacts: [
      {
        name: String,
        phone: String,
        relation: String,
      },
    ],
    linkedProfiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    insuranceId: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
