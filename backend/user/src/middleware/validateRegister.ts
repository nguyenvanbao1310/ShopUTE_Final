import { Request, Response, NextFunction } from "express";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?\d{9,15}$/;

export function validateRegister(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, firstName, lastName, phone } = req.body || {};
  const errors: Record<string, string> = {};

  if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    errors.email = "Email không hợp lệ";
  }
  if (
    !firstName ||
    typeof firstName !== "string" ||
    firstName.trim().length < 2
  ) {
    errors.firstName = "Họ tối thiểu 2 ký tự";
  }
  if (!lastName || typeof lastName !== "string" || lastName.trim().length < 2) {
    errors.lastName = "Tên tối thiểu 2 ký tự";
  }
  if (!phone || typeof phone !== "string" || !PHONE_RE.test(phone.trim())) {
    errors.phone = "Số điện thoại 9–15 chữ số";
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
  }

  // Chuẩn hoá
  req.body.email = String(email).trim().toLowerCase();
  req.body.firstName = String(firstName).trim();
  req.body.lastName = String(lastName).trim();
  req.body.phone = String(phone).trim();

  next();
}
