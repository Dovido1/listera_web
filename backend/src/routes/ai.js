import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { optimizeProduct } from "../controllers/aiController.js";

const router = express.Router();

router.post("/optimize", authMiddleware, optimizeProduct);

export default router;