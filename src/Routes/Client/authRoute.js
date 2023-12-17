import express from "express";
import { login, register } from "../../Controllers/Client/UserController.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
export default router;
