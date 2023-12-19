import express from "express";
import {
  logOut,
  login,
  register,
} from "../../Controllers/Client/UserController.js";
import { verifyToken } from "../../middleware/authmiddleware.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyToken, logOut);

export default router;
