import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/configdb";

export interface VoucherAttributes {
  id: number;
  code: string; 
  discountType: "PERCENT" | "FIXED";
  discountValue: string; // DECIMAL -> string
  minOrderValue?: string | null; // giá trị đơn hàng tối thiểu
  maxDiscountValue?: string | null;
  expiredAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VoucherCreationAttributes
  extends Optional<
    VoucherAttributes,
    "id" | "minOrderValue" | "createdAt" | "updatedAt"| "maxDiscountValue"
  > {}

class Voucher
  extends Model<VoucherAttributes, VoucherCreationAttributes>
  implements VoucherAttributes
{
  public id!: number;
  public code!: string;
  public discountType!: "PERCENT" | "FIXED";
  public discountValue!: string;
  public minOrderValue!: string | null;
  public maxDiscountValue!: string | null;
  public expiredAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Voucher.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    discountType: {
      type: DataTypes.ENUM("PERCENT", "FIXED"),
      allowNull: false,
    },
    discountValue: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    minOrderValue: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    maxDiscountValue: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    expiredAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: "vouchers",
    modelName: "Voucher",
    timestamps: true,
  }
);

export default Voucher;
