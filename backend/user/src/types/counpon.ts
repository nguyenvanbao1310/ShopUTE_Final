export interface CouponAttributes {
  id: number;
  code: string;
  userId?: number | null;                 // Có thể gán cho user cụ thể
  type: "PERCENT" | "AMOUNT";             // Loại giảm giá
  value: string;                          // Giá trị giảm giá (DECIMAL -> string)
  minOrderAmount?: string | null;         // Giá trị đơn hàng tối thiểu
  maxDiscountValue?: string | null;       // Giảm tối đa (tùy chọn)
  expiresAt?: Date | null;                // Hạn sử dụng
  isUsed?: boolean;                       // Đã sử dụng chưa
  usedAt?: Date | null;                   // Ngày sử dụng
  createdAt?: Date;                       // Sequelize timestamps
  updatedAt?: Date;
}
