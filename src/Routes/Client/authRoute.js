import express from "express";
import {
  getUser,
  login,
  register,
} from "../../Controllers/Client/UserController.js";
import { verifyToken } from "../../middleware/authmiddleware.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/user", verifyToken, getUser);
export default router;
