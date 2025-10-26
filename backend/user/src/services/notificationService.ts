import Notification  from "../models/Notification";
import { sendToUser } from "../config/websocket";
import { sendNotificationEmail } from "../services/mailer";
import { User } from "../models";

export interface CreateNotificationParams {
  receiverId: number;
  receiverRole: "user" | "admin";
  type?: "ORDER" | "COMMENT" | "REVIEW" | "SYSTEM" | "LOYALTY";
  title: string;
  message: string;
  actionUrl?: string;
  sendEmail?: boolean;
}

export async function createNotification({
  receiverId,
  receiverRole,
  type = "SYSTEM",
  title,
  message,
  actionUrl,
  sendEmail = false,
}: CreateNotificationParams) {
  const notif = await Notification.create({
    receiverId,
    receiverRole,
    type,
    title,
    message,
    actionUrl: actionUrl ?? null,
    sendEmail,
  });
  // sendToUser(receiverId, "NEW_NOTIFICATION", notif.toJSON());
  if (sendEmail) {
   const user = await User.findByPk(receiverId);
    if (user?.email) {
       sendNotificationEmail(user.email, title, message, actionUrl);
    }
  }
  return notif;
}
export async function getUserNotifications(userId: number) {
  return await Notification.findAll({
    where: { receiverId: userId },
    order: [["createdAt", "DESC"]],
  });
}

// Đánh dấu đã đọc 1 thông báo
export async function markNotificationAsRead(id: number) {
  return await Notification.update({ isRead: true }, { where: { id } });
}

// Đánh dấu tất cả thông báo của 1 user đã đọc
export async function markAllAsRead(userId: number) {
  return await Notification.update(
    { isRead: true },
    { where: { receiverId: userId} }
  );
}

//Xoá 1 thông báo
export async function deleteNotification(id: number) {
  return await Notification.destroy({ where: { id } });
}