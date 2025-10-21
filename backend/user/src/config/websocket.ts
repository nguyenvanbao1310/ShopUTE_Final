import { Server as HTTPServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

const clients = new Map<number, WebSocket>();

export function initWebSocket(server: HTTPServer) {
  const wss = new WebSocketServer({ server, path: "/ws" }); 

  wss.on("connection", (socket: WebSocket) => {
    console.log("🔌 Client connected!");
    let currentUserId: number | null = null;

    socket.on("message", (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        console.log("📩 Received:", data);
        
        if (data.type === "register") {
          // 🧹 Đóng socket cũ nếu user đã có connection
          const oldSocket = clients.get(data.userId);
          if (oldSocket && oldSocket !== socket && oldSocket.readyState === WebSocket.OPEN) {
            console.log(`🔄 Closing old connection for user ${data.userId}`);
            oldSocket.close();
          }

          if (currentUserId !== null && currentUserId !== data.userId) {
            clients.delete(currentUserId);
          }

          currentUserId = data.userId;
          clients.set(data.userId, socket);
          console.log(`🟢 Registered user ${data.userId} (Total: ${clients.size})`);
          
          socket.send(JSON.stringify({ 
            event: "registered", 
            data: { userId: data.userId } 
          }));
        }
      } catch (err) {
        console.error("❌ Invalid WS message:", err);
      }
    });

    socket.on("error", (error) => {
      console.error("❌ WebSocket error:", error);
    });

    socket.on("close", () => {
      if (currentUserId !== null) {
        if (clients.get(currentUserId) === socket) {
          clients.delete(currentUserId);
          console.log(`🔴 User ${currentUserId} disconnected (Total: ${clients.size})`);
        }
      }
    });

    // ❤️ Heartbeat
    const pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.ping();
      } else {
        clearInterval(pingInterval);
      }
    }, 30000);

    socket.on("close", () => clearInterval(pingInterval));
  });

  // 🧹 Cleanup dead connections
  setInterval(() => {
    let cleaned = 0;
    for (const [userId, socket] of clients.entries()) {
      if (socket.readyState !== WebSocket.OPEN) {
        clients.delete(userId);
        cleaned++;
      }
    }
    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} dead connections`);
    }
  }, 60000);

  console.log("✅ WebSocket initialized");
  return wss;
}

export function sendToUser(userId: number, event: string, payload: any) {
  const socket = clients.get(userId);
  if (socket && socket.readyState === WebSocket.OPEN) {
    try {
      socket.send(JSON.stringify({ event, data: payload }));
      return true;
    } catch (err) {
      console.error(`❌ Failed to send to user ${userId}:`, err);
      return false;
    }
  }
  return false;
}

export function broadcast(event: string, payload: any, excludeUserId?: number) {
  let sent = 0;
  for (const [userId, socket] of clients.entries()) {
    if (excludeUserId && userId === excludeUserId) continue;
    
    if (socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify({ event, data: payload }));
        sent++;
      } catch (err) {
        console.error(`❌ Broadcast failed to user ${userId}`);
      }
    }
  }
  console.log(`📢 Broadcasted to ${sent} clients`);
  return sent;
}