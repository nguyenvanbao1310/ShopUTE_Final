// models/CancelRequest.ts
import { Model, DataTypes, Optional, CreationOptional } from "sequelize";
import sequelize from "../config/configdb"; // ✅ import instance

export interface CancelRequestAttributes {
  id: number;
  orderId: number;
  userId?: number | null;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt?: Date;
  updatedAt?: Date;
}

export type CancelRequestCreationAttributes = Optional<
  CancelRequestAttributes,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export default class CancelRequest
  extends Model<CancelRequestAttributes, CancelRequestCreationAttributes>
  implements CancelRequestAttributes
{
  declare id: number;
  declare orderId: number;
  declare userId: number | null;
  declare reason: string;
  declare status: "PENDING" | "APPROVED" | "REJECTED";
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// ✅ Init trực tiếp
CancelRequest.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize, // 👈 truyền luôn instance
    tableName: "CancelRequests",
    modelName: "CancelRequest",
  }
);
