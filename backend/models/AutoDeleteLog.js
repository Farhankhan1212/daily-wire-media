const mongoose = require("mongoose");

const autoDeleteLogSchema = new mongoose.Schema(
  {
    newsTitle: { type: String, required: true },
    newsSlug: { type: String },
    category: { type: String },
    expiryDate: { type: Date },
    deletedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AutoDeleteLog", autoDeleteLogSchema);
