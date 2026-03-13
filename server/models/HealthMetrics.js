const mongoose = require("mongoose");

const healthMetricsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, default: Date.now },
    steps: { type: Number, default: 0 },
    sleep: { type: Number, default: 0 }, // hours
    heartRate: { type: Number, default: 0 },
    bloodPressure: {
      systolic: { type: Number, default: 0 },
      diastolic: { type: Number, default: 0 },
    },
    weight: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },
    screenTime: { type: Number, default: 0 }, // minutes
    waterIntake: { type: Number, default: 0 }, // ml
    stressLevel: { type: Number, min: 0, max: 10, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthMetrics", healthMetricsSchema);
