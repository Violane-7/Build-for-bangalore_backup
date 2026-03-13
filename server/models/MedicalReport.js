const mongoose = require("mongoose");

const medicalReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organ: { type: String, required: true }, // e.g. "heart", "thyroid", "liver"
    system: { type: String, default: "" }, // e.g. "cardiovascular", "endocrine"
    testName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    values: { type: mongoose.Schema.Types.Mixed, default: {} },
    nextTestDue: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalReport", medicalReportSchema);
