import { useMemo } from "react";
import { CartItemDTO } from "../store/cartSlice";
import { Voucher } from "../types/voucher";
import { ShippingMethod } from "../types/shippingMethod";
import { POINTS_TO_VND_RATE } from "../types/order";

interface UseOrderCalculationParams {
  items: CartItemDTO[];
  voucher: Voucher | null;
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
  voucher,
  shippingMethod,
  usedPoints
}: UseOrderCalculationParams): OrderCalculation => {
  return useMemo(() => {
    const errors: string[] = [];
    
    // Tính subtotal
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Validate items
    if (items.length === 0) {
      errors.push("Giỏ hàng trống");
    }
    
    // Tính shipping fee
    const shippingFee = shippingMethod ? Number(shippingMethod.fee) : 0;
    
    // Tính discount từ voucher
    let discount = 0;
    if (voucher && subtotal > 0) {
      if (voucher.discountType === "PERCENT") {
        discount = Math.min(
          (subtotal * Number(voucher.discountValue)) / 100,
          voucher.maxDiscountValue ? Number(voucher.maxDiscountValue) : Infinity
        );
      } else {
        discount = Number(voucher.discountValue);
      }
      
      // Validate voucher minimum order
      if (voucher.minOrderValue && subtotal < Number(voucher.minOrderValue)) {
        errors.push(`Đơn hàng tối thiểu ${Number(voucher.minOrderValue).toLocaleString()}₫ để sử dụng voucher`);
        discount = 0; // Reset discount nếu không đủ điều kiện
      }
    }
    
    // Tính discount từ points
    const discountFromPoints = usedPoints * POINTS_TO_VND_RATE;
    
    // Tính final total
    let finalTotal = subtotal + shippingFee - discount - discountFromPoints;
    
    // Validate final total không âm
    if (finalTotal < 0) {
      finalTotal = 0;
      errors.push("Tổng giảm giá vượt quá giá trị đơn hàng");
    }
    
    // Validate minimum order (thường >= 0 hoặc có thể có minimum)
    const MINIMUM_ORDER = 10000; // 10k VND minimum
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
      errors
    };
  }, [items, voucher, shippingMethod, usedPoints]);
};