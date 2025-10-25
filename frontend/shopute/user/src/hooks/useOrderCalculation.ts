import { useMemo } from "react";
import { CartItemDTO } from "../store/cartSlice";
import { Coupon } from "../types/counpon";
import { ShippingMethod } from "../types/shippingMethod";
import { POINTS_TO_VND_RATE } from "../types/order";

interface UseOrderCalculationParams {
  items: CartItemDTO[];
  coupon: Coupon | null;
  shippingMethod: ShippingMethod | null;
  usedPoints: number;
}

interface OrderCalculation {
  subtotal: number;
  shippingFee: number;
  discount: number;
  discountFromPoints: number;
  finalTotal: number;
  isValidOrder: boolean;
  errors: string[];
}

export const useOrderCalculation = ({
  items,
  coupon,
  shippingMethod,
  usedPoints,
}: UseOrderCalculationParams): OrderCalculation => {
  return useMemo(() => {
    const errors: string[] = [];

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (items.length === 0) errors.push("Giỏ hàng trống");

    const shippingFee = shippingMethod ? Number(shippingMethod.fee) : 0;

    // 💰 Tính giảm giá coupon
    let discount = 0;
    if (coupon && subtotal > 0) {
      if (coupon.type === "PERCENT") {
        discount = Math.min(
          (subtotal * Number(coupon.value)) / 100,
          coupon.maxDiscountValue ? Number(coupon.maxDiscountValue) : Infinity
        );
      } else {
        discount = Number(coupon.value);
      }

      if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
        errors.push(
          `Đơn hàng tối thiểu ${Number(
            coupon.minOrderAmount
          ).toLocaleString()}₫ để sử dụng coupon`
        );
        discount = 0;
      }
    }

    const discountFromPoints = usedPoints * POINTS_TO_VND_RATE;
    let finalTotal = subtotal + shippingFee - discount - discountFromPoints;

    if (finalTotal < 0) {
      finalTotal = 0;
      errors.push("Tổng giảm giá vượt quá giá trị đơn hàng");
    }

    const MINIMUM_ORDER = 10000;
    if (finalTotal > 0 && finalTotal < MINIMUM_ORDER) {
      errors.push(`Đơn hàng tối thiểu ${MINIMUM_ORDER.toLocaleString()}₫`);
    }

    return {
      subtotal,
      shippingFee,
      discount,
      discountFromPoints,
      finalTotal,
      isValidOrder: errors.length === 0,
      errors,
    };
  }, [items, coupon, shippingMethod, usedPoints]);
};
