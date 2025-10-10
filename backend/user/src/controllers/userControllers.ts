import { Request, Response, NextFunction } from "express";
import { User } from "../models/User"; 
import userService from "../services/userService";
import { AuthRequest } from "../middleware/auth";
import { sendOTPEmail } from "../services/mailer";
const getInforUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const user = await userService.getInforUser(userId);
        res.json(user);
    } catch (error) {
        next(error);
    }
};


const updateInforUser = async (req: AuthRequest , res: Response, next: NextFunction) => {
    try {
       const userId = req.user.id; 
       const data = req.body;
       if ('role' in req.body || 'password' in req.body) {
           return res.status(400).json({ message: "Không được phép cập nhật trường này" });
       }
       const result = await userService.updateInforUser(userId, data);
       res.json({ message: "Cập nhật thông tin thành công!" });
    } catch (error) {
        next(error);
    }
};

const changePasswordUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Missing password fields" });
    }
    const { otp, email } = await userService.changePasswordUser(userId, currentPassword, newPassword);

    // ✅ Trả response ngay cho FE
    res.status(200).json({ success: true, message: "OTP sent to your email" });

    // ✅ Gửi mail ngầm, không chặn FE
    sendOTPEmail(email, otp).catch((err) => {
      console.error("Send OTP failed:", err);
    });
  } catch (error: any) {
    return res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

const confirmChangePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { otp, newPassword } = req.body;
    if (!otp || !newPassword) {
      return res.status(400).json({ success: false, message: "Missing OTP or newPassword" });
    }
    const result = await userService.confirmChangePasswordOtp(userId, otp, newPassword);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error: any) {
    return res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

export default {
    getInforUser,
    updateInforUser,
    changePasswordUser,
    confirmChangePassword
};