import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import * as orderController from "../controllers/orderControllers";

const router = Router();

router.post("/create", authMiddleware, orderController.createOrder);
router.post("/confirm", authMiddleware, orderController.confirmOrder);
router.post("/ship", authMiddleware, orderController.shipOrder);
router.post(
  "/cancel-pending",
  authMiddleware,
  orderController.cancelOrderPending
);
router.post(
  "/cancel-request",
  authMiddleware,
  orderController.requestCancelOrder
);
router.get("/user", authMiddleware, orderController.getUserOrders);
export default router;
