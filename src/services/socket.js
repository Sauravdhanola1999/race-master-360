import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_WSE_BASE_URL;

let socket = null;

export function initSocket(token) {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  auth: { token },  // token can be empty for public users
  reconnection: true,
});


  socket.on("connect", () => {
    console.log("🔌 Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err.message);
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
