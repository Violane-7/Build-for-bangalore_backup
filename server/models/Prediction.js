const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, default: Date.now },
    riskScores: {
      diabetes: { type: Number, default: 0 },
      cardiac: { type: Number, default: 0 },
      obesity: { type: Number, default: 0 },
      stress: { type: Number, default: 0 },
      sleepDisorder: { type: Number, default: 0 },
    },
    recommendations: [{ type: String }],
    baselineComparison: {
      improvementPercent: { type: Number, default: 0 },
      previousScore: { type: Number, default: 0 },
      currentScore: { type: Number, default: 0 },
    },
    healthCredits: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prediction", predictionSchema);
