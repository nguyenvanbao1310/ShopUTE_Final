"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useNotifications } from "./NotificationContext";
import authStore from "../../store/authStore";

/**
 * Quản lý kết nối WebSocket realtime cho admin dashboard.
 * Lấy user và token từ authStore, không cần Redux.
 */
export function WebSocketManager() {
  const { addNotification } = useNotifications();
  const [userId, setUserId] = useState<number | null>(null);

  // 🧠 Theo dõi thay đổi authStore
  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      const state = authStore.getState();
      if (state.isAuthenticated && state.user) {
        setUserId(Number(state.user.id));
      } else {
        setUserId(null);
      }
    });

    // Restore auth khi load trang
    authStore.restore();
    const state = authStore.getState();
    if (state.isAuthenticated && state.user) {
      setUserId(Number(state.user.id));
    }

    return unsubscribe;
  }, []);

  // 📩 Khi nhận được thông báo từ server
  const handleMessage = useCallback(
    (data: any) => {
      if (data.event === "NEW_NOTIFICATION") {
        toast.info(`${data.data.title}: ${data.data.message}`);
        addNotification(data.data);
      }
    },
    [addNotification]
  );

  // 🚀 Kết nối WebSocket
  useWebSocket(userId, "admin", handleMessage);

  return null;
}
