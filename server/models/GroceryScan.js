const mongoose = require("mongoose");

const groceryScanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, default: Date.now },
    items: [
      {
        name: String,
        quantity: String,
        category: String,
      },
    ],
    nutritionAnalysis: { type: mongoose.Schema.Types.Mixed, default: {} },
    recommendations: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroceryScan", groceryScanSchema);
