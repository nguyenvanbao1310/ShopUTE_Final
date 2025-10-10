import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/configdb";

export interface ProductImageAttributes {
  id: number;
  productId: number;
  url: string;
  position: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductImageCreationAttributes
  extends Optional<ProductImageAttributes, "id" | "position" | "createdAt" | "updatedAt"> {}

class ProductImage
  extends Model<ProductImageAttributes, ProductImageCreationAttributes>
  implements ProductImageAttributes
{
  public id!: number;
  public productId!: number;
  public url!: string;
  public position!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductImage.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: "id" },
    url: { type: DataTypes.STRING(500), allowNull: false },
    position: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  },
  {
    sequelize,
    tableName: "product_images",
    modelName: "ProductImage",
    timestamps: true,
  }
);

export default ProductImage;
