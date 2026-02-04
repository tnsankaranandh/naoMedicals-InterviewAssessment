const express = require("express");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const auth = require("../middleware/auth.middleware");
const uploadAudio = require("../utils/fileUpload");

const router = express.Router();

/**
 * SEND TEXT MESSAGE
 */
router.post("/text", auth, async (req, res) => {
  const { conversationId, text } = req.body;

  const message = await Message.create({
    conversationId,
    senderId: req.user.userId,
    senderRole: req.user.role,
    type: "text",
    textContent: text
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: text,
    updatedAt: new Date()
  });

  res.status(201).json(message);
});

/**
 * SEND AUDIO MESSAGE
 */
router.post(
  "/audio",
  auth,
  uploadAudio.single("audio"),
  async (req, res) => {
    const { conversationId } = req.body;

    const audioUrl = `/uploads/audio/${req.file.filename}`;

    const message = await Message.create({
      conversationId,
      senderId: req.user.userId,
      senderRole: req.user.role,
      type: "audio",
      audioUrl
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: "🎙 Voice message",
      updatedAt: new Date()
    });

    res.status(201).json(message);
  }
);

/**
 * GET CHAT HISTORY
 */
router.get("/:conversationId", auth, async (req, res) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId
  }).sort({ timestamp: 1 });

  res.json(messages);
});

/**
 * SEARCH MESSAGES
 */
router.get("/search/:conversationId", auth, async (req, res) => {
  const { q } = req.query;

  const messages = await Message.find({
    conversationId: req.params.conversationId,
    $text: { $search: q }
  });

  res.json(messages);
});

module.exports = router;
