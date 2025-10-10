import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/configdb";

export interface CouponAttributes {
  id: number;
  code: string;
  userId: number | null;
  type: "PERCENT" | "AMOUNT";
  value: string; // store DECIMAL as string
  minOrderAmount?: string | null;
  expiresAt?: Date | null;
  isUsed: boolean;
  usedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type CouponCreation = Optional<
  CouponAttributes,
  | "id"
  | "userId"
  | "minOrderAmount"
  | "expiresAt"
  | "isUsed"
  | "usedAt"
  | "createdAt"
  | "updatedAt"
>;

class Coupon extends Model<CouponAttributes, CouponCreation> implements CouponAttributes {
  public id!: number;
  public code!: string;
  public userId!: number | null;
  public type!: "PERCENT" | "AMOUNT";
  public value!: string;
  public minOrderAmount!: string | null;
  public expiresAt!: Date | null;
  public isUsed!: boolean;
  public usedAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Coupon.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    type: { type: DataTypes.ENUM("PERCENT", "AMOUNT"), allowNull: false, defaultValue: "PERCENT" },
    value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    minOrderAmount: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
    expiresAt: { type: DataTypes.DATE, allowNull: true },
    isUsed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    usedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: "coupons",
    modelName: "Coupon",
    timestamps: true,
  }
);

export default Coupon;

