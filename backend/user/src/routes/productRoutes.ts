// routes/productRoutes.ts
import { Router } from "express";
import {
  newestProducts,
  bestSellers,
  mostViewed,
  topDiscount,
  getProductDetail,
  getAllProducts,
  createProduct,
  updateProduct,
  getProductsByCategory,
  getSimilarProducts,
} from "../controllers/productControllers";
import { authMiddleware } from "../middleware/auth";
import { listProductRatings, createProductRating } from "../controllers/ratingControllers";

const router = Router();

// Lists
router.get("/newest", newestProducts); // 08 sản phẩm mới nhất
router.get("/best-sellers", bestSellers); // 06 sản phẩm bán chạy nhất
router.get("/most-viewed", mostViewed); // 08 sản phẩm xem nhiều
router.get("/top-discount", topDiscount); // 04 sản phẩm giảm sâu
router.get("/all", getAllProducts);
router.get('/category/:categoryName', getProductsByCategory);
// Detail (auto +1 view)
router.get("/:id", getProductDetail);
// Ratings for product
router.get("/:id/ratings", listProductRatings);
router.post("/:id/ratings", authMiddleware, createProductRating);
// Create / Update
router.put("/:id", authMiddleware, updateProduct);
router.post("/", authMiddleware, createProduct);
router.get("/:id/similar", getSimilarProducts);
export default router;
