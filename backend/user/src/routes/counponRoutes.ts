import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import * as couponController from "../controllers/counponController";

const router = Router();

// 🧩 Tạo coupon (cần đăng nhập)
router.post("/", authMiddleware, couponController.createCoupon);

//  Lấy tất cả coupon
router.get("/", couponController.getAllCoupons);

//  Lấy coupon còn hạn, chưa dùng, theo user + tổng đơn hàng
router.get("/valid", authMiddleware, couponController.getValidCoupons);

//  Lấy coupon theo code
router.get("/:code", couponController.getCouponByCode);

//  Cập nhật coupon
router.put("/:id", authMiddleware, couponController.updateCoupon);

//  Xoá coupon
router.delete("/:id", authMiddleware, couponController.deleteCoupon);

export default router;
