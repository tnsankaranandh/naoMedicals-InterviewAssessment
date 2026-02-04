const express = require("express");
const Conversation = require("../models/Conversation");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * CREATE OR FETCH CONVERSATION
 */
router.post("/", auth, async (req, res) => {
  const { doctorId, patientId } = req.body;

  let conversation = await Conversation.findOne({ doctorId, patientId });

  if (!conversation) {
    conversation = await Conversation.create({
      doctorId,
      patientId
    });
  }

  res.json(conversation);
});

/**
 * GET USER CONVERSATIONS
 */
router.get("/", auth, async (req, res) => {
  const { doctorId, patientId } = req.body;
  const conversations = await Conversation.find({
    doctorId, patientId
  }).sort({ updatedAt: -1 });

  res.json(conversations);
});

module.exports = router;
