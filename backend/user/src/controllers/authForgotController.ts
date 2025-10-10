// src/controllers/authForgotController.ts
import { Request, Response } from "express";
import { sendResetOtpSvc, verifyResetOtpSvc, resetPasswordSvc } from "../services/authForgotService";

export const sendResetOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Thiếu email" });
    const result = await sendResetOtpSvc(email);
    return res.json(result);
  } catch (e: any) {
    return res.status(e?.status || 500).json({ message: e?.message || "Lỗi server" });
  }
};

export const verifyResetOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || otp === undefined) return res.status(400).json({ message: "Thiếu email hoặc otp" });
    const result = await verifyResetOtpSvc(email, Number(otp));
    return res.json(result);
  } catch (e: any) {
    return res.status(e?.status || 500).json({ message: e?.message || "Lỗi server" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) return res.status(400).json({ message: "Thiếu token hoặc mật khẩu mới" });
    const result = await resetPasswordSvc(resetToken, newPassword);
    return res.json(result);
  } catch (e: any) {
    return res.status(e?.status || 500).json({ message: e?.message || "Lỗi server" });
  }
};
