import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type AnyJwt = { userId?: number; id?: number; sub?: number | string; [k: string]: any };

export function ensureCartContext(req: Request, res: Response, next: NextFunction) {
  // Thử đọc user từ token (nếu có), KHÔNG 401
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET as string) as AnyJwt;
      const uid = Number(payload.userId ?? payload.id ?? payload.sub);
      if (!Number.isNaN(uid)) (req as any).user = { id: uid };
    } catch {/* bỏ qua, coi như guest */}
  }

  // Lấy deviceId cho guest
  const deviceId =
    (req.headers["x-device-id"] as string) ||
    (req.query.deviceId as string) ||
    (req.body?.deviceId as string) || null;

  if (!(req as any).user?.id && !deviceId) {
    return res.status(400).json({ success: false, message: "deviceId is required for guest cart" });
  }
  (req as any).deviceId = deviceId;
  next();
}
