import express from "express";
import Conversation from "../models/Conversation.js";
import Item from "../models/Item.js";
import Message from "../models/Message.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

async function findConversationForUser(id, userId) {
  return Conversation.findOne({
    _id: id,
    $or: [{ buyer: userId }, { seller: userId }]
  })
    .populate("item", "title price imageUrl isSold")
    .populate("buyer", "name hostel course")
    .populate("seller", "name hostel course");
}

router.get("/", protect, async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }]
    })
      .populate("item", "title price imageUrl isSold")
      .populate("buyer", "name hostel course")
      .populate("seller", "name hostel course")
      .sort({ updatedAt: -1 });

    res.json({ conversations });
  } catch (error) {
    next(error);
  }
});

router.post("/start/:itemId", protect, async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot chat on your own listing" });
    }

    const conversation = await Conversation.findOneAndUpdate(
      { item: item._id, buyer: req.user._id, seller: item.seller },
      { $setOnInsert: { lastMessage: "Chat request opened" } },
      { new: true, upsert: true }
    )
      .populate("item", "title price imageUrl isSold")
      .populate("buyer", "name hostel course")
      .populate("seller", "name hostel course");

    res.status(201).json({ conversation });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/messages", protect, async (req, res, next) => {
  try {
    const conversation = await findConversationForUser(req.params.id, req.user._id);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    const messages = await Message.find({ conversation: conversation._id })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json({ conversation, messages });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/messages", protect, async (req, res, next) => {
  try {
    const { text } = req.body;
    const conversation = await findConversationForUser(req.params.id, req.user._id);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });
    if (!text?.trim()) return res.status(400).json({ message: "Message cannot be empty" });

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      text: text.trim()
    });

    conversation.lastMessage = text.trim();
    await conversation.save();

    const populated = await message.populate("sender", "name");
    res.status(201).json({ message: populated });
  } catch (error) {
    next(error);
  }
});

export default router;
