import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
} from "../controllers/wishlistController";
const router = Router();

// Lấy danh sách wishlist của user
router.get("/", authMiddleware, getUserWishlist);

// Thêm sản phẩm vào wishlist
router.post("/:productId", authMiddleware, addToWishlist);

// Xoá sản phẩm khỏi wishlist
router.delete("/:productId", authMiddleware, removeFromWishlist);

export default router;
