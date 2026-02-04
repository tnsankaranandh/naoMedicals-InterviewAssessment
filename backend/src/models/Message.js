const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  senderRole: String,
  type: { type: String, enum: ["text", "audio"] },
  textContent: String,
  audioUrl: String,
  timestamp: { type: Date, default: Date.now }
});

MessageSchema.index({ textContent: "text" });

module.exports = mongoose.model("Message", MessageSchema);
