import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/configdb";

export interface CategoryAttributes {
  id: number;
  name: string;
  parentId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id" | "parentId" | "createdAt" | "updatedAt"> {}

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public name!: string;
  public parentId!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    parentId: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    tableName: "Categories",
    modelName: "Category",
    timestamps: true,
  }
);

export default Category;
