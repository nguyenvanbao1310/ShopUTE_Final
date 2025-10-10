export interface VoucherAttributes {
    id: number;
    code: string;
    description?: string;
    discountType: "PERCENT" | "FIXED";
    discountValue: string; // DECIMAL -> string
    maxDiscountValue?: string;
    minOrderValue?: string;
    expiredAt: Date;
}