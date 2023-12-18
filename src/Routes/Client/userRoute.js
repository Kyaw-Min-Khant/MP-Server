import express from "express";
import {
  eidtUser,
  getSingleUser,
  getUser,
} from "../../Controllers/Client/UserController.js";
import { verifyToken } from "../../middleware/authmiddleware.js";
const router = express.Router();
router.get("/q&auser/:id", getSingleUser);
router.get("/user", verifyToken, getUser);
router.put("/user", verifyToken, eidtUser);
export default router;
