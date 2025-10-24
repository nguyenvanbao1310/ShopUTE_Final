import { Request, Response } from "express";
import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
} from "../services/notificationService";


export async function getNotifications(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    console.log("🧠 req.user:", (req as any).user);
    const notifications = await getUserNotifications(userId);
    res.json({ success: true, count: notifications.length, data: notifications });
  } catch (error: any) {
    console.error("❌ getNotifications error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function markAsRead(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await markNotificationAsRead(id);
    res.json({ success: true, message: "Đã đánh dấu là đã đọc" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}


export async function markAll(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    await markAllAsRead(userId);
    res.json({ success: true, message: "Tất cả thông báo đã được đánh dấu là đã đọc" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function removeNotification(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await deleteNotification(id);
    res.json({ success: true, message: "Đã xoá thông báo" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
