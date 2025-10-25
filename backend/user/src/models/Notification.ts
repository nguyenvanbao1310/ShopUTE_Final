import { DataTypes, Model, Optional }  from "sequelize";
import sequelize  from "../config/configdb";
import User from "./User";

export interface NotificationAttributes {
  id: number;
  receiverId: number; 
  receiverRole: "user" | "admin";
  type?: "ORDER" | "COMMENT" | "REVIEW" | "SYSTEM" | "LOYALTY";
  title: string;
  message: string;
  actionUrl?: string | null;
  isRead?: boolean;
  sendEmail?: boolean;
  createdAt?: Date;
}

export interface NotificationCreationAttributes
  extends Optional<
    NotificationAttributes,
    "id" | "type" | "actionUrl" | "isRead" | "sendEmail" | "createdAt"
  > {}

class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public id!: number;
  public receiverId!: number;
  public receiverRole!: "user" | "admin";
  public type!: "ORDER" | "COMMENT" | "REVIEW" | "SYSTEM"| "LOYALTY";
  public title!: string;
  public message!: string;
  public actionUrl!: string | null;
  public isRead!: boolean;
  public sendEmail!: boolean;
  public readonly createdAt!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    receiverId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "receiver_id",
    },
    receiverRole: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      field: "receiver_role",
    },
    type: {
      type: DataTypes.ENUM("ORDER", "COMMENT", "REVIEW", "SYSTEM", "LOYALTY"),
      defaultValue: "SYSTEM",
      allowNull: false,
    },
    title: { type: DataTypes.STRING(255), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    actionUrl: { type: DataTypes.STRING(255), allowNull: true, field: "action_url" },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false, field: "is_read" },
    sendEmail: { type: DataTypes.BOOLEAN, defaultValue: false, field: "send_email" },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "notifications",
    modelName: "Notification",
    timestamps: false,
  }
);

// Quan hệ với bảng User (nếu có)
if (User) {
  Notification.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });
  User.hasMany(Notification, { foreignKey: "receiverId", as: "notifications" });
}

export default Notification;