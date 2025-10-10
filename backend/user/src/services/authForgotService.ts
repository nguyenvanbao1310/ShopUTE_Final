// src/services/authForgotService.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { sendOTPEmail } from "./mailer";
import dotenv from "dotenv";
dotenv.config();

const SALT = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
const OTP_MIN = Number(process.env.OTP_EXPIRE_MINUTES || 10);
const RESET_TOKEN_MIN = Number(process.env.RESET_TOKEN_EXPIRE_MINUTES || 15);
const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");

class HttpError extends Error { constructor(public status: number, msg: string){ super(msg);} }

const genOTP = (): number => Math.floor(100000 + Math.random() * 900000);

export async function sendResetOtpSvc(email: string) {
  const emailNorm = String(email).trim().toLowerCase();
  const user = await User.findOne({ where: { email: emailNorm }});
  if (!user) throw new HttpError(404, "Không tìm thấy tài khoản với email này");

  const otp = genOTP();
  const otpHash = await bcrypt.hash(String(otp), SALT);
  const expire = new Date(Date.now() + OTP_MIN * 60 * 1000);

  // Lưu otpHash và otpExpire vào DB (hashed)
  user.otp = otpHash;
  user.otpExpire = expire;
  await user.save();

  // Gửi email
  await sendOTPEmail(emailNorm, otp);
  if (process.env.NODE_ENV !== "production") console.log("[DEV OTP RESET]", emailNorm, otp);

  return { message: "OTP đã gửi. Vui lòng kiểm tra email." };
}

export async function verifyResetOtpSvc(email: string, otp: number) {
  const emailNorm = String(email).trim().toLowerCase();
  const user = await User.findOne({ where: { email: emailNorm }});
  if (!user || !user.otp || !user.otpExpire) throw new HttpError(400, "OTP chưa được gửi hoặc đã bị xóa");

  if (new Date(user.otpExpire).getTime() < Date.now()) {
    // clear otp
    user.otp = null;
    user.otpExpire = null;
    await user.save();
    throw new HttpError(410, "OTP đã hết hạn");
  }

  const ok = await bcrypt.compare(String(otp), String(user.otp));
  if (!ok) throw new HttpError(400, "OTP không đúng");

  // OTP đúng -> xóa otp DB (optional) và trả resetToken (JWT)
  user.otp = null;
  user.otpExpire = null;
  await user.save();

  const payload = { id: user.id, action: "reset-password" };
  const resetToken = jwt.sign(payload, JWT_SECRET, { expiresIn: `${RESET_TOKEN_MIN}m` });

  return { resetToken, expiresInMinutes: RESET_TOKEN_MIN };
}

export async function resetPasswordSvc(resetToken: string, newPassword: string) {
  try {
    const decoded = jwt.verify(resetToken, JWT_SECRET) as any;
    if (!decoded || decoded.action !== "reset-password") throw new HttpError(401, "Reset token không hợp lệ");
    const userId = decoded.id;
    const user = await User.findByPk(userId);
    if (!user) throw new HttpError(404, "User không tồn tại");

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, SALT);
    user.password = hashed;
    await user.save();

    return { message: "Đổi mật khẩu thành công" };
  } catch (err: any) {
    if (err?.name === "TokenExpiredError") throw new HttpError(410, "Reset token đã hết hạn");
    throw new HttpError(401, "Reset token không hợp lệ");
  }
}
