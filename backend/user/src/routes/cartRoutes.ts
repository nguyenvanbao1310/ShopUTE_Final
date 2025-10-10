import { Router } from "express";
import * as CartCtrl from "../controllers/cartControllers";
import { ensureCartContext } from "../middleware/deviceContext";
import {authMiddleware} from "../middleware/auth";
const router = Router();

router.use(ensureCartContext);

// Guest & User đều dùng được (không bắt login)
router.get("/", CartCtrl.getCart);
router.post("/items", CartCtrl.addItem);
router.patch("/items/:id", CartCtrl.updateItem);
router.delete("/items/:id", CartCtrl.removeItem);
router.delete("/clear", CartCtrl.clearCart);
router.post("/toggle-select-all", CartCtrl.toggleSelectAll);

// Bắt buộc đăng nhập: merge guest -> user
router.post("/merge", authMiddleware, CartCtrl.mergeGuestCart);

export default router;
