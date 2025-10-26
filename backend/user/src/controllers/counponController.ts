import * as couponService from "../services/counponService";
import { Request, Response } from "express";

/** 🧩 Tạo coupon mới */
export const createCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    return res.status(201).json({ success: true, data: coupon });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

/** 📋 Lấy tất cả coupon */
export const getAllCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await couponService.getAllCoupons();
    return res.json({ success: true, data: coupons });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** 🔍 Lấy coupon theo code */
export const getCouponByCode = async (req: Request, res: Response) => {
  try {
    const code = req.params.code as string;
    const coupon = await couponService.getCouponByCode(code);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    return res.json({ success: true, data: coupon });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** 💰 Lấy coupon còn hạn, chưa sử dụng, theo user và giá trị đơn hàng */
export const getValidCoupons = async (req: Request, res: Response) => {
  try {
    const orderTotal = Number(req.query.orderTotal ?? 0);
    const userId = (req as any).user.id;
    const coupons = await couponService.getBestCouponsForOrder(orderTotal, userId);
    return res.json({ success: true, data: coupons });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** ✏️ Cập nhật coupon */
export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const coupon = await couponService.updateCoupon(id, req.body);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    return res.json({ success: true, data: coupon });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

/** 🗑️ Xoá coupon */
export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await couponService.deleteCoupon(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    return res.json({ success: true, message: "Coupon deleted successfully" });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
