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
    try {
      const { conversationId } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      // For Vercel: store base64 or use external cloud storage (S3, etc.)
      // This example stores metadata; implement S3 upload for production
      const audioData = req.file.buffer.toString('base64');
      const audioUrl = `data:${req.file.mimetype};base64,${audioData}`;

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
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
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
