
import express from "express";
import { generateDescription } from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

import { suggestPrice } from "../controllers/aiController.js";



const router = express.Router();

router.post("/description", protect, generateDescription);

router.post("/suggest-price", protect, suggestPrice);

export default router;