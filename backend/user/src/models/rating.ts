import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from "../config/configdb";

export interface RatingAttributes {
  id?: number;
  productId: number;
  userId: number;
  rating: number;
  comment?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
type RatingCreationAttributes = Optional<
  RatingAttributes,
  "id" | "createdAt" | "updatedAt"
>;

class Rating 
extends Model<RatingAttributes, RatingCreationAttributes> 
implements RatingAttributes {
  id?: number;
  productId!: number;
  userId!: number;
  rating!: number;
  comment?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

Rating.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.DECIMAL(2,1), allowNull: false },
  comment: { type: DataTypes.TEXT },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  sequelize,
  modelName: 'Rating',
  tableName: 'ratings',
  timestamps: true
});

export default Rating;