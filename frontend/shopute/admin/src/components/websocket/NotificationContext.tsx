"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

interface Notification {
  id?: number;
  title: string;
  message: string;
  actionUrl?: string;
  isRead?: boolean;
  createdAt?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notif: Notification) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notif: Notification) => {
    setNotifications((prev) => [notif, ...prev]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}
