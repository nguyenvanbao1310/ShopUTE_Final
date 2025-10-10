import { Op } from "sequelize";
import RatingModel from "../models/rating";
import OrderModel from "../models/Order";
import OrderDetailModel from "../models/OrderDetail";
import UserModel from "../models/User";
import CouponModel from "../models/Coupon";

const Rating = RatingModel as any;
const Order = OrderModel as any;
const OrderDetail = OrderDetailModel as any;
const User = UserModel as any;
const Coupon = CouponModel as any;

export type CreateRatingPayload = {
  rating: number;
  comment?: string;
  rewardType?: "points" | "coupon";
};

export async function getProductRatingsSvc(productId: number) {
  const ratings = await Rating.findAll({
    where: { productId },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });

  return ratings.map((r: any) => ({
    id: r.id,
    productId: r.productId,
    userId: r.userId,
    rating: parseFloat(r.rating),
    comment: r.comment,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    user: { id: r.User?.id, name: `${r.User?.firstName ?? ""} ${r.User?.lastName ?? ""}`.trim() },
  }));
}

function generateCouponCode(prefix: string = "REV"): string {
  const rand = Math.random().toString(36).toUpperCase().slice(2, 8);
  const time = Date.now().toString(36).toUpperCase().slice(-4);
  return `${prefix}-${time}${rand}`;
}

export async function createProductRatingSvc(
  productId: number,
  userId: number,
  payload: CreateRatingPayload
) {
  const { rating, comment, rewardType = "points" } = payload;

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    const err: any = new Error("Rating must be between 1 and 5");
    err.status = 400;
    throw err;
  }

  // check purchased and completed
  const purchased = await OrderDetail.findOne({
    where: { productId },
    include: [
      {
        model: Order,
        as: "Order",
        required: true,
        where: { userId, status: { [Op.eq]: "COMPLETED" } },
      },
    ],
  });
  if (!purchased) {
    const err: any = new Error("Bạn chỉ có thể đánh giá khi đã mua và hoàn tất đơn hàng.");
    err.status = 403;
    throw err;
  }

  // prevent duplicate rating per user per product
  const existed = await Rating.findOne({ where: { productId, userId } });
  if (existed) {
    const err: any = new Error("Bạn đã đánh giá sản phẩm này rồi.");
    err.status = 409;
    throw err;
  }

  const created = await Rating.create({ productId, userId, rating, comment });

  // reward
  let reward: any = null;
  if (rewardType === "points") {
    const POINTS_PER_REVIEW = 50;
    const user = await User.findByPk(userId);
    if (user) {
      user.loyaltyPoints = (user.loyaltyPoints || 0) + POINTS_PER_REVIEW;
      await user.save();
    }
    reward = { type: "points", points: POINTS_PER_REVIEW };
  } else if (rewardType === "coupon") {
    const code = generateCouponCode();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const coupon = await Coupon.create({
      code,
      userId,
      type: "PERCENT",
      value: 5, // 5% off
      minOrderAmount: null,
      expiresAt,
      isUsed: false,
    });
    reward = { type: "coupon", code: coupon.code, percent: 5, expiresAt };
  }

  return { id: created.id, reward };
}

