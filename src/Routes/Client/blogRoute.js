import express from "express";
import {
  createBlog,
  getPaysar,
} from "../../Controllers/Client/PaySarController.js";
import { verifyToken } from "../../middleware/authmiddleware.js";
const router = express.Router();

router.post("/", createBlog);
router.get("/", verifyToken, getPaysar);
export default router;
