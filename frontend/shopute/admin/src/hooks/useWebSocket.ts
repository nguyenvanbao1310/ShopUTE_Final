"use client";
import { useEffect, useRef, useCallback } from "react";

export function useWebSocket(
  userId: number | null,
  role: "admin" | "user" | null,
  onMessage: (data: any) => void
) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const isUnmounting = useRef(false);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connect = useCallback(() => {
    if (!userId || !role || isUnmounting.current) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    console.log(`🚀 Opening WS for ${role} ${userId}`);
    const ws = new WebSocket("ws://localhost:8088/ws");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WS Connected (admin)");
      ws.send(JSON.stringify({ type: "register", userId, role }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 WS message:", data);
        onMessageRef.current(data);
      } catch (err) {
        console.error("❌ WS invalid:", err);
      }
    };

    ws.onclose = () => {
      console.log("❌ WS Disconnected (admin)");
      wsRef.current = null;
      if (!isUnmounting.current) {
        reconnectTimer.current = setTimeout(connect, 3000);
      }
    };
  }, [userId, role]);

  useEffect(() => {
    isUnmounting.current = false;

    if (userId && role) connect();

    return () => {
      console.log("🧹 Cleanup WS (admin)");
      isUnmounting.current = true;
      wsRef.current?.close();
      wsRef.current = null;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [userId, role, connect]);

  return wsRef;
}
