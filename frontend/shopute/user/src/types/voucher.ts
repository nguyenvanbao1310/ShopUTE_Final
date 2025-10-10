export interface Voucher {
  id: number;
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: string;
  minOrderValue?: string | null;
  maxDiscountValue?: string | null;
  expiredAt: string;
}