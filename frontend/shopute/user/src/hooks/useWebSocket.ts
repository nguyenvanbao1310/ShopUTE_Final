import { useEffect, useRef, useCallback } from "react";

/**
 * Hook quản lý WebSocket realtime
 * @param userId ID người dùng hiện tại (hoặc null nếu chưa đăng nhập)
 * @param role Vai trò ("user" hoặc "admin")
 * @param onMessage Callback khi nhận được dữ liệu mới
 */
export function useWebSocket(
  userId: number | null,
  role: "user" | "admin" | null,
  onMessage: (data: any) => void
) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const onMessageRef = useRef(onMessage);
  const isUnmounting = useRef(false);

  // 🔁 Giữ reference cho onMessage (tránh closure cũ)
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  // 🚀 Hàm kết nối WebSocket
  const connect = useCallback(() => {
    if (!userId || !role || isUnmounting.current) return;

    // Ngắt kết nối cũ nếu còn
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    console.log(`🚀 Opening WebSocket for ${role} ${userId}`);
    const ws = new WebSocket("ws://localhost:8088/ws");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WS Connected");
      // 👇 Gửi thông tin đăng ký
      ws.send(JSON.stringify({ type: "register", userId, role }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 WS Message:", data);
        onMessageRef.current?.(data);
      } catch (err) {
        console.error("❌ WS Invalid message:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WS Error:", error);
    };

    ws.onclose = () => {
      console.log("❌ WS Disconnected");
      wsRef.current = null;

      if (!isUnmounting.current && userId && role) {
        console.log("♻️ Reconnecting in 3s...");
        if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
        reconnectTimer.current = setTimeout(connect, 3000);
      }
    };
  }, [userId, role]);

  // 👇 Lifecycle quản lý WebSocket
  useEffect(() => {
    isUnmounting.current = false;

    if (userId && role) {
      connect();
    } else {
      console.log("👋 User logged out → closing WS");
      wsRef.current?.close();
      wsRef.current = null;
    }

    return () => {
      console.log("🧹 Cleanup WebSocket");
      isUnmounting.current = true;
      wsRef.current?.close();
      wsRef.current = null;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [userId, role, connect]);

  return wsRef;
}
