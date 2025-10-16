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
    containsProfanity: r.containsProfanity,
    moderationStatus: r.moderationStatus,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    user: { id: r.User?.id, name: `${r.User?.firstName ?? ""} ${r.User?.lastName ?? ""}`.trim() },
  }));
}

function normalizeText(input?: string | null): string {
  if (!input) return "";
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectProfanity(comment?: string | null): boolean {
  const text = normalizeText(comment);
  if (!text) return false;
  const banned = [
    "dm", "dmm", "dcm", "vl", "vcl", "cc", "shit", "fuck", "bitch",
  ];
  return banned.some((w) => new RegExp(`(^|\\s)${w}(\\s|$)`, "i").test(text));
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
  const existed = await Rating.count({ where: { productId, userId } });
  if (existed > 2) {
    const err: any = new Error("Bạn chỉ có tối đa 3 lần đánh giá cho sản phẩm này.");
    err.status = 409;
    throw err;
  }

  const containsProfanity = detectProfanity(comment);
  const flagged = containsProfanity || Number(rating) < 3;
  const moderationStatus = flagged ? "PENDING" : "REVIEWED";

  const created = await Rating.create({
    productId,
    userId,
    rating,
    comment,
    containsProfanity,
    moderationStatus,
  });

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

export type UpdateRatingPayload = {
  rating?: number;
  comment?: string;
};

export async function updateUserRatingSvc(
  ratingId: number,
  userId: number,
  payload: UpdateRatingPayload
) {
  const found = await Rating.findOne({ where: { id: ratingId, userId } });
  if (!found) {
    const err: any = new Error("Rating not found");
    err.status = 404;
    throw err;
  }
  // Only allow editing within 30 days from creation
  const createdAt = new Date(found.createdAt as any);
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  if (diffMs > THIRTY_DAYS_MS) {
    const err: any = new Error(
      "Bạn chỉ có thể chỉnh sửa đánh giá trong vòng 30 ngày kể từ khi tạo."
    );
    err.status = 403;
    throw err;
  }
  const next: any = {};
  if (payload.rating !== undefined) {
    const r = Number(payload.rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) {
      const err: any = new Error("Rating must be between 1 and 5");
      err.status = 400;
      throw err;
    }
    next.rating = r;
  }
  if (payload.comment !== undefined) {
    next.comment = payload.comment ?? null;
  }

  const finalComment = payload.comment !== undefined ? payload.comment : found.comment;
  const finalRating = payload.rating !== undefined ? Number(payload.rating) : Number(found.rating);
  const containsProfanity2 = detectProfanity(finalComment ?? undefined);
  const flagged2 = containsProfanity2 || finalRating < 3;
  next.containsProfanity = containsProfanity2;
  next.moderationStatus = flagged2 ? "PENDING" : "REVIEWED";

  await found.update(next);
  return {
    id: found.id,
    productId: found.productId,
    userId: found.userId,
    rating: Number(found.rating),
    comment: found.comment,
    containsProfanity: found.containsProfanity,
    moderationStatus: found.moderationStatus,
    createdAt: found.createdAt,
    updatedAt: found.updatedAt,
  };
}
