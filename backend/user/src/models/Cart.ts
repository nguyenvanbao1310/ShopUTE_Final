import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/configdb";

export interface CartAttrs {
  id: number;
  userId: number | null;        // null = guest
  deviceId: string | null;      // guest cart key
  createdAt?: Date;
  updatedAt?: Date;
}
type CartCreation = Optional<CartAttrs, "id" | "userId" | "deviceId" | "createdAt" | "updatedAt">;

class Cart extends Model<CartAttrs, CartCreation> implements CartAttrs {
  public id!: number;
  public userId!: number | null;
  public deviceId!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cart.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    deviceId: { type: DataTypes.STRING(100), allowNull: true, defaultValue: null },
  },
  {
    sequelize,
    modelName: "Cart",
    tableName: "Carts",          
    timestamps: true,
  }
);

export default Cart;
