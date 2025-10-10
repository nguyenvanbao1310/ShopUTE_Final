import express, { Request, Response } from "express";
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/User"; // model sequelize
import { register, verifyOtp } from "../controllers/authControllers";
import { validateRegister } from "../middleware/validateRegister";

// const app = express();
// app.use(express.json());
const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Tìm user theo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    // 2. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // 3. Tạo JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "mysecret",
      { expiresIn: "1h" }
    );

    // 4. Trả về token
    res.json({
      message: "Đăng nhập thành công",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

router.post("/register", validateRegister, register);
router.post("/verify-otp", verifyOtp);

export default router;

