import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/configdb";
import Voucher from "./Voucher";
import ShippingMethod from "./ShippingMethod";
export interface OrderAttributes {
  id: number;
  userId: number | null; // nếu có bảng Users; tạm cho phép null
  code: string; // mã đơn (unique)
  totalAmount: string; // DECIMAL -> string
  discountAmount?: string | null;
  shippingFee?: string | null;
  finalAmount?: string | null;
  usedPoints?: number;
  pointsDiscountAmount?: string | null;
  voucherId?: number | null;
  shippingMethodId?: number | null;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "CANCELLED"
    | "SHIPPED"
    | "COMPLETED"
    | "CANCEL_REQUESTED";
  paymentMethod?: string | null; // COD, VNPAY, MOMO...
  paymentStatus?: "UNPAID" | "PAID" | "REFUNDED";
  note?: string | null;
  deliveryAddress?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderCreationAttributes
  extends Optional<
    OrderAttributes,
    | "id"
    | "userId"
    | "discountAmount"
    | "shippingFee"
    | "finalAmount"
    | "usedPoints"
    | "pointsDiscountAmount"
    | "voucherId"
    | "shippingMethodId"
    | "paymentMethod"
    | "paymentStatus"
    | "note"
    | "createdAt"
    | "updatedAt"
    | "deliveryAddress"
  > {}

class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: number;
  public userId!: number | null;
  public code!: string;
  public totalAmount!: string;
  public discountAmount!: string | null;
  public shippingFee!: string | null;
  public finalAmount!: string | null;
  public usedPoints!: number;
  public pointsDiscountAmount!: string | null;
  public voucherId!: number | null;
  public shippingMethodId!: number | null;
  public status!:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "CANCELLED"
    | "SHIPPED"
    | "COMPLETED"
    | "CANCEL_REQUESTED";
  public paymentMethod!: string | null;
  public paymentStatus!: "UNPAID" | "PAID" | "REFUNDED";
  public note!: string | null;
  public deliveryAddress!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    code: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    totalAmount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
    discountAmount: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
    shippingFee: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
    finalAmount: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
    usedPoints: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
    pointsDiscountAmount: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
    voucherId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    shippingMethodId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "CANCELLED",
        "SHIPPED",
        "COMPLETED",
        "CANCEL_REQUESTED"
      ),
      allowNull: false,
      defaultValue: "PENDING",
    },
    paymentMethod: { type: DataTypes.STRING(30), allowNull: true },
    paymentStatus: {
      type: DataTypes.ENUM("UNPAID", "PAID", "REFUNDED"),
      allowNull: false,
      defaultValue: "UNPAID",
    },
    note: { type: DataTypes.TEXT, allowNull: true },
    deliveryAddress: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "orders",
    modelName: "Order",
    timestamps: true,
  }
);
Order.belongsTo(Voucher, { foreignKey: "voucherId", as: "voucher" });
Voucher.hasMany(Order, { foreignKey: "voucherId", as: "orders" });

Order.belongsTo(ShippingMethod, { foreignKey: "shippingMethodId", as: "shippingMethod" });
ShippingMethod.hasMany(Order, { foreignKey: "shippingMethodId", as: "orders" });
export default Order;
