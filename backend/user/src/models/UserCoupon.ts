import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/configdb";

export interface UserCouponAttributes {
  id: number;
  userId: number;
  couponId: number;
  usedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCouponCreation = Optional<UserCouponAttributes, "id" | "usedAt" | "createdAt" | "updatedAt">;

class UserCoupon extends Model<UserCouponAttributes, UserCouponCreation> implements UserCouponAttributes {
  public id!: number;
  public userId!: number;
  public couponId!: number;
  public usedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserCoupon.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    couponId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    usedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: "user_coupons",
    modelName: "UserCoupon",
    timestamps: true,
    indexes: [
      { unique: true, fields: ["userId", "couponId"] },  
    ],
  }
);

export default UserCoupon;
