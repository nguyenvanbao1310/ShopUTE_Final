import express, { Request, Response } from "express";
import path from "path";
import { connectDB } from "./config/configdb"; // đường dẫn tới file db.ts
import authRoutes from "./routes/authRoutes";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import authForgotRoutes from "./routes/authForgotRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productImageRoutes from "./routes/productImageRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import addressRoutes from "./routes/addressRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import viewedRoutes from "./routes/viewedRoutes";
import voucherRoutes from "./routes/voucherRoutes";
import shippingMethodRoutes from "./routes/shippingMethodRoutes";
import { associateModels } from "./models";
import { startCronJobs } from "./cronJobs";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8088;

app.use("/images", express.static(path.join(process.cwd(), "public/images")));

associateModels();

app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true, // nếu cần gửi cookie
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authForgotRoutes);

app.use(express.json());
app.use("/api/", authRoutes);
app.use("/api/users", userRoutes); // thêm dòng này
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/product-images", productImageRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/viewed", viewedRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/shipping-methods", shippingMethodRoutes);
// Kết nối DB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Backend chạy bằng TypeScript 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  startCronJobs();
});
