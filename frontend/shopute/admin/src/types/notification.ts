'use client';

export type OrderNotification = {
  id: number;
  orderId: number;
  customerId: number | null;
  status: string;
  createdAt: string; // ISO
  title: string;
  message: string;
};

