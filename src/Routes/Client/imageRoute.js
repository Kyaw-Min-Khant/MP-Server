import express from "express";
import { successResponse } from "../../utils/req&res.js";
import { ImageData } from "../../image/image.js";

const router = express.Router();
router.get("/", async (req, res) => {
  return successResponse(200, { images: ImageData }, res);
});
export default router;
