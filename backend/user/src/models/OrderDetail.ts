import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/configdb";

export interface OrderDetailAttributes {
  id: number;
  orderId: number;
  productId: number;
  quantity: number; 
  subtotal: string; 

  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderDetailCreationAttributes
  extends Optional<OrderDetailAttributes, "id" | "createdAt" | "updatedAt"> {}

class OrderDetail
  extends Model<OrderDetailAttributes, OrderDetailCreationAttributes>
  implements OrderDetailAttributes
{
  public id!: number;
  public orderId!: number;
  public productId!: number;
  public quantity!: number;
  public subtotal!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrderDetail.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
    subtotal: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  },
  {
    sequelize,
    tableName: "order_details",
    modelName: "OrderDetail",
    timestamps: true,
  }
);

export default OrderDetail;
