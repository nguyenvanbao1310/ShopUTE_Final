import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createAddress,
  updateAddress,
  deleteAddress,
  getDefaultAddress,
  getAllAddress,
  getAddressById,
} from "../controllers/addressControllers";

const router = Router();

router.post("/create", authMiddleware, createAddress);
router.put("/:id", authMiddleware, updateAddress);
router.delete("/:id", authMiddleware, deleteAddress);
router.get("/default", authMiddleware, getDefaultAddress);
router.get("/", authMiddleware, getAllAddress);
router.get("/:id", authMiddleware, getAddressById);
export default router;
