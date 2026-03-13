const mongoose = require("mongoose");

const exposomeDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, default: Date.now },
    aqi: { type: Number, default: 0 },
    weather: {
      temp: Number,
      humidity: Number,
      description: String,
    },
    uvIndex: { type: Number, default: 0 },
    pathogenRisk: { type: String, default: "low" },
    suggestions: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExposomeData", exposomeDataSchema);
