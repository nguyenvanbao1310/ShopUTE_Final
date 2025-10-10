import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { User } from "../models/User";
import { registerUserSvc, verifyOtpSvc } from "../services/authService";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; // bạn nên cho vào process.env
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables");
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { regToken } = await registerUserSvc(req.body);
    return res.status(201).json({
      message: "Đăng ký thành công. Vui lòng kiểm tra email để nhập OTP xác thực.",
      regToken
    });
  } catch (e: any) {
    return res.status(e?.status || 500).json({ message: e?.message || "Lỗi máy chủ" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const user = await verifyOtpSvc(req.body);
    return res.status(200).json({ message: "Xác thực OTP thành công", user });
  } catch (e: any) {
    return res.status(e?.status || 500).json({ message: e?.message || "Lỗi máy chủ" });
  }
};
