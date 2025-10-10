import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as UserModel from "../models/User";
import { sendOTPEmail } from "./mailer";
import dotenv from 'dotenv';
dotenv.config();

const User: any = (UserModel as any).default || (UserModel as any).User;

const SALT = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
const OTP_MIN = Number(process.env.OTP_EXPIRE_MINUTES || 10);
const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");

class HttpError extends Error { constructor(public status: number, msg: string){ super(msg);} }
const genOTP = (): number => Math.floor(100000 + Math.random() * 900000);

type RegPayload = {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string;
  otpHash: string;
  otpExpire: string; // ISO
};

export async function registerUserSvc(input: {
  email: string; password?: string; firstName: string; lastName: string; phone: string;
}) {
  const { email, password, firstName, lastName, phone } = input;
  if (!password) throw new HttpError(400, "Thiếu mật khẩu");

  const emailNorm = email.trim().toLowerCase();

  // Không cho đăng ký nếu đã có trong Users
  if (await User.findOne({ where: { email: emailNorm } })) throw new HttpError(409, "Email đã tồn tại");
  if (await User.findOne({ where: { phone } }))          throw new HttpError(409, "Số điện thoại đã tồn tại");

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT);

  // OTP (number only)
  const otp = genOTP();
  const otpHash = await bcrypt.hash(otp.toString(), SALT);
  const otpExpireDate = new Date(Date.now() + OTP_MIN * 60 * 1000);

  // Đóng gói dữ liệu vào regToken (KHÔNG lưu DB)
  const payload: RegPayload = {
    email: emailNorm,
    passwordHash,
    firstName,
    lastName,
    phone,
    otpHash,
    otpExpire: otpExpireDate.toISOString(),
  };
  const regToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });

  // Gửi OTP qua email
  await sendOTPEmail(emailNorm, otp);
  if (process.env.NODE_ENV !== "production") console.log("[DEV OTP]", emailNorm, otp);

  // Trả token cho FE lưu tạm (localStorage/memory) để gọi verify
  return { regToken };
}

export async function verifyOtpSvc(input: { regToken?: string; otp?: number }) {
  const { regToken, otp } = input;
  if (!regToken || otp === undefined || otp === null) throw new HttpError(400, "Thiếu regToken hoặc otp");
  if (typeof otp !== "number" || !Number.isInteger(otp)) throw new HttpError(400, "OTP phải là số");

  let data: RegPayload;
  try {
    data = jwt.verify(regToken, JWT_SECRET) as RegPayload;
  } catch {
    throw new HttpError(401, "regToken không hợp lệ hoặc đã hết hạn");
  }

  const expMs = new Date(data.otpExpire).getTime();
  if (isNaN(expMs) || expMs < Date.now()) throw new HttpError(410, "OTP đã hết hạn, vui lòng đăng ký lại");

  const ok = await bcrypt.compare(otp.toString(), data.otpHash);
  if (!ok) throw new HttpError(400, "OTP không đúng");

  // Double-check tránh race (có thể ai đó vừa tạo user với email này trước khi verify)
  if (await User.findOne({ where: { email: data.email } })) throw new HttpError(409, "Email đã tồn tại");
  if (await User.findOne({ where: { phone: data.phone } })) throw new HttpError(409, "Số điện thoại đã tồn tại");

  // Tạo user thực sự sau khi verify
  const user = await User.create({
    email: data.email,
    password: data.passwordHash,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    otp: null,
    otpExpire: null,
    role: "user",
  });

  return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone, role: user.role };
}
