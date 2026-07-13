import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { createToken } from "../utils/token.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    hostel: user.hostel,
    course: user.course,
    wishlist: user.wishlist
  };
}

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, hostel, course } = req.body;
    console.log("[auth/register] incoming", { name, email, hostel, course });

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: "This email is already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, hostel, course });
    console.log("[auth/register] created user", user._id.toString());

    res.status(201).json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.get("/me", protect, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export default router;
