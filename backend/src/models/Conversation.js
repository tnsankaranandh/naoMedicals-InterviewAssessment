const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lastMessage: String,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Conversation", ConversationSchema);
