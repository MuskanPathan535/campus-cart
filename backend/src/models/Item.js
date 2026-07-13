import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Books", "Calculator", "Cycle", "Laptop", "Hostel", "Other"]
    },
    condition: {
      type: String,
      required: true,
      enum: ["New", "Like New", "Good", "Fair"]
    },
    location: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isSold: { type: Boolean, default: false }
  },
  { timestamps: true }
);

itemSchema.index({ title: "text", description: "text", category: "text" });

export default mongoose.model("Item", itemSchema);
