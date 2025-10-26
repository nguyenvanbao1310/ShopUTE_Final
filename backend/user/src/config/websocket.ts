import { Server as HTTPServer } from "http";
import { WebSocketServer, WebSocket } from "ws";


interface ClientInfo {
  socket: WebSocket;
  role: "user" | "admin";
}

const clients = new Map<number, ClientInfo>();

export function initWebSocket(server: HTTPServer) {
  const wss = new WebSocketServer({ server, path: "/ws" }); 

  wss.on("connection", (socket: WebSocket) => {
    console.log("🔌 Client connected!");
    let currentUserId: number | null = null;

    socket.on("message", (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        if (data.type === "register") {
          const { userId, role } = data;
          if (!userId || !role) return;

          const old = clients.get(userId);
          if (old?.socket && old.socket !== socket && old.socket.readyState === WebSocket.OPEN) {
            old.socket.close();
          }

          clients.set(userId, { socket, role });
          currentUserId = userId;

          console.log(`🟢 Registered ${role} ${userId} (${clients.size} total)`);

          socket.send(JSON.stringify({ event: "registered", data: { userId, role } }));
        }
      } catch (err) {
        console.error("❌ Invalid WS message:", err);
      }
    });

    socket.on("error", (error) => {
      console.error("❌ WebSocket error:", error);
    });

     socket.on("close", () => {
      if (currentUserId && clients.get(currentUserId)?.socket === socket) {
        clients.delete(currentUserId);
        console.log(`🔴 Disconnected ${currentUserId}`);
      }
    });

const pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.ping();
      } else {
        clearInterval(pingInterval);
      }
    }, 30000);

    socket.on("close", () => clearInterval(pingInterval));
  });

  // 🧹 Dọn kết nối chết mỗi 60s
  setInterval(() => {
    let cleaned = 0;
    for (const [userId, client] of clients.entries()) {
      if (client.socket.readyState !== WebSocket.OPEN) {
        clients.delete(userId);
        cleaned++;
      }
    }
    if (cleaned > 0) console.log(`🧹 Cleaned ${cleaned} dead connections`);
  }, 60000);

  console.log("✅ WebSocket initialized");
  return wss;
}
/** 📩 Gửi sự kiện đến 1 user cụ thể */
export function sendToUser(userId: number, event: string, payload: any) {
  const client = clients.get(userId);
  if (client?.socket.readyState === WebSocket.OPEN) {
    try {
      client.socket.send(JSON.stringify({ event, data: payload }));
      return true;
    } catch (err) {
      console.error(`❌ Failed to send to user ${userId}:`, err);
    }
  }
  return false;
}

export function broadcastToRole(role: "user" | "admin", event: string, payload: any) {
  let sent = 0;
  for (const [, client] of clients.entries()) {
    if (client.role === role && client.socket.readyState === WebSocket.OPEN) {
      client.socket.send(JSON.stringify({ event, data: payload }));
      sent++;
    }
  }
  console.log(`📢 Broadcasted to ${sent} ${role}s`);
}