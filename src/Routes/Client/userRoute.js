import express from "express";
import {
  eidtUser,
  getAllUser,
  getSingleUser,
  getUser,
} from "../../Controllers/Client/UserController.js";
import { verifyToken } from "../../middleware/authmiddleware.js";
const router = express.Router();
router.get("/q&auser/:id", getSingleUser);
router.get("/user", verifyToken, getUser);
router.put("/user", verifyToken, eidtUser);
router.get("/getAllUser", verifyToken, getAllUser);
export default router;
