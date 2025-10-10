import { Model, DataTypes } from "sequelize";
import sequelize from "../config/configdb";
import User from "./User";
import Product from "./Product";

export interface WishlistAttributes {
  id?: number;
  userId: number;
  productId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Wishlist extends Model<WishlistAttributes> implements WishlistAttributes {
  public id!: number;
  public userId!: number;
  public productId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Wishlist.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Wishlists",
    modelName: "Wishlist",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "productId"],
      },
    ],
  }
);

export default Wishlist;
