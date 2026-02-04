const express = require("express");
const Message = require("../models/Message");
const ChatSummary = require("../models/ChatSummary");
const auth = require("../middleware/auth.middleware");
const generateSummary = require("../utils/aiSummary");

const router = express.Router();

/**
 * GENERATE AI SUMMARY
 */
router.post("/:conversationId", auth, async (req, res) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId
  });
  console.log('messages ');
  console.log(messages);

  const summaryText = await generateSummary(messages);

  const summary = await ChatSummary.create({
    conversationId: req.params.conversationId,
    summaryText
  });

  res.json(summary);
});

module.exports = router;
