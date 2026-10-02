const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  sourceType: { type: String, enum: ["pdf", "text", "url"], required: true },
  rawText: { type: String, required: true },
  status: { type: String, enum: ["processing", "ready", "failed"], default: "processing" },
}, { timestamps: true });

module.exports = mongoose.model("Document", documentSchema);