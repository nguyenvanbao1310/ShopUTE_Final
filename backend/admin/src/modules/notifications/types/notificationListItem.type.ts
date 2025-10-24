type NotificationListItem = {
  id: number;
  orderId: number;
  customerId: number | null;
  status: string;
  createdAt: Date;
  title: string;
  message: string;
};
export type { NotificationListItem };