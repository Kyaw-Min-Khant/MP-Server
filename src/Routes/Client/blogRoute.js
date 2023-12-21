import express from "express";
import {
  createBlog,
  getPaysar,
  getReply,
  getUserPaysar,
  paysarreplay,
} from "../../Controllers/Client/PaySarController.js";
import { verifyToken } from "../../middleware/authmiddleware.js";
const router = express.Router();

router.post("/", createBlog);
router.get("/", verifyToken, getPaysar);
router.put("/", verifyToken, paysarreplay);
router.get("/get_payser", verifyToken, getUserPaysar);
router.get("/reply_payser", verifyToken, getReply);
export default router;
