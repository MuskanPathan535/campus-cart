import express from "express";
import Item from "../models/Item.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

const categories = ["Books", "Calculator", "Cycle", "Laptop", "Hostel", "Other"];

router.get("/", async (req, res, next) => {
  try {
    const { search = "", category = "", status = "available", seller = "" } = req.query;
    const filter = {};

    if (category && categories.includes(category)) filter.category = category;
    if (status === "available") filter.isSold = false;
    if (status === "sold") filter.isSold = true;
    if (seller) filter.seller = seller;
    if (search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        { location: { $regex: search.trim(), $options: "i" } }
      ];
    }

    const items = await Item.find(filter)
      .populate("seller", "name hostel course email")
      .sort({ createdAt: -1 });

    res.json({ items });
  } catch (error) {
    next(error);
  }
});

router.get("/my-listings", protect, async (req, res, next) => {
  try {
    const items = await Item.find({ seller: req.user._id })
      .populate("seller", "name hostel course email")
      .sort({ createdAt: -1 });
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

router.get("/wishlist", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "wishlist",
      populate: { path: "seller", select: "name hostel course email" }
    });

    res.json({ items: user.wishlist });
  } catch (error) {
    next(error);
  }
});

router.post("/", protect, upload.single("image"), async (req, res, next) => {
  try {
    const { title, description, price, category, condition, location } = req.body;

    if (!title || !description || !price || !category || !condition || !location) {
      return res.status(400).json({ message: "All item fields are required" });
    }

    const item = await Item.create({
      title,
      description,
      price: Number(price),
      category,
      condition,
      location,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
      seller: req.user._id
    });

    const populated = await item.populate("seller", "name hostel course email");
    res.status(201).json({ item: populated });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/sold", protect, async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the seller can update this item" });
    }

    item.isSold = !item.isSold;
    await item.save();
    res.json({ item });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/wishlist", protect, async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const user = await User.findById(req.user._id);
    const itemId = item._id.toString();
    const exists = user.wishlist.some((saved) => saved.toString() === itemId);

    user.wishlist = exists
      ? user.wishlist.filter((saved) => saved.toString() !== itemId)
      : [...user.wishlist, item._id];

    await user.save();
    res.json({ wishlist: user.wishlist, saved: !exists });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", protect, async (req, res, next) => {
  try {
    console.log("[items/delete] user", req.user?._id?.toString(), "deleting", req.params.id);
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the seller can delete this item" });
    }

    await item.remove();
    await User.updateMany({ wishlist: item._id }, { $pull: { wishlist: item._id } });

    res.json({ message: "Item deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
