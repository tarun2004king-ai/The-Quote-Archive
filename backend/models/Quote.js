const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      default: "Unknown",
    },
    source: {
      type: String,
      default: "zenquotes",
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Most recent first is how history is always read
quoteSchema.index({ viewedAt: -1 });

module.exports = mongoose.model("Quote", quoteSchema);
