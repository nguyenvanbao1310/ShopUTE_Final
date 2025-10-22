import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { updateUserRating } from "../controllers/ratingControllers";

const router = Router();

// Update user rating
router.patch("/:id", authMiddleware, updateUserRating);

export default router;
