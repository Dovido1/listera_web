import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { publishProductToEbay } from "../controllers/ebayController.js";

const router = express.Router();

router.post("/:id/publish", authMiddleware, publishProductToEbay);

export default router;