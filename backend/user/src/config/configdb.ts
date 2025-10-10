import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const DB_PASS = process.env.DB_PASS;

const sequelize = new Sequelize("shopute", "root", DB_PASS, {
  host: "localhost",
  dialect: "mysql",
  timezone: "+07:00",
  logging: false,
  dialectOptions: {
    useUTC: false,
  },
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

// 👉 export cả instance sequelize để models, migration dùng
export default sequelize;
