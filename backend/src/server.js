 import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import debugRoutes from "./routes/debugRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = Array.from(
  new Set(
    (process.env.CLIENT_URL || "http://localhost:5173,http://localhost:5175")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  )
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Campus Cart API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/ai", aiRoutes);

// Dev-only debug endpoints
if (process.env.NODE_ENV !== "production") {
  app.use("/api/debug", debugRoutes);
}

// Error handler
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Something went wrong",
  });
});

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Campus Cart API running on port ${port}`);
      console.log(`MONGODB connected`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });