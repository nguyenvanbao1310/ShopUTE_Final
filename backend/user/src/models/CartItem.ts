import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/configdb";

export interface CartItemAttrs {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  selected: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
type CartItemCreation = Optional<CartItemAttrs, "id" | "selected" | "createdAt" | "updatedAt">;

class CartItem extends Model<CartItemAttrs, CartItemCreation> implements CartItemAttrs {
  public id!: number;
  public cartId!: number;
  public productId!: number;
  public quantity!: number;
  public selected!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CartItem.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    cartId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    selected: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    modelName: "CartItem",
    tableName: "cart_items",    
    timestamps: true,
  }
);

export default CartItem;
