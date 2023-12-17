import express from "express";
import {
  getSingleUser,
  getUser,
} from "../../Controllers/Client/UserController.js";
import { verifyToken } from "../../middleware/authmiddleware.js";
const router = express.Router();
router.get("/", getSingleUser);
router.get("/user", verifyToken, getUser);
export default router;
