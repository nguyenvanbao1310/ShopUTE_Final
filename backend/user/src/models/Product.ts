import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/configdb";

export interface ProductAttributes {
  id: number;
  name: string;
  description?: string | null;
  price: string;
  viewCount: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
  thumbnailUrl?: string | null;
  categoryId: number;
  brand: string;
  cpu: string;
  ram: string;
  storage: string;
  gpu: string;
  screen: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCreationAttributes
  extends Optional<
    ProductAttributes,
    | "id"
    | "description"
    | "viewCount"
    | "stock"
    | "status"
    | "thumbnailUrl"
    | "createdAt"
    | "updatedAt"
  > {}

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public name!: string;
  public description!: string | null;
  public price!: string;
  public viewCount!: number;
  public stock!: number;
  public status!: "ACTIVE" | "INACTIVE";
  public thumbnailUrl!: string | null;
  public categoryId!: number;
  public brand!: string;
  public cpu!: string;
  public ram!: string;
  public storage!: string;
  public gpu!: string;
  public screen!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    viewCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
    thumbnailUrl: { type: DataTypes.STRING(500), allowNull: true },
    categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    brand: { type: DataTypes.STRING(100), allowNull: false },
    cpu: { type: DataTypes.STRING(100), allowNull: false },
    ram: { type: DataTypes.STRING(50), allowNull: false },
    storage: { type: DataTypes.STRING(100), allowNull: false },
    gpu: { type: DataTypes.STRING(100), allowNull: false },
    screen: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    sequelize,
    tableName: "Products",
    modelName: "Product",
    timestamps: true,
  }
);
export default Product;
