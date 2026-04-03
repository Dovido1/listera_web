import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { publishProductToEtsy } from "../controllers/marketplacesController.js";

const router = express.Router();

router.post("/etsy/:id/publish", authMiddleware, publishProductToEtsy);

export default router;