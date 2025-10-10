import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/configdb";

export interface ShippingMethodAttributes {
  id: number;
  name: string;
  fee: string; // DECIMAL -> string
  estimatedDays?: string | null; // vd: "2-3 ngày"
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ShippingMethodCreationAttributes
  extends Optional<
    ShippingMethodAttributes,
    "id" | "estimatedDays" | "createdAt" | "updatedAt"
  > {}

class ShippingMethod
  extends Model<
    ShippingMethodAttributes,
    ShippingMethodCreationAttributes
  >
  implements ShippingMethodAttributes
{
  public id!: number;
  public name!: string;
  public fee!: string;
  public estimatedDays!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ShippingMethod.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    fee: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    estimatedDays: { type: DataTypes.STRING(50), allowNull: true },
  },
  {
    sequelize,
    tableName: "shipping_methods",
    modelName: "ShippingMethod",
    timestamps: true,
  }
);

export default ShippingMethod;
