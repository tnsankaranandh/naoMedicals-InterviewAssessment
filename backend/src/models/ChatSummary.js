const mongoose = require("mongoose");

const ChatSummarySchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  summaryText: String,
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChatSummary", ChatSummarySchema);
