import { useEffect, useRef, useCallback } from "react";

export function useWebSocket(
  userId: number | null, 
  onMessage: (data: any) => void
) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const onMessageRef = useRef(onMessage);
  const isUnmounting = useRef(false);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connect = useCallback(() => {
    if (!userId || isUnmounting.current) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    console.log("🚀 Opening WebSocket for user", userId);
    const ws = new WebSocket("ws://localhost:8088/ws"); // ✅ Thêm /ws
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WS Connected");
      ws.send(JSON.stringify({ type: "register", userId }));
    };

    ws.onmessage = (event) => {
      console.log("📩 Raw WS message:", event.data);
      try {
        const data = JSON.parse(event.data);
        console.log("✅ Parsed message:", data);
        onMessageRef.current(data);
      } catch (err) {
        console.error("❌ Invalid WS message:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WS Error:", error);
    };

    ws.onclose = () => {
      console.log("❌ WS Disconnected");
      wsRef.current = null;

      if (userId && !isUnmounting.current) {
        if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
        reconnectTimer.current = setTimeout(() => {
          console.log("♻️ Reconnecting...");
          connect(); // ✅ Gọi lại connect()
        }, 3000);
      }
    };
  }, [userId]);

      useEffect(() => {
      if (!userId) {
        console.log("👋 User logged out → closing WS connection");
        if (wsRef.current) {
          wsRef.current.close();
          wsRef.current = null;
        }
        return;
      }

      connect();

      return () => {
        console.log("🧹 Cleanup WS for user", userId);
        if (wsRef.current) {
          wsRef.current.close();
          wsRef.current = null;
        }
      };
    }, [userId]);


  return wsRef;
}