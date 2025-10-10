import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/configdb";

export interface ProductDiscountAttributes {
  id: number;
  productId: number;
  discountPercent: string;
  isActive: boolean;
  startsAt?: Date | null;
  endsAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type Creation = Optional<
  ProductDiscountAttributes,
  "id" | "isActive" | "startsAt" | "endsAt" | "createdAt" | "updatedAt"
>;

class ProductDiscount
  extends Model<ProductDiscountAttributes, Creation>
  implements ProductDiscountAttributes
{
  public id!: number;
  public productId!: number;
  public discountPercent!: string;
  public isActive!: boolean;
  public startsAt!: Date | null;
  public endsAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductDiscount.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: "productId", unique: true },
    discountPercent: { type: DataTypes.DECIMAL(5, 2), allowNull: false, field: "discountPercent" },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: "isActive" },
    startsAt: { type: DataTypes.DATE, allowNull: true, field: "startsAt" },
    endsAt: { type: DataTypes.DATE, allowNull: true, field: "endsAt" },
  },
  {
    sequelize,
    tableName: "product_discounts",
    modelName: "ProductDiscount",
    timestamps: true,
  }
);

export default ProductDiscount;