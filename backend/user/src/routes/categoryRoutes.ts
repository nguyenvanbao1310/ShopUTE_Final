import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createCategory,
  updateCategory,
  getAllCategories,
} from "../controllers/categoryControllers";

const router = Router();

router.get("/all", getAllCategories);
router.post("/", authMiddleware, createCategory);
router.put("/:id", authMiddleware, updateCategory);

export default router;
