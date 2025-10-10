// src/routes/authForgotRoutes.ts
import { Router } from "express";
import { sendResetOtp, verifyResetOtp, resetPassword } from "../controllers/authForgotController";
const router = Router();

router.post("/forgot-password", sendResetOtp);            // gửi OTP đến email
router.post("/forgot-password/verify-otp", verifyResetOtp); // xác thực OTP -> trả resetToken
router.post("/forgot-password/reset", resetPassword);     // đổi mật khẩu bằng resetToken

export default router;
