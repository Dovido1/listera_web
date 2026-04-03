import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { processImage } from "../controllers/uploadController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), processImage);

export default router;