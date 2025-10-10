// routes/viewedRoutes.ts
import { Router } from "express";
import {
  fetchRecentlyViewed,
  addProductViewed,
  deleteProductViewed,
} from "../controllers/viewedController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, fetchRecentlyViewed);
router.post("/:productId", authMiddleware, addProductViewed);
router.delete("/:productId", authMiddleware, deleteProductViewed);

export default router;
