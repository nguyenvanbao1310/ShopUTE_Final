import { Op, Sequelize } from "sequelize";
import { CouponAttributes  } from "../types/counpon";
import { Coupon } from "../models";
import UserCoupon from "../models/UserCoupon";
export const createCoupon = async (data: CouponAttributes) => {
  return await Coupon.create(data);
};

/** 📋 Lấy toàn bộ coupon */
export const getAllCoupons = async () => {
  return await Coupon.findAll();
};

/** 🔍 Lấy coupon theo mã code (chưa hết hạn) */
export const getCouponByCode = async (code: string) => {
  const now = new Date();
  return await Coupon.findOne({
    where: {
      code,
      expiresAt: { [Op.gte]: now },
    },
  });
};

/** ✏️ Cập nhật coupon */
export const updateCoupon = async (
  id: number,
  data: Partial<CouponAttributes>
) => {
  const coupon = await Coupon.findByPk(id);
  if (!coupon) return null;
  return await coupon.update(data);
};

/** 🗑️ Xoá coupon */
export const deleteCoupon = async (id: number) => {
  const coupon = await Coupon.findByPk(id);
  if (!coupon) return null;
  await coupon.destroy();
  return true;
};

/** 💰 Tìm coupon tốt nhất cho đơn hàng theo orderTotal */
export const getBestCouponsForOrder = async (orderTotal: number, userId?: number) => {
  const now = new Date();
  let usedCouponIds: number[] = [];
  if (userId) {
    const userUsed = await UserCoupon.findAll({
      where: { userId },
      attributes: ["couponId"],
    });
    usedCouponIds = userUsed.map((r) => r.couponId);
  }
  return await Coupon.findAll({
    where: {
      isUsed: false, // ✅ chỉ lấy coupon chưa dùng
      expiresAt: { [Op.gte]: now }, // ✅ chưa hết hạn
      id: { [Op.notIn]: usedCouponIds }, // ✅ chưa dùng bởi user
      [Op.or]: [
        { minOrderAmount: null },
        { minOrderAmount: { [Op.lte]: orderTotal } },
      ],
      ...(userId ? { [Op.or]: [{ userId }, { userId: null }] } : {}), 
      // ✅ nếu userId được truyền vào -> lấy coupon của user hoặc coupon chung (userId=null)
    },
    attributes: {
      include: [
        [
          Sequelize.literal(`
            CASE 
              WHEN type = 'AMOUNT' 
                THEN CAST(value AS DECIMAL(14,2)) 
              WHEN type = 'PERCENT' 
                THEN LEAST(
                  (CAST(value AS DECIMAL(5,2)) / 100) * ${orderTotal},
                  COALESCE(CAST(maxDiscountValue AS DECIMAL(14,2)), (CAST(value AS DECIMAL(5,2)) / 100) * ${orderTotal})
                )
              ELSE 0
            END
          `),
          "estimatedDiscount",
        ],
      ],
    },
    order: [
      [Sequelize.literal("estimatedDiscount"), "DESC"],
      ["expiresAt", "ASC"],
    ],
  });
};