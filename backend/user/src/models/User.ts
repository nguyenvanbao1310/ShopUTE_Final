import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/configdb"; // chỉnh lại đường dẫn tới file config DB của bạn

// 1. Khai báo interface attributes
export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender?: boolean | null;         
  birthday?: Date | null;          
  avatar_url?: string | null;     
  otp?: string | null;
  otpExpire?: Date | null;
  role: "user" | "admin";
  loyaltyPoints?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Khai báo attributes khi tạo (id, createdAt, updatedAt sẽ tự sinh)
export interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"| "gender" | "birthday" | "avatar_url"> {}

// 3. Tạo class User kế thừa Sequelize Model
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public phone!: string;
  public gender!: boolean | null;
  public birthday!: Date | null;
  public avatar_url!: string | null;
  public otp!: string | null;
  public otpExpire!: Date | null;
  public role!: "user" | "admin";
  public loyaltyPoints!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4. Khởi tạo model với schema
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    gender: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    otp: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    otpExpire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    loyaltyPoints: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize, // truyền kết nối DB
    tableName: "users",
    modelName: "User",
    timestamps: true, // để Sequelize tự sinh createdAt, updatedAt
  }
);

export default User;
