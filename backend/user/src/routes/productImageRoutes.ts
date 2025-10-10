import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { createProductImage, updateProductImage, getAllProductImages } from "../controllers/productImageControllers";

const router = Router();

router.get("/all", getAllProductImages);
router.post("/", authMiddleware, createProductImage);
router.put("/:id", authMiddleware, updateProductImage);

export default router;
