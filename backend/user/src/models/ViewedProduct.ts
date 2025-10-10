// models/ViewedProduct.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/configdb";
import Product from "./Product";

class ViewedProduct extends Model {}

ViewedProduct.init(
  {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "ViewedProduct" }
);

export default ViewedProduct;
