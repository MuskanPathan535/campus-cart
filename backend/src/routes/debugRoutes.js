import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Dev-only: list all users (no passwords)
router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

export default router;
