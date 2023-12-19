import express from "express";
import {
  createBlog,
  getPaysar,
  getUserPaysar,
} from "../../Controllers/Client/PaySarController.js";
import { verifyToken } from "../../middleware/authmiddleware.js";
const router = express.Router();

router.post("/", createBlog);
router.get("/", verifyToken, getPaysar);
router.get("/get_payser", verifyToken, getUserPaysar);
export default router;
