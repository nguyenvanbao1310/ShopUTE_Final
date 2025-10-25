import { api } from "./base";

export const getNotifications = () =>
  api.get("/nofi");

export const markAsRead = (id: number) =>
  api.patch(`/nofi/${id}/read`);

export const markAllAsRead = () =>
  api.patch("/nofi/read-all");

export const deleteNotification = (id: number) =>
  api.delete(`/nofi/${id}`);
