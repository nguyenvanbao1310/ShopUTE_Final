import { Router } from "express";
import * as shippingMethodController from "../controllers/shippingMethodController";

const router = Router();

router.get("/", shippingMethodController.getAllShippingMethods);
router.get("/:id", shippingMethodController.getShippingMethodById);
router.post("/", shippingMethodController.createShippingMethod);
router.put("/:id", shippingMethodController.updateShippingMethod);
router.delete("/:id", shippingMethodController.deleteShippingMethod);

export default router;
