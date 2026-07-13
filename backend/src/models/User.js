import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    hostel: { type: String, trim: true, default: "" },
    course: { type: String, trim: true, default: "" },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
