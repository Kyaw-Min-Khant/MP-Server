import express from "express";
import { createFeedback } from "../../Controllers/Client/FeedBackController.js";
import { verifyToken } from "../../middleware/authmiddleware.js";
const router = express.Router();
router.post("/", verifyToken, createFeedback);
export default router;
